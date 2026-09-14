import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { SelectField, TextAreaField, TextField, CheckboxField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    type CurrencyConfig,
    type FlashAlert,
    type ProjectPricingPlanItem,
    type SelectOption,
} from '@/types/project-admin';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowDown, ArrowUp, Copy, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PricingIndexProps {
    project: { id: number; title: string; slug: string };
    plans: { data: ProjectPricingPlanItem[] };
    statuses: SelectOption[];
    currency: CurrencyConfig;
    flash?: FlashAlert;
}

export default function ProjectPricingIndex({ project, plans, statuses, currency, flash }: PricingIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/admin/projects' },
        { title: project.title, href: route('admin.projects.edit', { project: project.id }) },
        { title: 'Pricing', href: '#' },
    ];

    const move = (index: number, direction: -1 | 1) => {
        const ids = plans.data.map((plan) => plan.id);
        const target = index + direction;

        if (target < 0 || target >= ids.length) {
            return;
        }

        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.patch(route('admin.projects.pricing.reorder', { project: project.id }), { ids }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={`Pricing & Units — ${project.title}`}
                    description={`Manage unit types and pricing. Currency: ${currency.code}.`}
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

                <NewPricingPlan projectId={project.id} statuses={statuses} />

                {plans.data.length > 0 ? (
                    <div className="space-y-4">
                        {plans.data.map((plan, index) => (
                            <PricingRow
                                key={plan.id}
                                plan={plan}
                                projectId={project.id}
                                statuses={statuses}
                                symbol={currency.symbol}
                                isFirst={index === 0}
                                isLast={index === plans.data.length - 1}
                                onMoveUp={() => move(index, -1)}
                                onMoveDown={() => move(index, 1)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground flex min-h-40 items-center justify-center rounded-xl border p-8 text-sm">
                        No pricing plans added. Add unit types and pricing information.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function NewPricingPlan({ projectId, statuses }: { projectId: number; statuses: SelectOption[] }) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        unit_type: string;
        size_sqft: string;
        price_per_sqft: string;
        total_price: string;
        booking_money: string;
        down_payment_percentage: string;
        installment_plan: string;
        status: string;
        is_featured: boolean;
    }>({
        unit_type: '',
        size_sqft: '',
        price_per_sqft: '',
        total_price: '',
        booking_money: '',
        down_payment_percentage: '',
        installment_plan: '',
        status: 'available',
        is_featured: false,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('admin.projects.pricing.store', { project: projectId }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle>Add pricing plan</CardTitle>
                    <CardDescription>Unit type, size, pricing and availability.</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={() => setOpen((value) => !value)}>
                    <Plus className="size-4" />
                    {open ? 'Close' : 'Add plan'}
                </Button>
            </CardHeader>
            {open && (
                <CardContent>
                    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
                        <TextField label="Unit type" value={data.unit_type} onChange={(v) => setData('unit_type', v)} error={errors.unit_type} required />
                        <TextField label="Size (sqft)" value={data.size_sqft} onChange={(v) => setData('size_sqft', v)} error={errors.size_sqft} />
                        <TextField label="Price / sqft" value={data.price_per_sqft} onChange={(v) => setData('price_per_sqft', v)} error={errors.price_per_sqft} />
                        <TextField label="Total price" value={data.total_price} onChange={(v) => setData('total_price', v)} error={errors.total_price} />
                        <TextField label="Booking money" value={data.booking_money} onChange={(v) => setData('booking_money', v)} error={errors.booking_money} />
                        <TextField label="Down payment (%)" value={data.down_payment_percentage} onChange={(v) => setData('down_payment_percentage', v)} error={errors.down_payment_percentage} />
                        <SelectField label="Status" value={data.status} onChange={(v) => setData('status', v)} options={statuses} error={errors.status} required />
                        <div className="flex items-end">
                            <CheckboxField label="Featured" checked={data.is_featured} onChange={(v) => setData('is_featured', v)} error={errors.is_featured} />
                        </div>
                        <div className="sm:col-span-3">
                            <TextAreaField label="Installment plan" value={data.installment_plan} onChange={(v) => setData('installment_plan', v)} error={errors.installment_plan} rows={2} />
                        </div>
                        <div className="sm:col-span-3">
                            <Button type="submit" disabled={processing}>
                                {processing ? <Loader2 className="animate-spin" /> : <Plus />}
                                Add plan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            )}
        </Card>
    );
}

function PricingRow({
    plan,
    projectId,
    statuses,
    symbol,
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
}: {
    plan: ProjectPricingPlanItem;
    projectId: number;
    statuses: SelectOption[];
    symbol: string;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        unit_type: plan.unit_type,
        size_sqft: plan.size_sqft ?? '',
        price_per_sqft: plan.price_per_sqft ?? '',
        total_price: plan.total_price ?? '',
        booking_money: plan.booking_money ?? '',
        down_payment_percentage: plan.down_payment_percentage ?? '',
        installment_plan: plan.installment_plan ?? '',
        status: plan.status,
        is_featured: plan.is_featured,
    });

    const save = () => {
        put(route('admin.projects.pricing.update', { project: projectId, pricing: plan.id }), { preserveScroll: true });
    };

    return (
        <Card>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
                <TextField label="Unit type" value={data.unit_type} onChange={(v) => setData('unit_type', v)} error={errors.unit_type} />
                <TextField label="Size (sqft)" value={String(data.size_sqft)} onChange={(v) => setData('size_sqft', v)} error={errors.size_sqft} />
                <TextField label={`Price / sqft (${symbol})`} value={String(data.price_per_sqft)} onChange={(v) => setData('price_per_sqft', v)} error={errors.price_per_sqft} />
                <TextField label={`Total (${symbol})`} value={String(data.total_price)} onChange={(v) => setData('total_price', v)} error={errors.total_price} />
                <TextField label={`Booking (${symbol})`} value={String(data.booking_money)} onChange={(v) => setData('booking_money', v)} error={errors.booking_money} />
                <TextField label="Down payment (%)" value={String(data.down_payment_percentage)} onChange={(v) => setData('down_payment_percentage', v)} error={errors.down_payment_percentage} />
                <SelectField label="Status" value={data.status} onChange={(v) => setData('status', v)} options={statuses} error={errors.status} />
                <div className="flex items-end">
                    <CheckboxField label="Featured" checked={data.is_featured} onChange={(v) => setData('is_featured', v)} error={errors.is_featured} />
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:col-span-3">
                    <Button type="button" size="sm" onClick={save} disabled={processing}>
                        {processing ? <Loader2 className="size-4 animate-spin" /> : null}
                        Save
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => router.post(route('admin.projects.pricing.duplicate', { project: projectId, pricing: plan.id }), {}, { preserveScroll: true })}>
                        <Copy className="size-4" />
                        Duplicate
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={onMoveUp} disabled={isFirst} aria-label="Move up">
                        <ArrowUp className="size-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={onMoveDown} disabled={isLast} aria-label="Move down">
                        <ArrowDown className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            if (window.confirm('Delete this pricing plan?')) {
                                router.delete(route('admin.projects.pricing.destroy', { project: projectId, pricing: plan.id }), { preserveScroll: true });
                            }
                        }}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
