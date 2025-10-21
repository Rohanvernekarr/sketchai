import { betterAuth } from "better-auth"

export const auth = betterAuth({
    socialProviders: {
        google: { 
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
})