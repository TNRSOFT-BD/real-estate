import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Inbox, MailOpen, CircleDot, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DashboardProps {
    overview?: {
        total: number;
        new: number;
        in_progress: number;
        resolved: number;
        spam: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const statusLinks = [
    { key: 'new', label: 'New', icon: MailOpen, dotClass: 'bg-blue-500' },
    { key: 'in_progress', label: 'In progress', icon: CircleDot, dotClass: 'bg-amber-500' },
    { key: 'resolved', label: 'Resolved', icon: CheckCircle2, dotClass: 'bg-emerald-500' },
    { key: 'spam', label: 'Spam', icon: ShieldAlert, dotClass: 'bg-red-500' },
];

export default function Dashboard({ overview }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6">
                <div className="bg-card max-w-2xl rounded-xl border p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                                <Inbox className="text-primary size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold">Contact submissions</h2>
                                <p className="text-muted-foreground text-sm">
                                    {overview?.total ?? 0} submission{(overview?.total ?? 0) === 1 ? '' : 's'} received.
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/contact/submissions" className="text-primary hover:text-primary/80 text-sm font-medium whitespace-nowrap">
                            View all
                        </Link>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {statusLinks.map(({ key, label, icon: Icon, dotClass }) => (
                            <Link
                                key={key}
                                href={`/admin/contact/submissions?status=${key}`}
                                className="hover:bg-muted/40 group rounded-lg border p-3 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`size-2 rounded-full ${dotClass}`} />
                                    <Icon className="text-muted-foreground size-3.5" />
                                </div>
                                <div className="mt-3 text-2xl font-semibold">{overview?.[key as keyof typeof overview] ?? 0}</div>
                                <div className="text-muted-foreground text-xs">{label}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
