export interface Paginator<T> {
    data: T[];
    current_page: number;
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface FlashAlert {
    success?: string;
    error?: string;
}

export interface Filters {
    [key: string]: string | undefined;
}

export interface Assignee {
    id: number;
    name: string;
    email: string;
}

export interface SubmissionOverview {
    total?: number;
    new_count?: number;
    in_progress_count?: number;
    resolved_count?: number;
    spam_count?: number;
}

export interface ContactSubmissionNoteItem {
    id: number;
    note: string;
    user: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    updated_at: string;
}

export interface ContactSubmissionItem {
    id: number;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    subject?: string | null;
    message?: string | null;
    source?: string | null;
    user_agent?: string | null;
    ip_hash?: string | null;
    data: Record<string, unknown>;
    status: string;
    priority: string;
    assigned_to?: number | null;
    assignee?: { id: number; name: string } | null;
    notes?: ContactSubmissionNoteItem[];
    is_spam: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export type FaqDisplayLocation = 'all' | 'homepage' | 'contact' | 'faq' | 'packages';

export interface AdminFaqItem {
    id: number;
    question: string;
    answer: string;
    category?: string | null;
    display_location: FaqDisplayLocation;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminTeamMemberItem {
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
    created_at: string;
    updated_at: string;
}

export interface AdminLocationItem {
    id: number;
    name: string;
    address: string;
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
    created_at: string;
    updated_at: string;
}

export interface AdminSocialLinkItem {
    id: number;
    platform: string;
    label?: string | null;
    url: string;
    icon?: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminInformationItem {
    id: number;
    type: string;
    title: string;
    value: string;
    secondary_value?: string | null;
    icon?: string | null;
    description?: string | null;
    link?: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminFormFieldItem {
    id: number;
    name: string;
    label: string;
    type: string;
    placeholder?: string | null;
    help_text?: string | null;
    options?: string[] | Array<{ label: string; value: string }>;
    validation_rules?: string[];
    is_required: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}