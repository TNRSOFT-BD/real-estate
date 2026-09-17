import { StatusBadge } from '@/components/admin/contact/status-badges';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type DashboardData, type DashboardProject, type DashboardSubmission } from '@/types/dashboard';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    ChevronRight,
    CircleDot,
    HelpCircle,
    Inbox,
    Layers,
    MailOpen,
    MapPin,
    Plus,
    Scale,
    ShieldAlert,
    Star,
    Users,
    type LucideIcon,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const statusTiles = [
    { key: 'new', label: 'New', icon: MailOpen, accent: 'bg-blue-500/10 text-blue-600', dot: 'bg-blue-500' },
    { key: 'in_progress', label: 'In progress', icon: CircleDot, accent: 'bg-amber-500/10 text-amber-600', dot: 'bg-amber-500' },
    { key: 'resolved', label: 'Resolved', icon: CheckCircle2, accent: 'bg-emerald-500/10 text-emerald-600', dot: 'bg-emerald-500' },
    { key: 'spam', label: 'Spam', icon: ShieldAlert, accent: 'bg-red-500/10 text-red-600', dot: 'bg-red-500' },
] as const;

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

interface StatCardProps {
    label: string;
    value: number;
    hint: string;
    icon: LucideIcon;
    href: string;
    accent: string;
}

function StatCard({ label, value, hint, icon: Icon, href, accent }: StatCardProps) {
    return (
        <Link href={href} className="bg-card hover:border-primary/30 group rounded-xl border p-5 transition-all hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', accent)}>
                    <Icon className="size-5" />
                </span>
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
            <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        </Link>
    );
}

function SectionLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href} className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium">
            {label}
            <ArrowUpRight className="size-3.5" />
        </Link>
    );
}

export default function Dashboard({ projects, submissions, content }: DashboardData) {
    const { auth } = usePage<SharedData>().props;
    const firstName = auth.user?.name?.split(' ')[0] ?? 'there';
    const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const kpis: StatCardProps[] = [
        {
            label: 'Total projects',
            value: projects.total,
            hint: `${projects.published} published · ${projects.draft} draft`,
            icon: Building2,
            href: route('admin.projects.index'),
            accent: 'bg-primary/10 text-primary',
        },
        {
            label: 'Published',
            value: projects.published,
            hint: 'Live on the website',
            icon: CheckCircle2,
            href: route('admin.projects.index', { is_published: 1 }),
            accent: 'bg-emerald-500/10 text-emerald-600',
        },
        {
            label: 'Featured',
            value: projects.featured,
            hint: 'Highlighted to visitors',
            icon: Star,
            href: route('admin.projects.index', { is_featured: 1 }),
            accent: 'bg-amber-500/10 text-amber-600',
        },
        {
            label: 'New enquiries',
            value: submissions.new,
            hint: `${submissions.total} total enquiries`,
            icon: Inbox,
            href: route('admin.contact.submissions.index', { status: 'new' }),
            accent: 'bg-blue-500/10 text-blue-600',
        },
    ];

    const contentItems: Array<{ label: string; value: number; hint?: string; href: string; icon: LucideIcon }> = [
        { label: 'Project types', value: content.project_types, href: route('admin.project-types.index'), icon: Layers },
        { label: 'Project statuses', value: content.project_statuses, href: route('admin.project-statuses.index'), icon: CircleDot },
        {
            label: 'Legal pages',
            value: content.legal_pages,
            hint: `${content.legal_published} published`,
            href: route('admin.legal.index'),
            icon: Scale,
        },
        { label: 'FAQs', value: content.faqs, href: route('admin.contact.faqs.index'), icon: HelpCircle },
        { label: 'Team members', value: content.team_members, href: route('admin.contact.team.index'), icon: Users },
        { label: 'Locations', value: content.locations, href: route('admin.contact.locations.index'), icon: MapPin },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="from-primary via-primary to-primary/85 text-primary-foreground relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10 blur-3xl"
                    />
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-primary-foreground/60 text-xs font-medium tracking-[0.2em] uppercase">{today}</p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {firstName}</h1>
                            <p className="text-primary-foreground/70 mt-2 max-w-xl text-sm">
                                {submissions.new > 0
                                    ? `You have ${submissions.new} new ${submissions.new === 1 ? 'enquiry' : 'enquiries'} waiting for a reply.`
                                    : 'Everything is up to date. Here is a snapshot of your projects and enquiries.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button asChild variant="secondary">
                                <Link href={route('admin.projects.create')}>
                                    <Plus />
                                    New project
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                            >
                                <Link href={route('admin.contact.submissions.index')}>
                                    <Inbox />
                                    View enquiries
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi) => (
                        <StatCard key={kpi.label} {...kpi} />
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle>Enquiries by status</CardTitle>
                            <SectionLink href={route('admin.contact.submissions.index')} label="View all" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {statusTiles.map(({ key, label, icon: Icon, accent, dot }) => (
                                    <Link
                                        key={key}
                                        href={route('admin.contact.submissions.index', { status: key })}
                                        className="hover:bg-muted/50 rounded-xl border p-4 transition-colors"
                                    >
                                        <span className={cn('flex size-8 items-center justify-center rounded-lg', accent)}>
                                            <Icon className="size-4" />
                                        </span>
                                        <div className="mt-3 text-2xl font-semibold tracking-tight">{submissions[key]}</div>
                                        <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
                                            <span className={cn('size-1.5 rounded-full', dot)} />
                                            {label}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-5">
                                <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
                                    <span>Resolved rate</span>
                                    <span>
                                        {submissions.total > 0 ? Math.round((submissions.resolved / submissions.total) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all"
                                        style={{
                                            width: `${submissions.total > 0 ? Math.round((submissions.resolved / submissions.total) * 100) : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content overview</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-border divide-y">
                                {contentItems.map(({ label, value, hint, href, icon: Icon }) => (
                                    <li key={label}>
                                        <Link href={href} className="hover:bg-muted/50 flex items-center gap-3 px-6 py-3 transition-colors">
                                            <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
                                                <Icon className="size-4" />
                                            </span>
                                            <span className="flex-1">
                                                <span className="text-sm font-medium">{label}</span>
                                                {hint && <span className="text-muted-foreground block text-xs">{hint}</span>}
                                            </span>
                                            <span className="text-sm font-semibold tabular-nums">{value}</span>
                                            <ChevronRight className="text-muted-foreground size-4" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <Card className="min-w-0">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle>Recent enquiries</CardTitle>
                            <SectionLink href={route('admin.contact.submissions.index')} label="View all" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {submissions.recent.length > 0 ? (
                                <>
                                <ul className="divide-border divide-y sm:hidden">
                                    {submissions.recent.map((submission: DashboardSubmission) => (
                                        <li key={submission.id}>
                                            <Link
                                                href={route('admin.contact.submissions.show', { submission: submission.id })}
                                                className="hover:bg-muted/50 block px-4 py-3 transition-colors"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <span className="block truncate text-sm font-medium">
                                                            {submission.name ?? 'Unknown'}
                                                        </span>
                                                        <span className="text-muted-foreground block truncate text-xs">
                                                            {submission.email ?? '—'}
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0">
                                                        <StatusBadge value={submission.status} />
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between gap-3">
                                                    <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
                                                        {submission.subject ?? 'No subject'}
                                                    </span>
                                                    <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                                                        {formatDate(submission.created_at)}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full min-w-[520px] border-collapse">
                                        <thead className="bg-muted/40 border-b">
                                            <tr>
                                                <th className="text-muted-foreground px-6 py-2.5 text-left text-xs font-semibold uppercase">From</th>
                                                <th className="text-muted-foreground px-4 py-2.5 text-left text-xs font-semibold uppercase">Subject</th>
                                                <th className="text-muted-foreground px-4 py-2.5 text-left text-xs font-semibold uppercase">Status</th>
                                                <th className="text-muted-foreground px-6 py-2.5 text-right text-xs font-semibold uppercase">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions.recent.map((submission: DashboardSubmission) => (
                                                <tr key={submission.id} className="hover:bg-muted/40 border-b last:border-0">
                                                    <td className="px-6 py-3">
                                                        <Link
                                                            href={route('admin.contact.submissions.show', { submission: submission.id })}
                                                            className="block"
                                                        >
                                                            <span className="block text-sm font-medium">{submission.name ?? 'Unknown'}</span>
                                                            <span className="text-muted-foreground block text-xs">{submission.email ?? '—'}</span>
                                                        </Link>
                                                    </td>
                                                    <td className="max-w-[200px] px-4 py-3">
                                                        <span className="text-muted-foreground block truncate text-sm">
                                                            {submission.subject ?? 'No subject'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge value={submission.status} />
                                                    </td>
                                                    <td className="text-muted-foreground px-6 py-3 text-right text-xs whitespace-nowrap">
                                                        {formatDate(submission.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground px-6 py-10 text-center text-sm">No enquiries yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle>Recent projects</CardTitle>
                            <SectionLink href={route('admin.projects.index')} label="View all" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {projects.recent.length > 0 ? (
                                <ul className="divide-border divide-y">
                                    {projects.recent.map((project: DashboardProject) => (
                                        <li key={project.id}>
                                            <Link
                                                href={route('admin.projects.edit', { project: project.id })}
                                                className="hover:bg-muted/50 flex items-center gap-4 px-6 py-3.5 transition-colors"
                                            >
                                                <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
                                                    <Building2 className="size-5" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-medium">{project.title}</span>
                                                    <span className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                                                        {project.type && <span>{project.type}</span>}
                                                        {project.type && project.status && <span className="text-border">•</span>}
                                                        {project.status && (
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <span
                                                                    className="size-2 rounded-full"
                                                                    style={{ backgroundColor: project.status.color ?? '#94a3b8' }}
                                                                />
                                                                {project.status.name}
                                                            </span>
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="flex shrink-0 items-center gap-3">
                                                    <Badge variant={project.is_published ? 'default' : 'secondary'}>
                                                        {project.is_published ? 'Published' : 'Draft'}
                                                    </Badge>
                                                    <span className="text-muted-foreground hidden text-xs whitespace-nowrap sm:block">
                                                        {formatDate(project.created_at)}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground px-6 py-10 text-center text-sm">No projects yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
