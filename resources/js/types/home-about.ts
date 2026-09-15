export interface HomeAboutSettings {
    heading: string | null;
    description: string | null;
    badge_figure: string | null;
    badge_copy: string | null;
    main_image: string | null;
    main_image_alt: string | null;
    accent_image: string | null;
    accent_image_alt: string | null;
}

export interface HomeAboutStatItem {
    id: number;
    figure: string;
    label: string;
    sort_order: number;
}

export interface HomeAboutStat {
    figure: string;
    label: string;
}

export interface HomeAboutData extends HomeAboutSettings {
    stats: HomeAboutStat[];
}

export interface HomeAboutAdminProps {
    settings: HomeAboutSettings;
    stats: HomeAboutStatItem[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}
