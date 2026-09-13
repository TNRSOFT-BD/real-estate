import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import AdminPagination from '@/components/admin/contact/admin-pagination';
import RowActions from '@/components/admin/contact/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { type AdminProjectItem, type Filters, type FlashAlert, type Paginator, type SelectOption } from '@/types/project-admin';
import { Link, router } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Search, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectIndexProps {
    items: Paginator<AdminProjectItem>;
    filters: Filters;
    types: SelectOption[];
    statuses: SelectOption[];
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/admin/projects' },
];

export default function ProjectIndex({ items, filters, types, statuses, flash }: ProjectIndexProps) {
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.project_type_id ?? '');
    const [status, setStatus] = useState(filters.project_status_id ?? '');
    const [published, setPublished] = useState(filters.is_published ?? '');
    const [featured, setFeatured] = useState(filters.is_featured ?? '');
    const [sort, setSort] = useState(filters.sort ?? '');

    const applyFilters = (extra: Record<string, string> = {}) => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (type) params.project_type_id = type;
        if (status) params.project_status_id = status;
        if (published) params.is_published = published;
        if (featured) params.is_featured = featured;
        if (sort) params.sort = sort;
        router.get(pathname, { ...params, ...extra }, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        const timer = setTimeout(() => applyFilters(), 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const togglePublish = (item: AdminProjectItem) => {
        const action = item.is_published ? 'unpublish' : 'publish';
        router.patch(route(`admin.projects.${action}`, { project: item.id }), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Projects"
                    description="Manage real estate projects, publishing and media."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.projects.create')}>
                                <Plus />
                                Add project
                            </Link>
                        </Button>
                    }
                />

                <div className="overflow-hidden rounded-xl border">
                    <div className="bg-muted/40 flex flex-wrap items-center gap-3 border-b p-4">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search…" className="w-56 pl-9" aria-label="Search" />
                        </div>
                        <FilterSelect value={type} onChange={(v) => { setType(v); setTimeout(() => applyFilters(), 0); }} placeholder="All types" options={types} />
                        <FilterSelect value={status} onChange={(v) => { setStatus(v); setTimeout(() => applyFilters(), 0); }} placeholder="All statuses" options={statuses} />
                        <FilterSelect
                            value={published}
                            onChange={(v) => { setPublished(v); setTimeout(() => applyFilters(), 0); }}
                            placeholder="Any visibility"
                            options={[{ value: '1', label: 'Published' }, { value: '0', label: 'Draft' }]}
                        />
                        <FilterSelect
                            value={featured}
                            onChange={(v) => { setFeatured(v); setTimeout(() => applyFilters(), 0); }}
                            placeholder="Featured: all"
                            options={[{ value: '1', label: 'Featured' }, { value: '0', label: 'Not featured' }]}
                        />
                        <FilterSelect
                            value={sort}
                            onChange={(v) => { setSort(v); setTimeout(() => applyFilters(), 0); }}
                            placeholder="Newest first"
                            options={[
                                { value: 'newest', label: 'Newest' },
                                { value: 'oldest', label: 'Oldest' },
                                { value: 'name', label: 'Name' },
                                { value: 'sort_order', label: 'Sort order' },
                                { value: 'published_at', label: 'Published date' },
                            ]}
                        />
                    </div>

                    {items.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse">
                                <thead className="bg-muted/40 border-b">
                                    <tr>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Project</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Code</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Type</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Status</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">City</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Visibility</th>
                                        <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item) => {
                                        const thumb = mediaUrl(item.hero_banner ?? null);

                                        return (
                                            <tr key={item.id} className="hover:bg-muted/40 border-b last:border-0">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {thumb ? (
                                                            <img src={thumb} alt="" className="size-10 rounded-md border object-cover" />
                                                        ) : (
                                                            <div className="bg-muted size-10 rounded-md border" />
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="truncate text-sm font-medium">{item.title}</div>
                                                            <div className="text-muted-foreground truncate text-xs">/{item.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-muted-foreground px-4 py-3 text-sm">{item.project_code ?? '—'}</td>
                                                <td className="px-4 py-3 text-sm">{item.type?.name ?? '—'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {item.status ? (
                                                        <span className="inline-flex items-center gap-2">
                                                            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.status.color ?? undefined }} />
                                                            {item.status.name}
                                                        </span>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm">{item.location_city ?? '—'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex flex-wrap gap-1">
                                                        <Badge variant={item.is_published ? 'default' : 'secondary'}>{item.is_published ? 'Published' : 'Draft'}</Badge>
                                                        {item.is_featured && <Badge variant="outline">Featured</Badge>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild aria-label="Gallery">
                                                            <Link href={route('admin.projects.gallery.index', { project: item.id })}>
                                                                <ImageIcon className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild aria-label="Pricing">
                                                            <Link href={route('admin.projects.pricing.index', { project: item.id })}>
                                                                <Wallet className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <RowActions
                                                            editUrl={route('admin.projects.edit', { project: item.id })}
                                                            onToggle={() => togglePublish(item)}
                                                            onDelete={() => router.delete(route('admin.projects.destroy', { project: item.id }), { preserveScroll: true })}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex min-h-40 items-center justify-center p-8 text-sm">
                            No projects found. Create your first project to get started.
                        </div>
                    )}

                    <AdminPagination paginator={items} />
                </div>
            </div>
        </AppLayout>
    );
}

function FilterSelect({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder: string;
}) {
    return (
        <select value={value} onChange={(event) => onChange(event.target.value)} className="border-input bg-background h-10 rounded-md border px-3 text-sm" aria-label={placeholder}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
