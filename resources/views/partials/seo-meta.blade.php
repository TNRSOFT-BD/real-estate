@php
    $meta = \App\Support\Seo\SeoMetaBuilder::forPage($page ?? []);
@endphp

<title inertia>{{ $meta['title'] }}</title>

@if ($meta['description'])
    <meta inertia="seo-description" name="description" content="{{ $meta['description'] }}">
@endif

@if ($meta['keywords'])
    <meta inertia="seo-keywords" name="keywords" content="{{ $meta['keywords'] }}">
@endif

@if ($meta['robots'])
    <meta inertia="seo-robots" name="robots" content="{{ $meta['robots'] }}">
@endif

<link inertia="seo-canonical" rel="canonical" href="{{ $meta['canonical'] }}">

<meta inertia="seo-og-type" property="og:type" content="{{ $meta['og_type'] }}">
<meta inertia="seo-og-title" property="og:title" content="{{ $meta['og_title'] }}">
@if ($meta['og_description'])
    <meta inertia="seo-og-description" property="og:description" content="{{ $meta['og_description'] }}">
@endif
@if ($meta['og_image'])
    <meta inertia="seo-og-image" property="og:image" content="{{ $meta['og_image'] }}">
@endif
<meta inertia="seo-og-url" property="og:url" content="{{ $meta['og_url'] }}">
<meta inertia="seo-og-site-name" property="og:site_name" content="{{ $meta['og_site_name'] }}">
<meta inertia="seo-og-locale" property="og:locale" content="{{ $meta['og_locale'] }}">

<meta inertia="seo-twitter-card" name="twitter:card" content="{{ $meta['twitter_card'] }}">
<meta inertia="seo-twitter-title" name="twitter:title" content="{{ $meta['twitter_title'] }}">
@if ($meta['twitter_description'])
    <meta inertia="seo-twitter-description" name="twitter:description" content="{{ $meta['twitter_description'] }}">
@endif
@if ($meta['twitter_image'])
    <meta inertia="seo-twitter-image" name="twitter:image" content="{{ $meta['twitter_image'] }}">
@endif

@foreach ($meta['json_ld'] as $index => $block)
    <script type="application/ld+json" data-seo-json-ld="{{ $index }}">{!! json_encode($block, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
@endforeach
