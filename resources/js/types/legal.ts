export interface LegalPublicPage {
    title: string;
    slug: string;
    content: string;
    published_at?: string | null;
    updated_at?: string | null;
}

export interface LegalShowProps {
    page: LegalPublicPage;
    [key: string]: unknown;
}

export type LegalStatus = 'draft' | 'published';

export interface AdminLegalItem {
    id: number;
    title: string;
    slug: string;
    content?: string | null;
    status: LegalStatus;
    published_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface LegalFooterLink {
    title: string;
    slug: string;
}
