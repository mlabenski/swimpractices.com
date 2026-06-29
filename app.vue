<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Sitewide SEO defaults. Pages override title/description/og* via useSeoMeta;
// these provide the brand title template and the social-card fallbacks.
const {
  public: { siteUrl },
} = useRuntimeConfig()

useHead({
  titleTemplate: (title) =>
    title && !/swimpractices/i.test(title)
      ? `${title} · SwimPractices`
      : title || 'SwimPractices — Free AI Swim Practice Generator',
})

useSeoMeta({
  ogSiteName: 'SwimPractices',
  ogType: 'website',
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'SwimPractices — AI swim practice generator',
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/og-image.png`,
})
</script>
