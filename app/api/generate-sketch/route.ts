import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { getAnonymousSession, createAnonymousSession, checkUserLimits, incrementUsage, createSessionRecord, incrementDailyUsage } from '@/app/lib/session'
import { getClientInfo } from '@/app/lib/client-info'
import { geminiService } from '@/app/services/geminiService'

export async function POST(request: NextRequest) {
  try {
    
    const { ipAddress, userAgent } = getClientInfo(request)
    
    const session = await auth.api.getSession({
      headers: request.headers
    })
    
    const userId = session?.user?.id
    let sessionId = await getAnonymousSession()
    
    if (!userId && !sessionId) {
      sessionId = await createAnonymousSession(ipAddress, userAgent)
    } else if (!userId && sessionId) {
      await createSessionRecord(sessionId, ipAddress, userAgent)
    }
    
    const limits = await checkUserLimits(sessionId, userId)
    
    if (!limits.hasAccess) {
      return NextResponse.json({
        success: false,
        error: 'FREE_LIMIT_REACHED',
        message: 'You have reached your free trial limit. Please login to continue.',
        remainingPrompts: limits.remainingPrompts,
        isAnonymous: limits.isAnonymous
      }, { status: 403 })
    }
    
    // Parse request body
    const { prompt } = await request.json()
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'INVALID_PROMPT',
        message: 'Please provide a valid prompt.'
      }, { status: 400 })
    }
    
    const result = await geminiService.generateSystemDesign(prompt)
    
    if (userId) {
      await incrementDailyUsage(userId)
    } else if (sessionId) {
      await incrementUsage(sessionId)
    }
    
    const newLimits = await checkUserLimits(sessionId, userId)
    
    return NextResponse.json({
      success: true,
      data: result,
      remainingPrompts: newLimits.remainingPrompts,
      isAnonymous: newLimits.isAnonymous,
      isPremium: newLimits.isPremium
    })
    
  } catch (error) {
    console.error('Error generating sketch:', error)
    return NextResponse.json({
      success: false,
      error: 'GENERATION_ERROR',
      message: 'Failed to generate sketch. Please try again.'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })
    
    const userId = session?.user?.id
    const sessionId = await getAnonymousSession()
    
    const limits = await checkUserLimits(sessionId, userId)
    
    return NextResponse.json({
      success: true,
      limits
    })
    
  } catch (error) {
    console.error('Error checking limits:', error)
    return NextResponse.json({
      success: false,
      error: 'ERROR_CHECKING_LIMITS',
      message: 'Failed to check usage limits.'
    }, { status: 500 })
  }
}