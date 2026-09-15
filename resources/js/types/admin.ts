export type { FlashAlert, Paginator } from './contact-admin';

export interface AdminItem {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminFilters {
    search?: string;
    per_page?: number | string;
}
