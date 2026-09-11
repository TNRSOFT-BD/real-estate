import { CheckboxField, Field, SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Loader2, Save, X } from 'lucide-react';
import { useRef } from 'react';

type Props = { item?: Record<string, unknown> };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Team', href: '/admin/contact/team' },
];

const departmentOptions = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Support', label: 'Support' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Management', label: 'Management' },
    { value: 'Other', label: 'Other' },
];

export default function TeamMemberForm({ item }: Props) {
    const isEdit = Boolean(item);
    const existingAvatar = typeof item?.avatar === 'string' ? item.avatar : null;

    const { data, setData, post, put, processing, errors } = useForm({
        name: typeof item?.name === 'string' ? item.name : '',
        role: typeof item?.role === 'string' ? item.role : '',
        department: typeof item?.department === 'string' ? item.department : 'Support',
        email: typeof item?.email === 'string' ? item.email : '',
        phone: typeof item?.phone === 'string' ? item.phone : '',
        avatar: null as File | null,
        bio: typeof item?.bio === 'string' ? item.bio : '',
        availability: typeof item?.availability === 'string' ? item.availability : '',
        is_active: Boolean(item?.is_active ?? true),
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | undefined) => {
        if (file) setData('avatar', file);
    };

    const removeAvatar = () => {
        setData('avatar', null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.contact.team.update', { member: item?.id as number }));
        } else {
            post(route('admin.contact.team.store'));
        }
    };

    const preview = data.avatar ? URL.createObjectURL(data.avatar) : null;

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} encType="multipart/form-data" className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} team member</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Shown in the team section of the contact page.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.team.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Member details</CardTitle>
                            <CardDescription>Optional avatar, contact details and short bio.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Name" value={data.name} onChange={(value) => setData('name', value)} error={errors.name} required />
                            <TextField label="Role" value={data.role} onChange={(value) => setData('role', value)} error={errors.role} hint="e.g. Senior Agent." />
                            <SelectField label="Department" value={data.department} onChange={(value) => setData('department', value)} options={departmentOptions} error={errors.department} required />
                            <div />
                            <TextField label="Email" type="email" value={data.email} onChange={(value) => setData('email', value)} error={errors.email} />
                            <TextField label="Phone" value={data.phone} onChange={(value) => setData('phone', value)} error={errors.phone} />
                            <div className="sm:col-span-2">
                                <Field label="Avatar" error={errors.avatar} hint="JPEG, PNG or WebP up to 2 MB.">
                                    {(preview || (existingAvatar && !data.avatar)) ? (
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={preview ?? (mediaUrl(existingAvatar ?? '') ?? undefined)}
                                                alt="Avatar preview"
                                                className="h-16 w-16 rounded-full object-cover"
                                            />
                                            <Button type="button" size="sm" variant="outline" onClick={removeAvatar}>
                                                <X />
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-6 text-sm text-muted-foreground hover:bg-muted/40">
                                            <ImagePlus className="size-4" />
                                            Upload avatar
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="sr-only"
                                                onChange={(e) => handleFile(e.target.files?.[0])}
                                            />
                                        </label>
                                    )}
                                </Field>
                            </div>
                            <div className="sm:col-span-2">
                                <TextAreaField label="Bio" value={data.bio} onChange={(value) => setData('bio', value)} error={errors.bio} rows={4} />
                            </div>
                            <div className="sm:col-span-2">
                                <TextField label="Availability" value={data.availability} onChange={(value) => setData('availability', value)} error={errors.availability} hint="e.g. Mon–Fri 9am–5pm." />
                            </div>
                            <Field label="Visibility">
                                <CheckboxField label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save member'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}