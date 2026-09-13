import { CheckboxField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ProjectTypeItem } from '@/types/project-admin';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Project Types', href: '/admin/project-types' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

export default function ProjectTypeForm({ item }: { item?: ProjectTypeItem }) {
    const isEdit = Boolean(item);

    const { data, setData, post, put, processing, errors } = useForm({
        name: str(item?.name),
        slug: str(item?.slug),
        description: str(item?.description),
        icon: str(item?.icon),
        sort_order: item?.sort_order ?? 0,
        is_active: item?.is_active ?? true,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit && item) {
            put(route('admin.project-types.update', { projectType: item.id }), { preserveScroll: true });
        } else {
            post(route('admin.project-types.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Create'} Project Type</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Database-driven project types used across projects.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.project-types.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                        <CardDescription>Name, slug, icon and ordering.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 sm:grid-cols-2">
                        <TextField label="Name" value={data.name} onChange={(value) => setData('name', value)} error={errors.name} required />
                        <TextField
                            label="Slug"
                            value={data.slug}
                            onChange={(value) => setData('slug', value)}
                            error={errors.slug}
                            hint="Leave blank to generate from the name."
                        />
                        <TextField label="Icon" value={data.icon} onChange={(value) => setData('icon', value)} error={errors.icon} hint="Icon name, e.g. Building2." />
                        <TextField
                            label="Sort order"
                            type="number"
                            value={String(data.sort_order)}
                            onChange={(value) => setData('sort_order', Number(value) || 0)}
                            error={errors.sort_order}
                        />
                        <div className="sm:col-span-2">
                            <TextAreaField label="Description" value={data.description} onChange={(value) => setData('description', value)} error={errors.description} />
                        </div>
                        <div className="sm:col-span-2">
                            <CheckboxField
                                label="Active"
                                checked={data.is_active}
                                onChange={(value) => setData('is_active', value)}
                                error={errors.is_active}
                                hint="Inactive types stay assigned to existing projects but cannot be selected for new ones."
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-card sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save type'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
