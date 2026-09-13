import type { ContactInformation, ContactSocialLink, ContactTeamMember, SeoData } from './contact';

export interface AboutStat {
    value: string;
    label: string;
}

export interface AboutValue {
    title: string;
    description?: string | null;
}

export interface AboutJourney {
    year: string;
    title: string;
    description?: string | null;
}

export interface AboutWhyItem {
    title: string;
    description?: string | null;
}

export interface AboutPartner {
    name: string;
    url?: string | null;
    image?: string | null;
    image_alt?: string | null;
}

export interface AboutHero {
    hero_badge?: string | null;
    hero_title?: string | null;
    hero_highlight?: string | null;
    hero_description?: string | null;
    hero_image?: string | null;
    hero_cta_text?: string | null;
    hero_cta_link?: string | null;

    intro_badge?: string | null;
    intro_title?: string | null;
    intro_description?: string | null;
    intro_image?: string | null;

    stats?: AboutStat[] | null;

    direction_badge?: string | null;
    mission_title?: string | null;
    mission_description?: string | null;
    mission_image?: string | null;
    vision_title?: string | null;
    vision_description?: string | null;
    vision_image?: string | null;

    values_badge?: string | null;
    values_title?: string | null;
    values?: AboutValue[] | null;

    journey_badge?: string | null;
    journey_title?: string | null;
    journey?: AboutJourney[] | null;

    why_badge?: string | null;
    why_title?: string | null;
    why_items?: AboutWhyItem[] | null;

    team_badge?: string | null;
    team_title?: string | null;
    team_description?: string | null;

    partners_title?: string | null;
    partners?: AboutPartner[] | null;

    closing_badge?: string | null;
    closing_title?: string | null;
    closing_description?: string | null;
    closing_button_text?: string | null;
    closing_button_link?: string | null;

    is_active: boolean;
}

export interface AboutPageProps {
    hero: AboutHero;
    contactInformation: ContactInformation[];
    socialLinks: ContactSocialLink[];
    teamMembers: ContactTeamMember[];
    seo: SeoData;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}