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
    { title: 'FAQs', href: '/admin/contact/faqs' },
];

const locationOptions = [
    { value: 'all', label: 'All Pages' },
    { value: 'homepage', label: 'Homepage' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'faq', label: 'FAQ Page' },
    { value: 'packages', label: 'Packages Page' },
];

export default function FaqForm({ item }: Props) {
    const isEdit = Boolean(item);

    const { data, setData, post, put, processing, errors } = useForm({
        question: typeof item?.question === 'string' ? item.question : '',
        answer: typeof item?.answer === 'string' ? item.answer : '',
        category: typeof item?.category === 'string' ? item.category : '',
        display_location: typeof item?.display_location === 'string' ? item.display_location : 'contact',
        is_active: Boolean(item?.is_active ?? true),
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.contact.faqs.update', { faq: item?.id as number }));
        } else {
            post(route('admin.contact.faqs.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} FAQ</h1>
                        <p className="mt-1 text-sm text-muted-foreground">A question shown in the FAQ accordion on the contact page.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.faqs.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>FAQ details</CardTitle>
                            <CardDescription>Keep the answer concise. Answers support short formatted text.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <TextField label="Question" value={data.question} onChange={(value) => setData('question', value)} error={errors.question} required />
                            <TextAreaField label="Answer" value={data.answer} onChange={(value) => setData('answer', value)} error={errors.answer} required rows={6} />
                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField label="Category" value={data.category} onChange={(value) => setData('category', value)} error={errors.category} hint="Optional grouping label." />
                                <SelectField label="Display location" value={data.display_location} onChange={(value) => setData('display_location', value)} options={locationOptions} error={errors.display_location} required />
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
                        {processing ? 'Saving…' : 'Save FAQ'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}