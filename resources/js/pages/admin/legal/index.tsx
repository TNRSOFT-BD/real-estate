import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import AdminPagination from '@/components/admin/contact/admin-pagination';
import RowActions from '@/components/admin/contact/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Filters, type FlashAlert, type Paginator } from '@/types/contact-admin';
import { type AdminLegalItem } from '@/types/legal';
import { Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LegalIndexProps {
    items: Paginator<AdminLegalItem>;
    filters: Filters;
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Legal', href: '/admin/legal' },
];

export default function LegalIndex({ items, filters, flash }: LegalIndexProps) {
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (status) params.status = status;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        const timer = setTimeout(applyFilters, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const toggleStatus = (item: AdminLegalItem) => {
        const action = item.status === 'published' ? 'unpublish' : 'publish';
        router.patch(route(`admin.legal.${action}`, { page: item.id }), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Legal Pages"
                    description="Privacy Policy and Terms & Conditions content."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.legal.create')}>
                                <Plus />
                                Add page
                            </Link>
                        </Button>
                    }
                />

                <div className="overflow-hidden rounded-xl border">
                    <div className="bg-muted/40 border-b p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-56">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search…" className="w-full pl-9" aria-label="Search" />
                            </div>
                            <select
                                value={status}
                                onChange={(event) => {
                                    setStatus(event.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="border-input bg-background h-10 flex-1 rounded-md border px-3 text-sm sm:flex-none"
                                aria-label="Filter by status"
                            >
                                <option value="">Any status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    {items.data.length > 0 ? (
                        <>
                            <ul className="divide-y sm:hidden">
                                {items.data.map((item) => (
                                    <li key={item.id} className="flex items-start gap-3 p-4">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="min-w-0">
                                                <p className="text-foreground truncate text-sm font-medium">{item.title}</p>
                                                <p className="text-muted-foreground truncate text-xs">/{item.slug}</p>
                                            </div>
                                            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs capitalize">
                                                <span
                                                    className={cn(
                                                        'size-1.5 rounded-full',
                                                        item.status === 'published' ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                                                    )}
                                                />
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="shrink-0">
                                            <RowActions
                                                editUrl={route('admin.legal.edit', { page: item.id })}
                                                onToggle={() => toggleStatus(item)}
                                                onDelete={() => router.delete(route('admin.legal.destroy', { page: item.id }), { preserveScroll: true })}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="hidden overflow-x-auto sm:block">
                            <table className="w-full min-w-[720px] border-collapse">
                                <thead className="bg-muted/40 border-b">
                                    <tr>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Title</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Status</th>
                                        <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/40 border-b last:border-0">
                                            <td className="max-w-md px-4 py-3 text-sm font-medium">
                                                <div className="truncate">{item.title}</div>
                                                <div className="text-muted-foreground truncate text-xs">/{item.slug}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>{item.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <RowActions
                                                    editUrl={route('admin.legal.edit', { page: item.id })}
                                                    onToggle={() => toggleStatus(item)}
                                                    onDelete={() => router.delete(route('admin.legal.destroy', { page: item.id }), { preserveScroll: true })}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground flex min-h-40 items-center justify-center p-8 text-sm">No legal pages yet.</div>
                    )}

                    <AdminPagination paginator={items} />
                </div>
            </div>
        </AppLayout>
    );
}
