import { NextRequest, NextResponse } from 'next/server'
import { cleanupOldSessions } from '@/app/lib/session'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CLEANUP_AUTH_TOKEN || 'your-secret-cleanup-token'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({
        success: false,
        error: 'UNAUTHORIZED'
      }, { status: 401 })
    }
    
    await cleanupOldSessions()
    
    return NextResponse.json({
      success: true,
      message: 'Old sessions cleaned up successfully'
    })
    
  } catch (error) {
    console.error('Error during cleanup:', error)
    return NextResponse.json({
      success: false,
      error: 'CLEANUP_ERROR',
      message: 'Failed to cleanup old sessions'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        error: 'NOT_AVAILABLE_IN_PRODUCTION'
      }, { status: 403 })
    }
    
    await cleanupOldSessions()
    
    return NextResponse.json({
      success: true,
      message: 'Cleanup completed (development only)'
    })
    
  } catch (error) {
    console.error('Error during manual cleanup:', error)
    return NextResponse.json({
      success: false,
      error: 'CLEANUP_ERROR',
      message: 'Failed to cleanup old sessions'
    }, { status: 500 })
  }
}