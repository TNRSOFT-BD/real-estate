export type ContactInformationType =
    | 'hotline'
    | 'phone'
    | 'email'
    | 'address'
    | 'business_hours'
    | 'support'
    | 'sales'
    | 'whatsapp'
    | 'other';

export type ContactFormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox';

export interface ContactInformation {
    id: number;
    type: ContactInformationType;
    title: string;
    value: string;
    secondary_value?: string | null;
    icon?: string | null;
    description?: string | null;
    link?: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface ContactFormField {
    id: number;
    name: string;
    label: string;
    type: ContactFormFieldType;
    placeholder?: string | null;
    help_text?: string | null;
    options?: Array<{ label: string; value: string }> | string[];
    validation_rules?: string[];
    is_required: boolean;
    is_active: boolean;
    sort_order: number;
}

export interface ContactFaq {
    id: number;
    question: string;
    answer: string;
    category?: string | null;
    display_location: string;
    sort_order: number;
    is_active: boolean;
}

export interface ContactTeamMember {
    id: number;
    name: string;
    role: string;
    department?: string | null;
    email?: string | null;
    phone?: string | null;
    avatar?: string | null;
    bio?: string | null;
    availability?: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface ContactLocation {
    id: number;
    name: string;
    address: string;
    description?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    google_maps_url?: string | null;
    place_id?: string | null;
    phone?: string | null;
    email?: string | null;
    business_hours?: string[] | string | null;
    is_primary: boolean;
    sort_order: number;
    is_active: boolean;
}

export interface ContactSocialLink {
    id: number;
    platform: string;
    label?: string | null;
    url: string;
    icon?: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface LiveChatConfig {
    enabled: boolean;
    provider?: string | null;
    script_url?: string | null;
    widget_id?: string | null;
    button_text?: string | null;
    position?: string | null;
    availability_text?: string | null;
}

export interface ContactHero {
    hero_badge?: string | null;
    hero_title?: string | null;
    hero_highlight?: string | null;
    hero_description?: string | null;
    hero_primary_button_text?: string | null;
    hero_primary_button_link?: string | null;
    hero_secondary_button_text?: string | null;
    hero_secondary_button_link?: string | null;
    hero_background_image?: string | null;
    form_title?: string | null;
    form_description?: string | null;
    form_success_message?: string | null;
    faq_badge?: string | null;
    faq_title?: string | null;
    faq_description?: string | null;
    team_badge?: string | null;
    team_title?: string | null;
    team_description?: string | null;
    location_badge?: string | null;
    location_title?: string | null;
    location_description?: string | null;
    live_chat_title?: string | null;
    live_chat_description?: string | null;
    closing_badge?: string | null;
    closing_title?: string | null;
    closing_description?: string | null;
    is_active: boolean;
}

export interface SeoData {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    canonical_url?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_card?: string | null;
}

export interface ContactPageProps {
    hero: ContactHero;
    contactInformation: ContactInformation[];
    form: ContactFormField[];
    faqs: ContactFaq[];
    teamMembers: ContactTeamMember[];
    locations: ContactLocation[];
    socialLinks: ContactSocialLink[];
    liveChat: LiveChatConfig | null;
    seo: SeoData;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}