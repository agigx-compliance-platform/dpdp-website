import type { Metadata } from 'next'

type PageSeoInput = {
  title: string
  description: string
  path: `/${string}`
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
}

const OG_IMAGE = {
  url: '/images/brand/social-icon-1024.png',
  width: 1024,
  height: 1024,
  alt: 'DPDP Consultancy — DPDP Compliance Platform for India',
}

export function pageSeo({
  title,
  description,
  path,
  keywords,
  ogTitle,
  ogDescription,
}: PageSeoInput): Metadata {
  const socialTitle = ogTitle ?? title
  const socialDescription = ogDescription ?? description

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: 'DPDP Consultancy',
      title: socialTitle,
      description: socialDescription,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: [OG_IMAGE.url],
    },
  }
}
