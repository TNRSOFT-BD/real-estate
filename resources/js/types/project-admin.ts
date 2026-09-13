import { type Filters, type FlashAlert, type Paginator } from '@/types/contact-admin';

export type { Filters, FlashAlert, Paginator };

export interface SelectOption {
    value: string;
    label: string;
}

export interface CurrencyConfig {
    code: string;
    symbol: string;
}

export interface MediaLimits {
    imageMaxKb: number;
    documentMaxKb: number;
    imageMimes: string[];
    documentMimes: string[];
}

export interface ProjectTypeItem {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    sort_order: number;
    is_active: boolean;
    projects_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ProjectStatusItem {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    sort_order: number;
    is_active: boolean;
    projects_count?: number;
    created_at: string;
    updated_at: string;
}

export type ProjectFeature = {
    key: string;
    value: string;
    icon?: string | null;
};

export type AmenityItem = {
    name: string;
    icon?: string | null;
};

export interface AdminProjectItem {
    id: number;
    title: string;
    slug: string;
    project_code?: string | null;
    project_type_id: number;
    project_status_id: number;
    short_description?: string | null;
    overview?: string | null;
    is_published: boolean;
    is_featured: boolean;
    published_at?: string | null;
    sort_order: number;
    location_address?: string | null;
    location_area?: string | null;
    location_city?: string | null;
    location_country?: string | null;
    google_map_url?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    total_land_area?: string | null;
    total_units?: number | null;
    number_of_floors?: number | null;
    number_of_buildings?: number | null;
    units_per_floor?: number | null;
    handover_date?: string | null;
    property_features?: ProjectFeature[] | null;
    amenities?: (AmenityItem | string)[] | null;
    hero_banner?: string | null;
    hero_banner_alt?: string | null;
    brochure_pdf?: string | null;
    promo_video_url?: string | null;
    legal_approval_no?: string | null;
    legal_approval_document?: string | null;
    developer_name?: string | null;
    developer_website?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    canonical_url?: string | null;
    robots?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_card?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    type?: { id: number; name: string } | null;
    status?: { id: number; name: string; color?: string | null } | null;
    galleries_count?: number;
    pricing_plans_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ProjectGalleryItem {
    id: number;
    project_id: number;
    image_path: string;
    type: string;
    caption?: string | null;
    alt_text?: string | null;
    sort_order: number;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProjectPricingPlanItem {
    id: number;
    project_id: number;
    unit_type: string;
    size_sqft?: string | null;
    price_per_sqft?: string | null;
    total_price?: string | null;
    booking_money?: string | null;
    down_payment_percentage?: string | null;
    installment_plan?: string | null;
    floor_plan_image?: string | null;
    status: string;
    sort_order: number;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProjectSeoData {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    canonical_url?: string | null;
    robots?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_card?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
}

export const galleryTypeLabels: Record<string, string> = {
    interior: 'Interior',
    exterior: 'Exterior',
    floor_plan: 'Floor Plan',
};

export const pricingStatusLabels: Record<string, string> = {
    available: 'Available',
    sold_out: 'Sold Out',
    unavailable: 'Unavailable',
};
