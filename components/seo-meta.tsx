import Head from "next/head"
import { getBaseUrl, PRIMARY_DOMAIN } from "@/lib/domain-utils"

interface SeoMetaProps {
  title?: string
  description?: string
  ogImage?: string
  path?: string
}

export function SeoMeta({
  title = "SF Deputy Sheriff Recruitment",
  description = "Join the San Francisco Sheriff's Office and become part of a team dedicated to public safety and community service.",
  ogImage = "/images/og-image.jpg",
  path = "",
}: SeoMetaProps) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${path}`
  const fullOgImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImageUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href={`//${PRIMARY_DOMAIN}`} />
      <link rel="preconnect" href={`https://${PRIMARY_DOMAIN}`} />
    </Head>
  )
}
