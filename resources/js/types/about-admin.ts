export type AboutItemType = 'mission' | 'vision' | 'statistic' | 'value' | 'milestone' | 'feature' | 'partner';

export interface AdminAboutItem {
    id: number;
    type: AboutItemType;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    content?: string | null;
    value?: string | null;
    label?: string | null;
    year?: string | null;
    date?: string | null;
    image?: string | null;
    image_alt?: string | null;
    icon?: string | null;
    url?: string | null;
    sort_order: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export const aboutItemTypeLabels: Record<AboutItemType, string> = {
    mission: 'Mission',
    vision: 'Vision',
    statistic: 'Statistic',
    value: 'Core value',
    milestone: 'Journey milestone',
    feature: 'Why choose us',
    partner: 'Partner',
};

export interface AboutItemFormData {
    type: AboutItemType;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    value: string;
    label: string;
    year: string;
    date: string;
    image: File | null;
    image_alt: string;
    icon: string;
    url: string;
    sort_order: number;
    is_active: boolean;
    is_featured: boolean;
    [key: string]: string | number | boolean | File | null;
}
