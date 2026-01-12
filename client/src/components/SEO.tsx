import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  product?: {
    name: string;
    description: string;
    brand?: string;
    price?: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    ratingValue?: number;
    ratingCount?: number;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  noindex?: boolean;
  canonical?: string;
  locale?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
}

const SITE_NAME = 'LLM-Plattform Vergleich';
const DEFAULT_DESCRIPTION = 'Vergleichen Sie DSGVO-konforme KI-Lösungen für Ihr Unternehmen. Finden Sie die beste LLM-Plattform mit unserem umfassenden Vergleich.';
const DEFAULT_IMAGE = '/og-image.png';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://llm-vergleich.de';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  article,
  product,
  breadcrumbs,
  noindex = false,
  canonical,
  locale = 'de_DE',
  alternateLocales
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : fullUrl;

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['German', 'English']
    }
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // Article Schema
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: fullImage,
    author: {
      '@type': 'Person',
      name: article.author || 'Redaktion'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    articleSection: article.section,
    keywords: article.tags?.join(', ')
  } : null;

  // Product/Software Schema
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: product.price ? {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'EUR',
      availability: `https://schema.org/${product.availability || 'InStock'}`
    } : undefined,
    aggregateRating: product.ratingValue ? {
      '@type': 'AggregateRating',
      ratingValue: product.ratingValue,
      ratingCount: product.ratingCount || 1,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand
    } : undefined
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    }))
  } : null;

  // FAQ Schema (can be extended)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Was sind DSGVO-konforme LLM-Plattformen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DSGVO-konforme LLM-Plattformen sind KI-Lösungen, die den europäischen Datenschutzrichtlinien entsprechen. Sie speichern Daten in der EU, bieten transparente Datenverarbeitung und ermöglichen Unternehmen die sichere Nutzung von Large Language Models.'
        }
      },
      {
        '@type': 'Question',
        name: 'Welche LLM-Plattform ist die beste für deutsche Unternehmen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Die beste Plattform hängt von Ihren spezifischen Anforderungen ab. Faktoren wie Unternehmensgröße, Budget, benötigte Funktionen und Compliance-Anforderungen spielen eine wichtige Rolle. Nutzen Sie unseren Vergleich, um die passende Lösung zu finden.'
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Language */}
      <html lang={locale.split('_')[0]} />
      <meta property="og:locale" content={locale} />
      
      {/* Alternate Languages */}
      {alternateLocales?.map(alt => (
        <link key={alt.locale} rel="alternate" hrefLang={alt.locale.split('_')[0]} href={`${SITE_URL}${alt.url}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      
      {/* Article specific OG */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {type === 'website' && url === '/' && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      
      {/* GEO Meta Tags for DACH Region */}
      <meta name="geo.region" content="DE" />
      <meta name="geo.placename" content="Deutschland" />
      <meta name="ICBM" content="51.1657, 10.4515" />
      
      {/* Additional SEO */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0F172A" />
    </Helmet>
  );
}

// Preset SEO configurations for common pages
export const SEOPresets = {
  home: {
    title: 'DSGVO-konforme LLM-Plattformen im Vergleich',
    description: 'Vergleichen Sie die besten DSGVO-konformen KI-Lösungen für Ihr Unternehmen. Filtern Sie nach Preismodell, Funktionen und Compliance-Standards.',
    keywords: 'LLM Plattform, DSGVO konform, KI für Unternehmen, ChatGPT Alternative, Enterprise AI, Datenschutz KI',
    url: '/'
  },
  blog: {
    title: 'Blog - Wissen rund um KI & DSGVO',
    description: 'Aktuelle Artikel, Leitfäden und Best Practices zu DSGVO-konformen KI-Lösungen für Unternehmen.',
    keywords: 'KI Blog, DSGVO Leitfaden, Enterprise AI, LLM Tipps, Datenschutz KI',
    url: '/blog'
  },
  compare: {
    title: 'LLM-Plattformen vergleichen',
    description: 'Detaillierter Vergleich aller DSGVO-konformen LLM-Plattformen. Finden Sie die beste Lösung für Ihre Anforderungen.',
    keywords: 'LLM Vergleich, KI Plattform Vergleich, Enterprise AI Vergleich',
    url: '/vergleich'
  }
};
