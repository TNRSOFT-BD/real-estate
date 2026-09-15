import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type HomeHeroData } from '@/types/project';
import { type HeroVideoQuality } from '@/types/site';
import { useEffect, useState } from 'react';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/foq7fnat/video/upload';
const DEMO_VIDEO_ID = 'v1789364512/Landscape_yshfbt';

const DEFAULT_EYEBROW = 'Excellence in Real Estate';
const DEFAULT_TITLE = 'Crafting Iconic Landmarks & Luxury Living';
const DEFAULT_DESCRIPTION =
    "Discover bespoke architectural designs and premium residential properties in the city's most prestigious locations.";

const SLIDESHOW_INTERVAL_MS = 5000;

interface VideoTier {
    desktopWidth: number;
    mobileWidth: number;
    quality: string;
}

/**
 * Admin-selectable hero video tiers. `good` is the default. Mobile always gets
 * a smaller width so phones stay lighter on data.
 */
const VIDEO_TIERS: Record<HeroVideoQuality, VideoTier> = {
    auto: { desktopWidth: 1920, mobileWidth: 1280, quality: 'q_auto' },
    eco: { desktopWidth: 1280, mobileWidth: 720, quality: 'q_auto:eco' },
    good: { desktopWidth: 1920, mobileWidth: 1280, quality: 'q_auto:good' },
    best: { desktopWidth: 2560, mobileWidth: 1920, quality: 'q_auto:best' },
};

function demoVideoUrl(tier: VideoTier, width: number): string {
    return `${CLOUDINARY_BASE}/${tier.quality},w_${width},c_limit/${DEMO_VIDEO_ID}.mp4`;
}

function demoPosterUrl(tier: VideoTier): string {
    return `${CLOUDINARY_BASE}/so_0,f_auto,q_auto,w_${tier.desktopWidth}/${DEMO_VIDEO_ID}.jpg`;
}

function isCloudinary(url: string): boolean {
    return /res\.cloudinary\.com/i.test(url);
}

function withCloudinaryTransform(url: string, transform: string): string {
    return url.replace('/video/upload/', `/video/upload/${transform}/`);
}

/**
 * Build a first-frame poster for a Cloudinary video URL. Returns null for any
 * non-Cloudinary URL (nothing can be derived for those).
 */
function cloudinaryVideoPoster(url: string, width: number): string | null {
    if (!isCloudinary(url)) {
        return null;
    }

    return withCloudinaryTransform(url, `so_0,f_auto,q_auto,w_${width}`).replace(/\.(mp4|webm|mov)(?=(\?|$))/i, '.jpg');
}

function prefersStillMedia(): boolean {
    if (typeof window === 'undefined') {
        return true;
    }

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData === true;
}

function parseYouTubeId(url: string | null | undefined): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Compute the poster (first-frame) URL for a given video source.  This must
 * be a pure function so it can be called both from the useState initializer
 * (first render, synchronously) and from the useEffect (prop changes).
 */
function computePoster(
    source: string,
    videoLink: string | null,
    videoUrl: string | null,
    tier: VideoTier,
    firstImage: string | null,
): string | null {
    if (source === 'url' && videoLink) {
        const youtubeId = parseYouTubeId(videoLink);
        if (youtubeId) {
            return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
        return cloudinaryVideoPoster(videoLink, tier.desktopWidth) ?? firstImage ?? null;
    }

    if (source === 'upload' && videoUrl) {
        return cloudinaryVideoPoster(videoUrl, tier.desktopWidth) ?? firstImage ?? null;
    }

    if (source === 'default') {
        return demoPosterUrl(tier);
    }

    return firstImage ?? null;
}

interface HomeHeroProps {
    hero: HomeHeroData;
}

export default function HomeHero({ hero }: HomeHeroProps) {
    const quality = hero.video_quality ?? 'good';
    const tier = VIDEO_TIERS[quality] ?? VIDEO_TIERS.good;
    const source = hero.video_source ?? 'default';

    const imageUrls = (hero.images ?? []).map((path) => mediaUrl(path)).filter((src): src is string => Boolean(src));
    const imageCount = imageUrls.length;
    const firstImage = imageUrls[0] ?? null;
    const imageFallback = firstImage ?? demoPosterUrl(tier);

    const eyebrow = hero.eyebrow?.trim() || DEFAULT_EYEBROW;
    const title = hero.title?.trim() || DEFAULT_TITLE;
    const description = hero.description?.trim() || DEFAULT_DESCRIPTION;

    const [ready, setReady] = useState(false);
    const [slide, setSlide] = useState(0);
    const [posterSrc, setPosterSrc] = useState<string | null>(() =>
        computePoster(source, hero.video_link, hero.video_url, tier, firstImage),
    );

    const youtubeEmbedUrl = resolveYouTubeEmbedUrl();
    const videoSrc = resolveVideoSrc();

    useEffect(() => {
        setReady(false);
    }, [source, hero.video_link, hero.video_url, hero.video_enabled]);

    useEffect(() => {
        setPosterSrc(computePoster(source, hero.video_link, hero.video_url, tier, firstImage));
    }, [source, hero.video_link, hero.video_url, tier, firstImage]);

    useEffect(() => {
        if (!youtubeEmbedUrl) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (data?.event === 'infoDelivery' && (data?.info?.playerState === 1 || data?.info?.currentTime > 0)) {
                    setReady(true);
                }
            } catch {}
        };

        window.addEventListener('message', handleMessage);

        const timer = setTimeout(() => {
            setReady(true);
        }, 1200);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timer);
        };
    }, [youtubeEmbedUrl]);

    useEffect(() => {
        if (imageCount <= 1 || prefersStillMedia()) {
            return;
        }

        const id = window.setInterval(() => setSlide((current) => (current + 1) % imageCount), SLIDESHOW_INTERVAL_MS);

        return () => window.clearInterval(id);
    }, [imageCount]);

    function resolveYouTubeEmbedUrl(): string | null {
        if (!hero.video_enabled || source !== 'url' || !hero.video_link) {
            return null;
        }

        const videoId = parseYouTubeId(hero.video_link);
        if (!videoId) {
            return null;
        }

        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`;
    }

    function resolveVideoSrc(): string | null {
        if (!hero.video_enabled || prefersStillMedia()) {
            return null;
        }

        const width = typeof window !== 'undefined' && window.innerWidth < 768 ? tier.mobileWidth : tier.desktopWidth;

        if (source === 'upload' && hero.video_url) {
            return isCloudinary(hero.video_url) ? withCloudinaryTransform(hero.video_url, `${tier.quality},w_${width},c_limit`) : hero.video_url;
        }

        if (source === 'url' && hero.video_link) {
            if (parseYouTubeId(hero.video_link)) {
                return null;
            }
            return isCloudinary(hero.video_link) ? withCloudinaryTransform(hero.video_link, `${tier.quality},w_${width},c_limit`) : hero.video_link;
        }

        if (source === 'default') {
            return demoVideoUrl(tier, width);
        }

        return null;
    }

    const activeSlide = imageCount > 0 ? slide % imageCount : 0;
    const activeVideoPoster = posterSrc ?? firstImage ?? null;

    return (
        <section
            className="relative isolate flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-end overflow-hidden bg-black text-white lg:min-h-[calc(100svh-4rem)]"
            aria-labelledby="home-hero-title"
        >
            <div className="absolute inset-0 z-0">
                {/* When video is enabled, show the specific video's own initial poster image as backdrop */}
                {hero.video_enabled ? (
                    activeVideoPoster ? (
                        <img
                            src={activeVideoPoster}
                            alt=""
                            aria-hidden
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src.includes('maxresdefault.jpg')) {
                                    target.src = target.src.replace('maxresdefault.jpg', 'sddefault.jpg');
                                } else if (target.src.includes('sddefault.jpg')) {
                                    target.src = target.src.replace('sddefault.jpg', 'hqdefault.jpg');
                                }
                            }}
                            className="absolute inset-0 size-full object-cover"
                        />
                    ) : null
                ) : imageCount > 1 ? (
                    <div className="absolute inset-0" aria-hidden>
                        {imageUrls.map((src, index) => {
                            const active = index === activeSlide;

                            return (
                                <div
                                    key={src}
                                    className={cn('absolute inset-0 transition-opacity duration-[1200ms] ease-out', active ? 'opacity-100' : 'opacity-0')}
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className={cn(
                                            'size-full object-cover transition-transform duration-[6000ms] ease-out',
                                            active ? 'scale-105' : 'scale-100',
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <img src={imageFallback} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
                )}

                {/* Video backdrop when enabled */}
                {hero.video_enabled && (
                    <>
                        {youtubeEmbedUrl && (
                            <iframe
                                key={youtubeEmbedUrl}
                                src={youtubeEmbedUrl}
                                title="Hero background video"
                                className={cn(
                                    'pointer-events-none absolute inset-0 size-full border-0 object-cover scale-125 transition-opacity duration-700 ease-out',
                                    ready ? 'opacity-100' : 'opacity-0',
                                )}
                                allow="autoplay; encrypted-media"
                            />
                        )}

                        {videoSrc && (
                            <video
                                key={videoSrc}
                                src={videoSrc}
                                className={cn(
                                    'absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out',
                                    ready ? 'opacity-100' : 'opacity-0',
                                )}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                poster={posterSrc ?? undefined}
                                onLoadedData={() => setReady(true)}
                                onPlaying={() => setReady(true)}
                            />
                        )}
                    </>
                )}

                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/15" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pt-24 pb-12 sm:pb-16 lg:px-8 lg:pb-20">
                <div className="max-w-4xl">
                    {eyebrow && (
                        <span className="inline-flex items-center border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-[0.28em] uppercase backdrop-blur-sm">
                            {eyebrow}
                        </span>
                    )}

                    <h1
                        id="home-hero-title"
                        className="mt-6 text-4xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
                    >
                        {title}
                    </h1>

                    {description && <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>}
                </div>
            </div>
        </section>
    );
}
