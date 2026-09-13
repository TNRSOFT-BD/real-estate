export type ThemeMode = 'auto' | 'light' | 'dark';

export interface SiteTheme {
    background_color: string;
    theme_mode: ThemeMode;
    mode: 'light' | 'dark';
}

export interface SiteAppearanceProps {
    settings: {
        background_color: string;
        theme_mode: ThemeMode;
    };
    theme: SiteTheme;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}
