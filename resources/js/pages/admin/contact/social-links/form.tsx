import { CheckboxField, Field, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

type Props = { item?: Record<string, unknown> };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Social Links', href: '/admin/contact/social-links' },
];

const platformOptions = [
    'Facebook', 'Instagram', 'Twitter / X', 'LinkedIn', 'YouTube', 'TikTok', 'WhatsApp', 'Telegram', 'Zalo', 'Viber', 'Pinterest', 'Other',
];

export default function SocialLinkForm({ item }: Props) {
    const isEdit = Boolean(item);

    const { data, setData, post, put, processing, errors } = useForm({
        platform: typeof item?.platform === 'string' ? item.platform : '',
        label: typeof item?.label === 'string' ? item.label : '',
        url: typeof item?.url === 'string' ? item.url : '',
        icon: typeof item?.icon === 'string' ? item.icon : '',
        is_active: Boolean(item?.is_active ?? true),
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.contact.social-links.update', { link: item?.id as number }));
        } else {
            post(route('admin.contact.social-links.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} social link</h1>
                        <p className="mt-1 text-sm text-muted-foreground">A profile link shown in the contact section.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.social-links.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Link details</CardTitle>
                            <CardDescription>Use a full https:// URL to avoid unsafe link schemes.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <Field label="Platform" required error={errors.platform}>
                                <select
                                    value={data.platform}
                                    onChange={(e) => setData('platform', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                                >
                                    <option value="">Select…</option>
                                    {platformOptions.map((label) => (
                                        <option key={label} value={label}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <TextField label="Label" value={data.label} onChange={(value) => setData('label', value)} error={errors.label} hint="Optional display text." />
                            <div className="sm:col-span-2">
                                <TextField label="URL" value={data.url} onChange={(value) => setData('url', value)} error={errors.url} required placeholder="https://…" />
                            </div>
                            <TextField label="Icon" value={data.icon} onChange={(value) => setData('icon', value)} error={errors.icon} hint="Optional custom icon path." />
                            <Field label="Visibility">
                                <CheckboxField label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save link'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}