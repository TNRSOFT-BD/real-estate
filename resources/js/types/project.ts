import { type HomeAboutData } from './home-about';
import { type HeroVideoQuality, type HeroVideoSource } from './site';
import { type WhyChooseUsData } from './why-choose-us';

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
    status: string;
    sort_order: number;
    is_featured: boolean;
}

export interface ProjectFloorPlan {
    id: number;
    project_id: number;
    title: string;
    description?: string | null;
    image_path: string;
    total_area?: string | null;
    bedrooms?: string | null;
    bathrooms?: string | null;
    balcony?: string | null;
    lounge?: string | null;
    sort_order: number;
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
    at_a_glance_image?: string | null;
    at_a_glance_image_alt?: string | null;
    brochure_pdf?: string | null;
    promo_video_url?: string | null;
    legal_approval_no?: string | null;
    legal_approval_document?: string | null;
    galleries?: ProjectGalleryImage[];
    pricing_plans?: ProjectPricingPlan[];
    floor_plans?: ProjectFloorPlan[];
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
    og_type?: string | null;
    twitter_card?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    json_ld?: Array<Record<string, unknown>> | null;
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

export interface PublicProjectCard {
    id: number;
    title: string;
    slug: string;
    hero_banner?: string | null;
    hero_banner_alt?: string | null;
    short_description?: string | null;
    location_area?: string | null;
    location_city?: string | null;
    location_country?: string | null;
    is_featured: boolean;
    type?: ProjectTypeRef | null;
    status?: ProjectStatusRef | null;
}

export interface ProjectFilterOption {
    slug: string;
    name: string;
}

export interface ProjectStatusFilterOption extends ProjectFilterOption {
    color?: string | null;
}

export interface ProjectsIndexFilters {
    project_type?: string | null;
    project_status?: string | null;
    location_city?: string | null;
    search?: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface ProjectPaginator<T> {
    data: T[];
    current_page: number;
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface ProjectsIndexProps {
    projects: ProjectPaginator<PublicProjectCard>;
    types: ProjectFilterOption[];
    statuses: ProjectStatusFilterOption[];
    locations: string[];
    filters: ProjectsIndexFilters;
    seo: ProjectSeoData;
    [key: string]: unknown;
}

export interface HomeHeroData {
    eyebrow: string | null;
    title: string | null;
    description: string | null;
    images: string[];
    video_quality: HeroVideoQuality;
    video_enabled: boolean;
    video_source: HeroVideoSource;
    video_url: string | null;
    video_link: string | null;
}

export interface HomePageProps {
    featuredProjects: PublicProjectCard[];
    hero: HomeHeroData;
    about: HomeAboutData;
    whyChooseUs: WhyChooseUsData;
    seo: ProjectSeoData;
    [key: string]: unknown;
}
