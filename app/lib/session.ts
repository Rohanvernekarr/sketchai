"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import prisma from "./prisma";

export async function createAnonymousSession(
  ipAddress?: string,
  userAgent?: string,
) {
  const sessionId = uuidv4();
  const cookieStore = await cookies();

  // Set cookie
  cookieStore.set("anonymous_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    path: "/",
  });

  // Create database record
  await prisma.anonymousSession.create({
    data: {
      sessionId,
      ipAddress,
      userAgent,
    },
  });

  return sessionId;
}

export async function getAnonymousSession() {
  const cookieStore = await cookies();
  return cookieStore.get("anonymous_session")?.value;
}

export async function getSessionUsage(sessionId: string) {
  const session = await prisma.anonymousSession.findUnique({
    where: { sessionId },
  });

  return session;
}

export async function incrementUsage(sessionId: string) {
  const session = await prisma.anonymousSession.update({
    where: { sessionId },
    data: {
      promptCount: {
        increment: 1,
      },
      lastUsedAt: new Date(),
    },
  });

  return session;
}

export async function createSessionRecord(
  sessionId: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const existing = await prisma.anonymousSession.findUnique({
    where: { sessionId },
  });

  if (!existing) {
    await prisma.anonymousSession.create({
      data: {
        sessionId,
        ipAddress,
        userAgent,
      },
    });
  }

  return existing || { sessionId, promptCount: 0 };
}

export async function cleanupOldSessions() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  await prisma.anonymousSession.deleteMany({
    where: {
      lastUsedAt: {
        lt: thirtyDaysAgo,
      },
    },
  });
}

// Daily usage functions for authenticated users
export async function checkDailyUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dailyPromptCount: true,
      lastPromptDate: true,
      premium: true,
    },
  });

  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPromptDate = user.lastPromptDate
    ? new Date(user.lastPromptDate)
    : null;
  const isNewDay = !lastPromptDate || lastPromptDate < today;

  // Reset count if it's a new day
  if (isNewDay) {
    return {
      dailyPromptCount: 0,
      premium: user.premium,
      needsReset: true,
    };
  }

  return {
    dailyPromptCount: user.dailyPromptCount,
    premium: user.premium,
    needsReset: false,
  };
}

export async function incrementDailyUsage(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyPromptCount: true, lastPromptDate: true },
  });

  if (!user) throw new Error("User not found");

  const lastPromptDate = user.lastPromptDate
    ? new Date(user.lastPromptDate)
    : null;
  const isNewDay = !lastPromptDate || lastPromptDate < today;

  // Reset count if it's a new day, otherwise increment
  const newCount = isNewDay ? 1 : user.dailyPromptCount + 1;

  return await prisma.user.update({
    where: { id: userId },
    data: {
      dailyPromptCount: newCount,
      lastPromptDate: new Date(),
    },
  });
}

export async function checkUserLimits(sessionId?: string, userId?: string) {
  // If user is authenticated, check daily limits
  if (userId) {
    const dailyUsage = await checkDailyUsage(userId);

    if (!dailyUsage) {
      return {
        hasAccess: false,
        isPremium: false,
        remainingPrompts: 0,
        isAnonymous: false,
        error: "User not found",
      };
    }

    // Premium users have unlimited access
    if (dailyUsage.premium) {
      return {
        hasAccess: true,
        isPremium: true,
        remainingPrompts: -1, // -1 means unlimited
        isAnonymous: false,
      };
    }

    // Regular users get 3 prompts per day
    const dailyLimit = 3;
    const currentCount = dailyUsage.needsReset
      ? 0
      : dailyUsage.dailyPromptCount;
    const remainingPrompts = Math.max(0, dailyLimit - currentCount);

    return {
      hasAccess: remainingPrompts > 0,
      isPremium: false,
      remainingPrompts,
      isAnonymous: false,
      isDaily: true,
    };
  }

  // Check anonymous session limits
  if (!sessionId) {
    return {
      hasAccess: true,
      isPremium: false,
      remainingPrompts: 1,
      isAnonymous: true,
      needsSession: true,
    };
  }

  const session = await getSessionUsage(sessionId);
  if (!session) {
    return {
      hasAccess: true,
      isPremium: false,
      remainingPrompts: 1,
      isAnonymous: true,
      needsSession: true,
    };
  }

  const remainingPrompts = Math.max(0, 1 - session.promptCount);

  return {
    hasAccess: remainingPrompts > 0,
    isPremium: false,
    remainingPrompts,
    isAnonymous: true,
    needsSession: false,
  };
}
