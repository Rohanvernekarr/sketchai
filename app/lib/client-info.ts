import { NextRequest } from 'next/server'

export function getClientInfo(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] 
    || request.headers.get('x-real-ip') 
    || 'unknown'
    
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return { ipAddress, userAgent }
}

export function getClientInfoFromHeaders(headers: Headers) {
  const ipAddress = headers.get('x-forwarded-for')?.split(',')[0] 
    || headers.get('x-real-ip') 
    || 'unknown'
    
  const userAgent = headers.get('user-agent') || 'unknown'
  
  return { ipAddress, userAgent }
}