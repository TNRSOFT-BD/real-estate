import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import AdminPagination from '@/components/admin/contact/admin-pagination';
import RowActions from '@/components/admin/contact/row-actions';
import ReassignDialog from '@/components/admin/project/reassign-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Filters, type FlashAlert, type Paginator, type ProjectStatusItem, type SelectOption } from '@/types/project-admin';
import { Link, router } from '@inertiajs/react';
import { Plus, Search, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectStatusIndexProps {
    items: Paginator<ProjectStatusItem>;
    filters: Filters;
    options: SelectOption[];
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Project Statuses', href: '/admin/project-statuses' },
];

export default function ProjectStatusIndex({ items, filters, options, flash }: ProjectStatusIndexProps) {
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [active, setActive] = useState(filters.is_active ?? '');
    const [reassigning, setReassigning] = useState<ProjectStatusItem | null>(null);

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (active) params.is_active = active;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        const timer = setTimeout(applyFilters, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Project Statuses"
                    description="Dynamic, database-driven project statuses."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.project-statuses.create')}>
                                <Plus />
                                Add status
                            </Link>
                        </Button>
                    }
                />

                <div className="overflow-hidden rounded-xl border">
                    <div className="bg-muted/40 flex flex-wrap items-center gap-3 border-b p-4">
                        <div className="relative w-full sm:w-56">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search…" className="w-full pl-9" aria-label="Search" />
                        </div>
                        <select
                            value={active}
                            onChange={(event) => {
                                setActive(event.target.value);
                                setTimeout(applyFilters, 0);
                            }}
                            className="border-input bg-background h-10 flex-1 rounded-md border px-3 text-sm sm:flex-none"
                            aria-label="Filter by status"
                        >
                            <option value="">Any status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>

                    {items.data.length > 0 ? (
                        <>
                            <ul className="divide-y sm:hidden">
                                {items.data.map((item) => (
                                    <li key={item.id} className="flex items-start gap-3 p-4">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="min-w-0">
                                                <p className="text-foreground truncate text-sm font-medium">{item.name}</p>
                                                <p className="text-muted-foreground truncate text-xs">{item.slug}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                                                    <span
                                                        className={cn(
                                                            'size-1.5 rounded-full',
                                                            item.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                                                        )}
                                                    />
                                                    {item.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                                                    <span className="size-3 rounded-full border" style={{ backgroundColor: item.color ?? undefined }} />
                                                    {item.color}
                                                </span>
                                                <span className="text-muted-foreground text-xs">{item.projects_count ?? 0} projects</span>
                                            </div>
                                            {(item.projects_count ?? 0) > 0 && (
                                                <Button variant="outline" size="sm" onClick={() => setReassigning(item)}>
                                                    <Shuffle className="size-4" />
                                                    Reassign projects
                                                </Button>
                                            )}
                                        </div>
                                        <div className="shrink-0">
                                            <RowActions
                                                editUrl={route('admin.project-statuses.edit', { projectStatus: item.id })}
                                                onToggle={() => router.patch(route('admin.project-statuses.toggle', { projectStatus: item.id }), {}, { preserveScroll: true })}
                                                onDelete={() => router.delete(route('admin.project-statuses.destroy', { projectStatus: item.id }), { preserveScroll: true })}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="hidden overflow-x-auto sm:block">
                            <table className="w-full min-w-[760px] border-collapse">
                                <thead className="bg-muted/40 border-b">
                                    <tr>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Name</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Slug</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Colour</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Projects</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Status</th>
                                        <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/40 border-b last:border-0">
                                            <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                                            <td className="text-muted-foreground px-4 py-3 text-sm">{item.slug}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="size-4 rounded-full border" style={{ backgroundColor: item.color ?? undefined }} />
                                                    {item.color}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{item.projects_count ?? 0}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => setReassigning(item)} disabled={(item.projects_count ?? 0) === 0}>
                                                        <Shuffle className="size-4" />
                                                        Reassign
                                                    </Button>
                                                    <RowActions
                                                        editUrl={route('admin.project-statuses.edit', { projectStatus: item.id })}
                                                        onToggle={() => router.patch(route('admin.project-statuses.toggle', { projectStatus: item.id }), {}, { preserveScroll: true })}
                                                        onDelete={() => router.delete(route('admin.project-statuses.destroy', { projectStatus: item.id }), { preserveScroll: true })}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground flex min-h-40 items-center justify-center p-8 text-sm">No project statuses found.</div>
                    )}

                    <AdminPagination paginator={items} />
                </div>
            </div>

            {reassigning && (
                <ReassignDialog
                    open={reassigning !== null}
                    onOpenChange={(open) => !open && setReassigning(null)}
                    title={`Reassign projects from "${reassigning.name}"`}
                    description={`${reassigning.projects_count ?? 0} project(s) use this status. Choose another status to move them to before deleting.`}
                    options={options.filter((option) => option.value !== String(reassigning.id))}
                    action={route('admin.project-statuses.reassign', { projectStatus: reassigning.id })}
                />
            )}
        </AppLayout>
    );
}
