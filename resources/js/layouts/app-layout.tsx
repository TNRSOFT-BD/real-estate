import { Head } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const ACTION_TITLES = new Set(['Edit', 'Create', 'Show', 'View', 'New']);

function resolveTitle(breadcrumbs: BreadcrumbItem[] = []): string {
    const meaningful = breadcrumbs.filter((crumb) => !ACTION_TITLES.has(crumb.title) && !crumb.title.startsWith('#'));
    const current = meaningful[meaningful.length - 1]?.title;

    if (current && current !== 'Dashboard') {
        return current;
    }

    return breadcrumbs[breadcrumbs.length - 1]?.title ?? '';
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={resolveTitle(breadcrumbs)} />
        {children}
    </AppLayoutTemplate>
);
