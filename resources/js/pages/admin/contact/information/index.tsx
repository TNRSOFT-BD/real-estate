import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { TableFrame, Td, Th } from '@/components/admin/contact/admin-table';
import RowActions from '@/components/admin/contact/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AdminInformationItem, type Filters, type FlashAlert, type Paginator } from '@/types/contact-admin';
import { Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InformationIndexProps {
    items: Paginator<AdminInformationItem>;
    filters: Filters;
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Information', href: '/admin/contact/information' },
];

const typeOptions = [
    { value: 'hotline', label: 'Hotline' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'address', label: 'Address' },
    { value: 'business_hours', label: 'Business hours' },
    { value: 'support', label: 'Support' },
    { value: 'sales', label: 'Sales' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'other', label: 'Other' },
];

export default function InformationIndex({ items, filters, flash }: InformationIndexProps) {
    const { pathname } = window.location;
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [active, setActive] = useState(filters.is_active ?? '');

    useEffect(() => {
        const timer = setTimeout(() => applyFilters(), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (type) params.set('type', type);
        if (active !== '') params.set('is_active', active);
        router.get(pathname, Object.fromEntries(params), { preserveState: true, preserveScroll: true, replace: true });
    };

    const moveItem = (id: number, direction: 1 | -1) => {
        const ids = items.data.map((item) => item.id);
        const index = ids.indexOf(id);
        const target = index + direction;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.patch(route('admin.contact.information.reorder'), { ids }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Contact Information"
                    description="Phone numbers, emails, addresses and hours shown on the page."
                    flash={flash}
                    actions={
                        <Button asChild>
                            <Link href={route('admin.contact.information.create')}>
                                <Plus />
                                Add information
                            </Link>
                        </Button>
                    }
                />

                <TableFrame
                    paginator={items}
                    emptyMessage="No contact information yet. Add your first item."
                    toolbar={
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search…"
                                    className="w-56 pl-9"
                                    aria-label="Search"
                                />
                            </div>
                            <select
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                aria-label="Filter by type"
                            >
                                <option value="">All types</option>
                                {typeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={active}
                                onChange={(e) => {
                                    setActive(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                aria-label="Filter by status"
                            >
                                <option value="">Any status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    }
                >
                    <table className="w-full min-w-[720px] border-collapse">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <Th>Title</Th>
                                <Th>Type</Th>
                                <Th>Value</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.map((item, index) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40">
                                    <Td>
                                        <div className="font-medium">{item.title}</div>
                                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                    </Td>
                                    <Td>
                                        <Badge variant="secondary">{item.type.replaceAll('_', ' ')}</Badge>
                                    </Td>
                                    <Td className="break-all">{item.value}</Td>
                                    <Td>
                                        <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge>
                                    </Td>
                                    <Td>
                                        <RowActions
                                            editUrl={route('admin.contact.information.edit', { information: item.id })}
                                            onToggle={() => router.patch(route('admin.contact.information.toggle', { information: item.id }), {}, { preserveScroll: true })}
                                            onDelete={() => router.delete(route('admin.contact.information.destroy', { information: item.id }), { preserveScroll: true })}
                                            showMoveControls
                                            onMoveUp={() => moveItem(item.id, -1)}
                                            onMoveDown={() => moveItem(item.id, 1)}
                                            isFirst={index === 0}
                                            isLast={index === items.data.length - 1}
                                        />
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableFrame>
            </div>
        </AppLayout>
    );
}