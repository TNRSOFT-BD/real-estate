export interface DashboardProject {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_featured: boolean;
    type: string | null;
    status: {
        name: string;
        color: string | null;
    } | null;
    created_at: string | null;
}

export interface DashboardSubmission {
    id: number;
    name: string | null;
    email: string | null;
    subject: string | null;
    status: string;
    created_at: string | null;
}

export interface DashboardData {
    projects: {
        total: number;
        published: number;
        draft: number;
        featured: number;
        recent: DashboardProject[];
    };
    submissions: {
        total: number;
        new: number;
        in_progress: number;
        resolved: number;
        spam: number;
        recent: DashboardSubmission[];
    };
    content: {
        project_types: number;
        project_statuses: number;
        legal_pages: number;
        legal_published: number;
        faqs: number;
        team_members: number;
        locations: number;
    };
}
