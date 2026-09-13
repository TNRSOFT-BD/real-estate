export interface LegalPublicPage {
    title: string;
    slug: string;
    content: string;
    published_at?: string | null;
    updated_at?: string | null;
}

export interface LegalShowProps {
    type: string;
    page: LegalPublicPage;
    [key: string]: unknown;
}

export type LegalStatus = 'draft' | 'published';

export interface LegalTypeOption {
    value: string;
    label: string;
    slug: string;
}

export interface AdminLegalItem {
    id: number;
    type: string;
    title: string;
    slug: string;
    content?: string | null;
    status: LegalStatus;
    published_at?: string | null;
    created_at: string;
    updated_at: string;
}
