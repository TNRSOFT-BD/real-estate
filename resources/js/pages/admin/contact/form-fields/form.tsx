import { CheckboxField, Field, SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
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
    { title: 'Form Fields', href: '/admin/contact/form-fields' },
];

const typeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
];

export default function FormFieldForm({ item }: Props) {
    const isEdit = Boolean(item);

    const { data, setData, post, put, transform, processing, errors } = useForm({
        name: typeof item?.name === 'string' ? item.name : '',
        label: typeof item?.label === 'string' ? item.label : '',
        type: typeof item?.type === 'string' ? item.type : 'text',
        placeholder: typeof item?.placeholder === 'string' ? item.placeholder : '',
        help_text: typeof item?.help_text === 'string' ? item.help_text : '',
        options: typeof item?.options === 'string' ? item.options : (Array.isArray(item?.options) ? item.options.map((o: any) => typeof o === 'string' ? o : o.value ?? o.label ?? '').join('\n') : ''),
        validation_rules: typeof item?.validation_rules === 'string' ? item.validation_rules : (Array.isArray(item?.validation_rules) ? (item.validation_rules as string[]).join(', ') : ''),
        is_required: Boolean(item?.is_required),
        is_active: Boolean(item?.is_active ?? true),
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => ({
            ...formData,
            options: formData.options ? formData.options.split('\n').map((o: string) => o.trim()).filter(Boolean) : [],
            validation_rules: formData.validation_rules
                ? formData.validation_rules.split(',').map((r: string) => r.trim()).filter(Boolean)
                : [],
        }));
        if (isEdit) {
            put(route('admin.contact.form-fields.update', { field: item?.id as number }));
        } else {
            post(route('admin.contact.form-fields.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} form field</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Add a new field to the contact form or edit an existing one.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.form-fields.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Field settings</CardTitle>
                            <CardDescription>One name maps directly to the submitted value. Unique validation rules apply at submission time.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Label" value={data.label} onChange={(value) => setData('label', value)} error={errors.label} required />
                            <TextField label="Name" value={data.name} onChange={(value) => setData('name', value)} error={errors.name} required hint="Unique identifier without spaces." />
                            <SelectField label="Type" value={data.type} onChange={(value) => setData('type', value)} options={typeOptions} error={errors.type} required />
                            <TextField label="Placeholder" value={data.placeholder} onChange={(value) => setData('placeholder', value)} error={errors.placeholder} />
                            <div className="sm:col-span-2">
                                <TextField label="Help text" value={data.help_text} onChange={(value) => setData('help_text', value)} error={errors.help_text} />
                            </div>
                            <div className="sm:col-span-2">
                                <TextAreaField label="Options" value={data.options} onChange={(value) => setData('options', value)} error={errors.options} hint="One option per line. Use for select, radio and checkbox fields." />
                            </div>
                            <div className="sm:col-span-2">
                                <TextField label="Extra validation rules" value={data.validation_rules} onChange={(value) => setData('validation_rules', value)} error={errors.validation_rules} hint="Comma-separated list, e.g. min:2, max:200, url." />
                            </div>
                            <Field label="Visibility">
                                <CheckboxField label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                            </Field>
                            <Field label="Required">
                                <CheckboxField label="Mark as required" checked={data.is_required} onChange={(value) => setData('is_required', value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save field'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}