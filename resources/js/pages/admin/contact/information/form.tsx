import { CheckboxField, Field, SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface Props {
    item?: Record<string, unknown>;
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

export default function InformationForm({ item }: Props) {
    const isEdit = Boolean(item);

    const { data, setData, post, put, processing, errors } = useForm({
        type: typeof item?.type === 'string' ? item.type : '',
        title: typeof item?.title === 'string' ? item.title : '',
        value: typeof item?.value === 'string' ? item.value : '',
        secondary_value: typeof item?.secondary_value === 'string' ? item.secondary_value : '',
        icon: typeof item?.icon === 'string' ? item.icon : '',
        description: typeof item?.description === 'string' ? item.description : '',
        link: typeof item?.link === 'string' ? item.link : '',
        is_active: Boolean(item?.is_active ?? true),
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.contact.information.update', { information: item?.id as number }));
        } else {
            post(route('admin.contact.information.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} contact information</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Contact details shown in the info cards on the page.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.information.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>Set the type, title and value. Links open the value in a new tab.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <SelectField label="Type" value={data.type} onChange={(value) => setData('type', value)} options={typeOptions} error={errors.type} required />
                            <TextField label="Title" value={data.title} onChange={(value) => setData('title', value)} error={errors.title} required />
                            <div className="sm:col-span-2">
                                <TextField label="Value" value={data.value} onChange={(value) => setData('value', value)} error={errors.value} required hint="Main displayed value, e.g. phone number or address." />
                            </div>
                            <div className="sm:col-span-2">
                                <TextField label="Secondary value" value={data.secondary_value} onChange={(value) => setData('secondary_value', value)} error={errors.secondary_value} />
                            </div>
                            <TextField label="Link" value={data.link} onChange={(value) => setData('link', value)} error={errors.link} hint="Optional href, e.g. tel: or mailto: or an address URL." />
                            <TextField label="Icon" value={data.icon} onChange={(value) => setData('icon', value)} error={errors.icon} hint="Optional uploaded icon path." />
                            <div className="sm:col-span-2">
                                <TextAreaField label="Description" value={data.description} onChange={(value) => setData('description', value)} error={errors.description} />
                            </div>
                            <Field label="Visibility" hint="Inactive items are hidden from the public page.">
                                <CheckboxField label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}