export interface ProjectTypeRef {
    id: number;
    name: string;
    slug: string;
}

export interface ProjectStatusRef {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
}

export interface ProjectFeature {
    key: string;
    value: string;
    icon?: string | null;
}

export interface ProjectAmenity {
    name: string;
    icon?: string | null;
}

export interface ProjectGalleryImage {
    id: number;
    image_path: string;
    type: string;
    caption?: string | null;
    alt_text?: string | null;
    sort_order: number;
    is_featured: boolean;
}

export interface ProjectPricingPlan {
    id: number;
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
}

export interface PublicProject {
    id: number;
    title: string;
    slug: string;
    project_code?: string | null;
    type?: ProjectTypeRef | null;
    status?: ProjectStatusRef | null;
    short_description?: string | null;
    overview?: string | null;
    is_featured: boolean;
    published_at?: string | null;
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
    amenities?: (ProjectAmenity | string)[] | null;
    hero_banner?: string | null;
    hero_banner_alt?: string | null;
    brochure_pdf?: string | null;
    promo_video_url?: string | null;
    legal_approval_no?: string | null;
    legal_approval_document?: string | null;
    developer_name?: string | null;
    developer_website?: string | null;
    galleries?: ProjectGalleryImage[];
    pricing_plans?: ProjectPricingPlan[];
}

export interface RelatedProject {
    id: number;
    title: string;
    slug: string;
    hero_banner?: string | null;
    location_city?: string | null;
    type?: string | null;
    status?: string | null;
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

export interface CurrencyConfig {
    code: string;
    symbol: string;
}

export interface ProjectShowProps {
    project: PublicProject;
    seo: ProjectSeoData;
    relatedProjects: RelatedProject[];
    currency: CurrencyConfig;
    [key: string]: unknown;
}
