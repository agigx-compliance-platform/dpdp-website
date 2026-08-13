import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

export function ConsentGatedGtagScripts() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        id="gtag-js"
        type="text/plain"
        data-cookie-category="analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        type="text/plain"
        data-cookie-category="analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`,
        }}
      />
    </>
  )
}
