import AdminPagination from '@/components/admin/contact/admin-pagination';
import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import RowActions from '@/components/admin/contact/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AdminFaqItem, type FaqDisplayLocation, type Filters, type FlashAlert, type Paginator } from '@/types/contact-admin';
import { Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FaqIndexProps {
    items: Paginator<AdminFaqItem>;
    filters: Filters;
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'FAQs', href: '/admin/contact/faqs' },
];

const locationOptions: Array<{ value: FaqDisplayLocation; label: string }> = [
    { value: 'all', label: 'All Pages' },
    { value: 'homepage', label: 'Homepage' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'faq', label: 'FAQ Page' },
    { value: 'packages', label: 'Packages Page' },
];

export default function FaqIndex({ items, filters, flash }: FaqIndexProps) {
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [location, setLocation] = useState(filters.display_location ?? '');
    const [active, setActive] = useState(filters.is_active ?? '');

    useEffect(() => {
        const timer = setTimeout(applyFilters, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (location) params.display_location = location;
        if (active !== '') params.is_active = active;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const moveItem = (id: number, direction: 1 | -1) => {
        const ids = items.data.map((item) => item.id);
        const index = ids.indexOf(id);
        const target = index + direction;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.patch(route('admin.contact.faqs.reorder'), { ids }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Frequently Asked Questions"
                    description="Manage the FAQ entries shown on the contact page."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.contact.faqs.create')}>
                                <Plus />
                                Add FAQ
                            </Link>
                        </Button>
                    }
                />

                <div className="overflow-hidden rounded-xl border">
                    <div className="border-b bg-muted/40 p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-56 pl-9" aria-label="Search" />
                            </div>
                            <select value={location} onChange={(e) => { setLocation(e.target.value); setTimeout(applyFilters, 0); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter by display location">
                                <option value="">All locations</option>
                                {locationOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                            <select value={active} onChange={(e) => { setActive(e.target.value); setTimeout(applyFilters, 0); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter by status">
                                <option value="">Any status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>
                    {items.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] border-collapse">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Question</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item, index) => (
                                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40">
                                            <td className="px-4 py-3 text-sm font-medium max-w-md">
                                                <div className="truncate">{item.question}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{item.category ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm"><Badge variant="secondary">{item.display_location.replaceAll('_', ' ')}</Badge></td>
                                            <td className="px-4 py-3 text-sm"><Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge></td>
                                            <td className="px-4 py-3 text-sm">
                                                <RowActions
                                                    editUrl={route('admin.contact.faqs.edit', { faq: item.id })}
                                                    onToggle={() => router.patch(route('admin.contact.faqs.toggle', { faq: item.id }), {}, { preserveScroll: true })}
                                                    onDelete={() => router.delete(route('admin.contact.faqs.destroy', { faq: item.id }), { preserveScroll: true })}
                                                    showMoveControls onMoveUp={() => moveItem(item.id, -1)} onMoveDown={() => moveItem(item.id, 1)}
                                                    isFirst={index === 0} isLast={index === items.data.length - 1}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex min-h-40 items-center justify-center p-8 text-sm text-muted-foreground">No FAQs yet.</div>
                    )}
                    <AdminPagination paginator={items} />
                </div>
            </div>
        </AppLayout>
    );
}