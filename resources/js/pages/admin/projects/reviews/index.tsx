import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import AdminPagination from '@/components/admin/contact/admin-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Filters, type FlashAlert, type Paginator, type ProjectReviewItem, type ProjectReviewSummary } from '@/types/project-admin';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, Clock, Search, Star, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ReviewsIndexProps {
    project: { id: number; title: string; slug: string };
    reviews: Paginator<ProjectReviewItem>;
    filters: Filters;
    summary: ProjectReviewSummary;
    flash?: FlashAlert;
}

export default function ProjectReviewsIndex({ project, reviews, filters, summary, flash }: ReviewsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/admin/projects' },
        { title: project.title, href: route('admin.projects.edit', { project: project.id }) },
        { title: 'Reviews', href: '#' },
    ];

    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const skipFirstRender = useRef(true);

    const applyFilters = (nextStatus = status) => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (nextStatus) params.status = nextStatus;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        if (skipFirstRender.current) {
            skipFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => applyFilters(), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const setStatusFilter = (value: string) => {
        setStatus(value);
        applyFilters(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={`Reviews — ${project.title}`}
                    description="Moderate reviews submitted on the public project page."
                    flash={flash}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={route('admin.projects.edit', { project: project.id })}>
                                <ArrowLeft />
                                Back to project
                            </Link>
                        </Button>
                    }
                />

                <div className="grid gap-3 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => setStatusFilter('')}
                        className={`bg-card rounded-xl border p-4 text-left transition-colors hover:bg-muted/40 ${status === '' ? 'border-primary bg-primary/5' : ''}`}
                    >
                        <div className="text-2xl font-semibold">{summary.count}</div>
                        <div className="text-muted-foreground text-xs">Approved reviews</div>
                    </button>
                    <div className="bg-card rounded-xl border p-4">
                        <div className="text-2xl font-semibold">{summary.average || '—'}</div>
                        <div className="text-muted-foreground text-xs">Average rating</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={`bg-card rounded-xl border p-4 text-left transition-colors hover:bg-muted/40 ${status === 'pending' ? 'border-primary bg-primary/5' : ''}`}
                    >
                        <div className="text-2xl font-semibold">{reviews.total}</div>
                        <div className="text-muted-foreground text-xs">Matching reviews</div>
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <div className="bg-muted/40 flex flex-wrap items-center gap-3 border-b p-4">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-56 pl-9" aria-label="Search reviews" />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                            aria-label="Filter by status"
                        >
                            <option value="">All reviews</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
                    </div>

                    {reviews.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] border-collapse">
                                <thead className="bg-muted/40 border-b">
                                    <tr>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Reviewer</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Rating</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Comment</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Status</th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Received</th>
                                        <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.data.map((review) => (
                                        <tr key={review.id} className="hover:bg-muted/40 border-b last:border-0">
                                            <td className="px-4 py-3 text-sm">
                                                <div className="font-medium">{review.name}</div>
                                                <div className="text-muted-foreground text-xs">{review.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5`}>
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <Star key={index} className={`size-3.5 ${index < review.rating ? 'fill-current' : 'text-muted-foreground/40'}`} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground max-w-md px-4 py-3 text-sm">
                                                <p className="line-clamp-2">{review.comment}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {review.is_approved ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
                                                        <Check className="size-3.5" />
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                                                        <Clock className="size-3.5" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 text-sm">{new Date(review.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center justify-end gap-1">
                                                    {review.is_approved ? (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            title="Move to pending"
                                                            onClick={() => router.patch(route('admin.projects.reviews.unapprove', { project: project.id, review: review.id }), {}, { preserveScroll: true })}
                                                        >
                                                            <X />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            title="Approve"
                                                            onClick={() => router.patch(route('admin.projects.reviews.approve', { project: project.id, review: review.id }), {}, { preserveScroll: true })}
                                                        >
                                                            <Check />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        title="Delete"
                                                        onClick={() => {
                                                            if (window.confirm('Delete this review?')) {
                                                                router.delete(route('admin.projects.reviews.destroy', { project: project.id, review: review.id }), { preserveScroll: true });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex min-h-40 items-center justify-center p-8 text-sm">No reviews found.</div>
                    )}

                    <AdminPagination paginator={reviews} />
                </div>
            </div>
        </AppLayout>
    );
}
