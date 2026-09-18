import AdminPagination from '@/components/admin/contact/admin-pagination';
import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import RowActions from '@/components/admin/contact/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type AdminLocationItem, type Filters, type FlashAlert, type Paginator } from '@/types/contact-admin';
import { Link, router } from '@inertiajs/react';
import { MapPin, Plus, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LocationIndexProps {
    items: Paginator<AdminLocationItem>;
    filters: Filters;
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Locations', href: '/admin/contact/locations' },
];

export default function LocationIndex({ items, filters, flash }: LocationIndexProps) {
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [active, setActive] = useState(filters.is_active ?? '');

    useEffect(() => {
        const timer = setTimeout(applyFilters, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (active !== '') params.is_active = active;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const moveItem = (id: number, direction: 1 | -1) => {
        const ids = items.data.map((item) => item.id);
        const index = ids.indexOf(id);
        const target = index + direction;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.patch(route('admin.contact.locations.reorder'), { ids }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Locations"
                    description="Physical addresses, map links and contact details."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.contact.locations.create')}>
                                <Plus />
                                Add location
                            </Link>
                        </Button>
                    }
                />

                <div className="overflow-hidden rounded-xl border">
                    <div className="border-b bg-muted/40 p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-56">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-full pl-9" aria-label="Search" />
                            </div>
                            <select value={active} onChange={(e) => { setActive(e.target.value); setTimeout(applyFilters, 0); }} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm sm:flex-none" aria-label="Filter by status">
                                <option value="">Any status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
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
                                                <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                                                    <MapPin className="text-muted-foreground size-4 shrink-0" />
                                                    <span className="truncate">{item.name}</span>
                                                </p>
                                                <p className="text-muted-foreground truncate text-xs">{item.address || '—'}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.is_primary ? (
                                                    <Badge>
                                                        <Star className="size-3" />
                                                        Primary
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.patch(route('admin.contact.locations.primary', { location: item.id }), {}, { preserveScroll: true })}
                                                    >
                                                        Set primary
                                                    </Button>
                                                )}
                                                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                                                    <span
                                                        className={cn(
                                                            'size-1.5 rounded-full',
                                                            item.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                                                        )}
                                                    />
                                                    {item.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <RowActions
                                                editUrl={route('admin.contact.locations.edit', { location: item.id })}
                                                onToggle={() => router.patch(route('admin.contact.locations.toggle', { location: item.id }), {}, { preserveScroll: true })}
                                                onDelete={() => router.delete(route('admin.contact.locations.destroy', { location: item.id }), { preserveScroll: true })}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="hidden overflow-x-auto sm:block">
                            <table className="w-full min-w-[720px] border-collapse">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Address</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Primary</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item, index) => (
                                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40">
                                            <td className="px-4 py-3 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="size-4 text-muted-foreground" />
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="max-w-md px-4 py-3 text-sm text-muted-foreground">
                                                <div className="truncate">{item.address}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {item.is_primary ? (
                                                    <Badge>
                                                        <Star className="size-3" />
                                                        Primary
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.patch(route('admin.contact.locations.primary', { location: item.id }), {}, { preserveScroll: true })}
                                                    >
                                                        Set primary
                                                    </Button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm"><Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge></td>
                                            <td className="px-4 py-3 text-sm">
                                                <RowActions
                                                    editUrl={route('admin.contact.locations.edit', { location: item.id })}
                                                    onToggle={() => router.patch(route('admin.contact.locations.toggle', { location: item.id }), {}, { preserveScroll: true })}
                                                    onDelete={() => router.delete(route('admin.contact.locations.destroy', { location: item.id }), { preserveScroll: true })}
                                                    showMoveControls onMoveUp={() => moveItem(item.id, -1)} onMoveDown={() => moveItem(item.id, 1)}
                                                    isFirst={index === 0} isLast={index === items.data.length - 1}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    ) : (
                        <div className="flex min-h-40 items-center justify-center p-8 text-sm text-muted-foreground">No locations yet.</div>
                    )}
                    <AdminPagination paginator={items} />
                </div>
            </div>
        </AppLayout>
    );
}