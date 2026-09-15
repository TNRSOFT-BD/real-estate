export type ThemeMode = 'auto' | 'light' | 'dark';

export type HeroVideoQuality = 'auto' | 'eco' | 'good' | 'best';

export type HeroVideoSource = 'default' | 'upload' | 'url';

export interface SiteTheme {
    background_color: string;
    theme_mode: ThemeMode;
    mode: 'light' | 'dark';
}

export interface SiteAppearanceProps {
    settings: {
        background_color: string;
        theme_mode: ThemeMode;
        hero_video_quality: HeroVideoQuality;
    };
    theme: SiteTheme;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export interface SiteHomepageProps {
    settings: {
        hero_eyebrow: string | null;
        hero_title: string | null;
        hero_description: string | null;
        hero_images: string[] | null;
        hero_video_quality: HeroVideoQuality;
        hero_video_enabled: boolean;
        hero_video_source: HeroVideoSource;
        hero_video_url: string | null;
        hero_video_public_id: string | null;
        hero_video_link: string | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}
