import type { Metadata } from 'next'

type PageSeoInput = {
  title: string
  description: string
  path: `/${string}`
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
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
      title: socialTitle,
      description: socialDescription,
      url: path,
    },
    twitter: {
      title: socialTitle,
      description: socialDescription,
    },
  }
}
