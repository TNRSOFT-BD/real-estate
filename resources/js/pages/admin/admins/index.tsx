import ChangePasswordDialog from '@/components/admin/admins/change-password-dialog';
import DeleteAdminDialog from '@/components/admin/admins/delete-admin-dialog';
import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import AdminPagination from '@/components/admin/contact/admin-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type AdminFilters, type AdminItem, type FlashAlert, type Paginator } from '@/types/admin';
import { Link, router, usePage } from '@inertiajs/react';
import { KeyRound, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface AdminIndexProps {
    items: Paginator<AdminItem>;
    filters: AdminFilters;
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Administrators', href: '/admin/admins' },
];

const perPageOptions = [10, 20, 50];

function AdminActions({
    item,
    isSelf,
    onChangePassword,
    onDelete,
}: {
    item: AdminItem;
    isSelf: boolean;
    onChangePassword: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={route('admin.admins.edit', { admin: item.id })}>
                            <Pencil />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onChangePassword}>
                        <KeyRound />
                        Change password
                    </DropdownMenuItem>
                    {!isSelf && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default function AdminIndex({ items, filters, flash }: AdminIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const pathname = window.location.pathname;
    const [search, setSearch] = useState(filters.search ?? '');
    const [perPage, setPerPage] = useState(String(filters.per_page ?? items.per_page));
    const [passwordTarget, setPasswordTarget] = useState<AdminItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminItem | null>(null);
    const searchTimer = useRef<number | null>(null);

    const applyFilters = (nextSearch: string, nextPerPage: string) => {
        const params: Record<string, string> = {};
        if (nextSearch) params.search = nextSearch;
        if (nextPerPage) params.per_page = nextPerPage;
        router.get(pathname, params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);

        if (searchTimer.current) {
            window.clearTimeout(searchTimer.current);
        }

        searchTimer.current = window.setTimeout(() => applyFilters(value, perPage), 300);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Administrators"
                    description="Manage the accounts that can access the admin panel."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.admins.create')}>
                                <Plus />
                                Add administrator
                            </Link>
                        </Button>
                    }
                />

                <div className="overflow-hidden rounded-xl border">
                    <div className="border-b bg-muted/40 p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => handleSearchChange(event.target.value)}
                                    placeholder="Search name or email…"
                                    className="w-full pl-9"
                                    aria-label="Search administrators"
                                />
                            </div>
                            <select
                                value={perPage}
                                onChange={(event) => {
                                    setPerPage(event.target.value);
                                    applyFilters(search, event.target.value);
                                }}
                                className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm sm:flex-none"
                                aria-label="Rows per page"
                            >
                                {perPageOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option} per page
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {items.data.length > 0 ? (
                        <>
                            <ul className="divide-y sm:hidden">
                                {items.data.map((item) => (
                                    <li key={item.id} className="flex items-start gap-3 p-4">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="text-foreground truncate text-sm font-medium">{item.name}</span>
                                                {item.id === auth.user.id && <Badge variant="secondary">You</Badge>}
                                            </div>
                                            <p className="text-muted-foreground truncate text-xs">{item.email}</p>
                                            <p className="text-muted-foreground text-xs">
                                                Created {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <AdminActions
                                                item={item}
                                                isSelf={item.id === auth.user.id}
                                                onChangePassword={() => setPasswordTarget(item)}
                                                onDelete={() => setDeleteTarget(item)}
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
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">Created</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40">
                                            <td className="px-4 py-3 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate">{item.name}</span>
                                                    {item.id === auth.user.id && <Badge variant="secondary">You</Badge>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{item.email}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <AdminActions
                                                    item={item}
                                                    isSelf={item.id === auth.user.id}
                                                    onChangePassword={() => setPasswordTarget(item)}
                                                    onDelete={() => setDeleteTarget(item)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    ) : (
                        <div className="flex min-h-40 items-center justify-center p-8 text-sm text-muted-foreground">
                            No administrators found.
                        </div>
                    )}

                    <AdminPagination paginator={items} />
                </div>
            </div>

            <ChangePasswordDialog admin={passwordTarget} open={passwordTarget !== null} onOpenChange={(open) => !open && setPasswordTarget(null)} />
            <DeleteAdminDialog admin={deleteTarget} open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} />
        </AppLayout>
    );
}
