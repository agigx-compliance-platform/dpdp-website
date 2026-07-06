const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

export function ConsentGatedGtagScripts() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <script
        type="text/plain"
        data-cookie-category="analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        async
      />
      <script
        type="text/plain"
        data-cookie-category="analytics"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`,
        }}
      />
    </>
  )
}
