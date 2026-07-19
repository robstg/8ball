'use client'

import { useEffect, useRef } from 'react'

/**
 * Renders raw HTML (from Sanity's htmlEmbed field) and — critically —
 * actually executes any <script> tags inside it.
 *
 * The bug this fixes: setting innerHTML (directly, or via React's
 * dangerouslySetInnerHTML) never executes embedded <script> tags. That's
 * not a framework quirk, it's standard DOM behaviour — scripts inserted
 * via innerHTML are inert by spec. A hard page reload works because the
 * browser parses the whole document fresh from the server and DOES run
 * inline scripts encountered during that initial parse. But a client-side
 * route transition (clicking a <Link> elsewhere on the site) never
 * triggers a fresh parse — React just mutates the DOM — so the script
 * silently never runs, and the tool loads "dead" until refreshed.
 *
 * Fix: after setting the HTML, find any <script> tags that just got
 * inserted and manually re-create them via document.createElement +
 * appendChild. Scripts inserted that way DO execute, regardless of
 * whether this is a hard load or a soft client-side navigation.
 */
export function HtmlEmbed({ html, className }: { html: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !html) return

    container.innerHTML = html

    const inertScripts = Array.from(container.querySelectorAll('script'))
    inertScripts.forEach((oldScript) => {
      const liveScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        liveScript.setAttribute(attr.name, attr.value)
      })
      liveScript.textContent = oldScript.textContent
      oldScript.parentNode?.replaceChild(liveScript, oldScript)
    })
  }, [html])

  if (!html) return null

  return <div ref={containerRef} className={className} />
}