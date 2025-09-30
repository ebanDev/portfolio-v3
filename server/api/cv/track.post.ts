import { getRequestHeader, getRequestIP, readBody } from 'h3'

const NTFS_ENDPOINT = 'https://ntfy.sh/TEMA-LE-CV-WESH'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    fingerprint?: {
      visitorId?: string
      confidence?: unknown
      components?: Record<string, unknown>
      requestId?: string | null
      timing?: unknown
      version?: string | null
    }
    userAgent?: string
    language?: string
    languages?: string[]
    platform?: string
    timezone?: string
    screen?: Record<string, unknown>
    referrer?: string | null
  }>(event)

  const ip = getRequestIP(event)
  const forwardedFor = getRequestHeader(event, 'x-forwarded-for')
  const realIp = getRequestHeader(event, 'x-real-ip')
  const cfConnectingIp = getRequestHeader(event, 'cf-connecting-ip')
  const userAgent = body?.userAgent || getRequestHeader(event, 'user-agent')
  const acceptLanguage = getRequestHeader(event, 'accept-language')

  const notificationPayload = {
    timestamp: new Date().toISOString(),
    ip,
    forwardedFor,
    realIp,
    cfConnectingIp,
    userAgent,
    acceptLanguage,
    language: body?.language,
    languages: body?.languages,
    platform: body?.platform,
    timezone: body?.timezone,
    screen: body?.screen,
    referrer: body?.referrer,
    fingerprint: body?.fingerprint ?? null
  }

  const message = `CV route visited\n${JSON.stringify(notificationPayload, null, 2)}`

  try {
    await $fetch(NTFS_ENDPOINT, {
      method: 'POST',
      body: message,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  } catch (error) {
    console.error('Failed to notify ntfy for /cv visit', error)
  }

  return { status: 'ok' }
})
