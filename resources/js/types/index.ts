import { LucideIcon } from 'lucide-react';
import { type SiteTheme } from './site';
import { type ContactInformation, type ContactSocialLink } from './contact';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface CompanyIdentity {
    name: string;
    tagline: string | null;
    logo: string | null;
}

export interface SharedData {
    name: string;
    company: CompanyIdentity;
    theme: SiteTheme;
    footer: {
        information: ContactInformation[];
        socialLinks: ContactSocialLink[];
    };
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
