---
name: seo-optimizer
description: When the user needs technical SEO audits, meta tag optimization, structured data markup, Core Web Vitals improvement, or search engine visibility enhancement.
---

# SEO Optimizer

## Overview

Optimize websites for search engine visibility through technical SEO, on-page optimization, structured data implementation, and Core Web Vitals performance tuning. This skill covers crawlability, indexability, meta tag strategy, Schema.org markup, sitemap generation, canonical URL management, internationalization (hreflang), and performance optimization for Google's ranking signals.

## Process

### Phase 1: Technical Audit
1. Crawl the site (Screaming Frog, Sitebulb, or custom script)
2. Check robots.txt and XML sitemap validity
3. Identify crawl errors, redirect chains, and broken links
4. Verify canonical URLs and duplicate content handling
5. Assess mobile-friendliness and responsive design
6. Check HTTPS implementation and mixed content
7. Evaluate page load performance (Core Web Vitals)

### Phase 2: On-Page Optimization
1. Audit title tags (unique, 50-60 chars, keyword placement)
2. Review meta descriptions (unique, 150-160 chars, compelling CTAs)
3. Analyze heading hierarchy (single H1, logical H2-H6 structure)
4. Optimize image alt text and file names
5. Review internal linking structure and anchor text
6. Check URL structure (short, descriptive, hyphenated)
7. Validate Open Graph and Twitter Card tags

### Phase 3: Structured Data
1. Identify applicable Schema.org types for content
2. Implement JSON-LD structured data
3. Validate with Google Rich Results Test
4. Test for rich snippet eligibility
5. Monitor Search Console for structured data errors

### Phase 4: Monitoring
1. Set up Google Search Console monitoring
2. Track Core Web Vitals over time
3. Monitor indexation status and coverage
4. Review search performance (clicks, impressions, CTR, position)
5. Set up alerts for crawl errors and ranking drops

## Meta Tag Reference

### Essential Meta Tags
```html
<head>
  <!-- Primary -->
  <title>Primary Keyword - Secondary Keyword | Brand Name</title>
  <meta name="description" content="Compelling 150-160 char description with target keyword and clear value proposition.">
  <link rel="canonical" href="https://example.com/page">

  <!-- Robots -->
  <meta name="robots" content="index, follow">
  <!-- or noindex, nofollow for pages that shouldn't be indexed -->

  <!-- Viewport (mobile) -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Page Title for Social Sharing">
  <meta property="og:description" content="Description optimized for social sharing.">
  <meta property="og:image" content="https://example.com/og-image.jpg">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:site_name" content="Brand Name">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Twitter-optimized description.">
  <meta name="twitter:image" content="https://example.com/twitter-image.jpg">

  <!-- Internationalization -->
  <link rel="alternate" hreflang="en" href="https://example.com/en/page">
  <link rel="alternate" hreflang="de" href="https://example.com/de/page">
  <link rel="alternate" hreflang="x-default" href="https://example.com/page">
</head>
```

### Meta Tag Optimization Matrix
| Element | Max Length | Priority Keywords | Common Mistakes |
|---|---|---|---|
| Title tag | 50-60 chars | Front-load primary keyword | Too long, keyword stuffing, duplicate |
| Meta description | 150-160 chars | Include CTA and keyword | Missing, duplicate, no CTA |
| H1 | N/A (single per page) | Primary keyword variation | Multiple H1s, missing H1 |
| URL slug | 3-5 words | Target keyword | Too long, parameters, underscores |
| Image alt | 125 chars | Descriptive, keyword if natural | Empty, "image of...", keyword stuffing |
| OG title | 60-90 chars | Engaging, shareable | Same as title tag (missed opportunity) |

## Structured Data (JSON-LD)

### Article
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize Core Web Vitals",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/authors/jane-smith"
  },
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-15",
  "image": "https://example.com/images/article-hero.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Example Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "description": "A comprehensive guide to improving LCP, FID, and CLS scores."
}
</script>
```

### Product
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Widget Pro",
  "description": "Professional-grade widget for enterprise use.",
  "image": "https://example.com/widget-pro.jpg",
  "brand": { "@type": "Brand", "name": "WidgetCo" },
  "offers": {
    "@type": "Offer",
    "price": "49.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/widget-pro"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "312"
  }
}
</script>
```

### FAQ Page
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Core Web Vitals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Core Web Vitals are a set of metrics that measure real-world user experience for loading, interactivity, and visual stability."
      }
    }
  ]
}
</script>
```

### Schema Type Decision Guide
| Content Type | Schema Type | Rich Result |
|---|---|---|
| Blog post | Article | Article snippet |
| Product page | Product | Price, rating, availability |
| FAQ section | FAQPage | Expandable Q&A |
| How-to guide | HowTo | Step-by-step snippet |
| Recipe | Recipe | Image, time, rating |
| Event | Event | Date, location, price |
| Local business | LocalBusiness | Map pack, hours |
| Software | SoftwareApplication | Rating, price |
| Breadcrumbs | BreadcrumbList | Breadcrumb trail |
| Video | VideoObject | Thumbnail, duration |

## Core Web Vitals

### Metrics and Thresholds
| Metric | Good | Needs Improvement | Poor | Measures |
|---|---|---|---|---|
| LCP (Largest Contentful Paint) | <= 2.5s | <= 4.0s | > 4.0s | Loading performance |
| INP (Interaction to Next Paint) | <= 200ms | <= 500ms | > 500ms | Interactivity |
| CLS (Cumulative Layout Shift) | <= 0.1 | <= 0.25 | > 0.25 | Visual stability |

### LCP Optimization
```html
<!-- Preload hero image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Use modern image formats -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Hero description" width="1200" height="600"
       fetchpriority="high" decoding="async">
</picture>
```

### CLS Prevention
```css
/* Always set dimensions on images and video */
img, video {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}

/* Reserve space for dynamic content */
.ad-slot {
  min-height: 250px;
}

/* Avoid inserting content above existing content */
.notification-bar {
  position: fixed; /* doesn't shift layout */
}
```

### INP Optimization
```javascript
// Break long tasks with yield
async function processLargeDataset(data) {
  for (let i = 0; i < data.length; i++) {
    processItem(data[i]);
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0)); // yield to main thread
    }
  }
}

// Use requestIdleCallback for non-critical work
requestIdleCallback(() => {
  loadAnalytics();
  initNonCriticalFeatures();
});
```

## XML Sitemap

### Generation Pattern
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Sitemap Best Practices
- Maximum 50,000 URLs per sitemap file
- Use sitemap index for larger sites
- Include only canonical, indexable URLs
- Update `lastmod` only when content genuinely changes
- Submit via Google Search Console and robots.txt

## robots.txt Template
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /search?
Disallow: /*?sort=
Disallow: /*?filter=

Sitemap: https://example.com/sitemap.xml
```

## Next.js / React SEO Patterns

### Next.js Metadata API (App Router)
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Brand Name',
    default: 'Brand Name - Tagline',
  },
  description: 'Site-wide default description.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'Brand Name',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://example.com',
  },
};
```

### Dynamic Metadata per Page
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      images: [{ url: product.image, width: 1200, height: 630 }],
    },
  };
}
```

## Anti-Patterns

- Keyword stuffing in titles, meta descriptions, or content
- Using the same title and meta description across multiple pages
- Blocking CSS/JS in robots.txt (Googlebot needs to render pages)
- Implementing structured data that doesn't match visible page content
- Redirect chains longer than 2 hops
- Using JavaScript-only navigation without server-rendered links
- Ignoring Core Web Vitals in favor of content-only SEO
- Not setting canonical URLs, leading to duplicate content penalties
- Over-optimizing anchor text for internal links (unnatural patterns)
- Hiding content with CSS for SEO purposes (cloaking)

## Skill Type

**FLEXIBLE** — Adapt the optimization strategy to the site's technology stack, content type, and competitive landscape. Technical SEO fundamentals and structured data best practices are strongly recommended; specific implementation patterns vary by framework.
