import { createBrowserClient } from '@supabase/ssr'

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.split(';').find(c => c.trim().startsWith(`${name}=`))
  if (!match) return ''
  return match.trim().slice(name.length + 1)
}

function setCookie(name: string, value: string, options: Record<string, any> = {}) {
  if (typeof document === 'undefined') return
  let cookieStr = `${name}=${value}`
  if (options.maxAge) cookieStr += `; Max-Age=${options.maxAge}`
  cookieStr += `; Path=${options.path ?? '/'}`
  if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`
  if (options.secure || (typeof window !== 'undefined' && window.location.protocol === 'https:'))
    cookieStr += `; Secure`
  document.cookie = cookieStr
}

function removeCookie(name: string, options: Record<string, any> = {}) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Path=${options.path ?? '/'}; Max-Age=0`
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // v0.5+ API
        getAll() {
          if (typeof document === 'undefined') return []
          return document.cookie.split(';').map(c => {
            const eqIdx = c.trim().indexOf('=')
            return {
              name: c.trim().slice(0, eqIdx),
              value: c.trim().slice(eqIdx + 1),
            }
          }).filter(c => c.name)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => setCookie(name, value, options ?? {}))
        },
        // legacy API (< v0.5)
        get: getCookie,
        set: setCookie,
        remove: removeCookie,
      },
    }
  )
}
