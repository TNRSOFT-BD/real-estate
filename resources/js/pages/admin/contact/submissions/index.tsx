import AdminPagination from '@/components/admin/contact/admin-pagination';
import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { PriorityBadge, StatusBadge } from '@/components/admin/contact/status-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Assignee, type ContactSubmissionItem, type Filters, type FlashAlert, type Paginator, type SubmissionOverview } from '@/types/contact-admin';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, Delete, Eye, Search, ShieldAlert, Trash, Undo2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SubmissionIndexProps {
    items: Paginator<ContactSubmissionItem>;
    filters: Filters;
    overview?: SubmissionOverview;
    assignees?: Assignee[];
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Submissions', href: '/admin/contact/submissions' },
];

const statusFilterOptions = [
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'spam', label: 'Spam' },
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

const sortOptions = [
    { value: 'latest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
];

export default function SubmissionIndex({ items, filters, overview, assignees = [], flash }: SubmissionIndexProps) {
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [priority, setPriority] = useState(filters.priority ?? '');
    const [assignedTo, setAssignedTo] = useState(filters.assigned_to ?? '');
    const [sort, setSort] = useState(filters.sort ?? 'latest');
    const [selected, setSelected] = useState<number[]>([]);
    const [bulkStatus, setBulkStatus] = useState('');

    const skipFirstRender = useRef(true);

    useEffect(() => {
        if (skipFirstRender.current) return;

        const timer = setTimeout(applyFilters, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (status) params.status = status;
        if (priority) params.priority = priority;
        if (assignedTo) params.assigned_to = assignedTo;
        if (sort && sort !== 'latest') params.sort = sort;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        if (skipFirstRender.current) {
            skipFirstRender.current = false;
            return;
        }
        applyFilters();
    }, [sort]);

    const allSelected = items.data.length > 0 && selected.length === items.data.length;
    const toggleAll = () => setSelected(allSelected ? [] : items.data.map((item) => item.id));
    const toggleOne = (id: number) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const runBulkStatus = () => {
        if (!bulkStatus || selected.length === 0) return;
        router.patch(route('admin.contact.submissions.bulk-update'), { ids: selected, status: bulkStatus }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };

    const runBulkDelete = () => {
        if (selected.length === 0) return;
        if (!window.confirm(`Delete ${selected.length} submission(s)?`)) return;
        router.patch(route('admin.contact.submissions.bulk-delete'), { ids: selected }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };

    const statCards = [
        { label: 'Total', value: overview?.total, active: !filters && true },
        { label: 'New', value: overview?.new, active: status === 'new' },
        { label: 'In progress', value: overview?.in_progress, active: status === 'in_progress' },
        { label: 'Resolved', value: overview?.resolved, active: status === 'resolved' },
        { label: 'Spam', value: overview?.spam, active: status === 'spam' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader title="Submissions" description="Messages sent through the contact form." flash={flash} />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {statCards.map((card) => (
                        <button
                            key={card.label}
                            type="button"
                            onClick={() => {
                                setStatus(card.label === 'Total' ? '' : card.label.toLowerCase().replaceAll(' ', '_'));
                                setTimeout(applyFilters, 0);
                            }}
                            className={`rounded-xl border p-4 text-left transition-colors hover:bg-muted/40 ${card.active ? 'border-primary bg-primary/5' : 'bg-card'}`}
                        >
                            <div className="text-2xl font-semibold">{card.value ?? 0}</div>
                            <div className="text-xs text-muted-foreground">{card.label}</div>
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <div className="border-b bg-muted/40 p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-48 pl-9" aria-label="Search submissions" />
                            </div>
                            <select value={status} onChange={(e) => { setStatus(e.target.value); setTimeout(applyFilters, 0); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter by status">
                                <option value="">All statuses</option>
                                {statusFilterOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                            <select value={priority} onChange={(e) => { setPriority(e.target.value); setTimeout(applyFilters, 0); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter by priority">
                                <option value="">All priorities</option>
                                {priorityOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                            <select value={assignedTo} onChange={(e) => { setAssignedTo(e.target.value); setTimeout(applyFilters, 0); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter by assignee">
                                <option value="">Any assignee</option>
                                {assignees.map((assignee) => (<option key={assignee.id} value={assignee.id}>{assignee.name}</option>))}
                            </select>
                            <div className="relative">
                                <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 pr-8 text-sm" aria-label="Sort order">
                                    {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            </div>

                            <span className="text-muted-foreground ml-auto inline-flex items-center gap-2 text-xs">
                                <span className="border-amber-300 bg-amber-100 inline-block size-3 rounded-sm border" aria-hidden />
                                Project enquiry
                            </span>
                        </div>

                        {selected.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
                                <span className="text-sm text-muted-foreground">{selected.length} selected</span>
                                <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm" aria-label="Bulk status">
                                    <option value="">Bulk set status…</option>
                                    {statusFilterOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                </select>
                                <Button type="button" size="sm" variant="secondary" onClick={runBulkStatus} disabled={!bulkStatus}>
                                    Apply
                                </Button>
                                <Button type="button" size="sm" variant="destructive" onClick={runBulkDelete}>
                                    <Delete />
                                    Delete selected
                                </Button>
                            </div>
                        )}
                    </div>

                    {items.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] border-collapse">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="w-10 px-4 py-3">
                                            <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" className="size-4 accent-primary" />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">From</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Subject</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Priority</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Assignee</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Received</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Flags</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={cn(
                                                'border-b last:border-0 hover:bg-muted/40',
                                                item.project &&
                                                    'border-l-2 border-l-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
                                            )}
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(item.id)}
                                                    onChange={() => toggleOne(item.id)}
                                                    aria-label={`Select submission ${item.id}`}
                                                    className="size-4 accent-primary"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="font-medium">{item.name || 'Anonymous'}</div>
                                                {item.email && <div className="text-xs text-muted-foreground">{item.email}</div>}
                                            </td>
                                            <td className="max-w-xs px-4 py-3 text-sm text-muted-foreground">
                                                <div className="truncate">{item.subject || item.message || '—'}</div>
                                                {item.project && (
                                                    <Link
                                                        href={`/projects/${item.project.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 mt-1 inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[11px] font-medium dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-950"
                                                    >
                                                        {item.project.title}
                                                    </Link>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm"><StatusBadge value={item.status} /></td>
                                            <td className="px-4 py-3 text-sm"><PriorityBadge value={item.priority} /></td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{item.assignee?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(item.created_at).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {item.status === 'spam' && <span className="text-xs font-medium text-destructive">Spam</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button asChild size="icon" variant="ghost" title="View">
                                                        <Link href={route('admin.contact.submissions.show', { submission: item.id })}>
                                                            <Eye />
                                                        </Link>
                                                    </Button>
                                                    {item.status === 'spam' ? (
                                                        <Button size="icon" variant="ghost" title="Restore" onClick={() => router.patch(route('admin.contact.submissions.restore', { submission: item.id }), {}, { preserveScroll: true })}>
                                                            <Undo2 />
                                                        </Button>
                                                    ) : (
                                                        <Button size="icon" variant="ghost" title="Mark as spam" onClick={() => router.patch(route('admin.contact.submissions.mark-spam', { submission: item.id }), {}, { preserveScroll: true })}>
                                                            <ShieldAlert />
                                                        </Button>
                                                    )}
                                                    <Button size="icon" variant="ghost" title="Delete" onClick={() => { if (window.confirm('Delete this submission?')) router.delete(route('admin.contact.submissions.destroy', { submission: item.id }), { preserveScroll: true }); }}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                            <span className="text-2xl">📭</span>
                            No submissions found.
                        </div>
                    )}
                    <AdminPagination paginator={items} />
                </div>
            </div>
        </AppLayout>
    );
}