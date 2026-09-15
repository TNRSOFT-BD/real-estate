export interface WhyChooseUsSettings {
    eyebrow: string | null;
    title: string | null;
    description: string | null;
}

export interface WhyChooseUsFeatureItem {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
}

export interface WhyChooseUsPublicFeature {
    title: string;
    description: string | null;
    icon: string | null;
}

export interface WhyChooseUsData extends WhyChooseUsSettings {
    features: WhyChooseUsPublicFeature[];
}

export interface WhyChooseUsAdminProps {
    settings: WhyChooseUsSettings;
    features: WhyChooseUsFeatureItem[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}
