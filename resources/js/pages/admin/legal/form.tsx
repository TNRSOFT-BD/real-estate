import RichTextEditor from '@/components/admin/legal/rich-text-editor';
import { SelectField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AdminLegalItem, type LegalTypeOption } from '@/types/legal';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface LegalPageFormProps {
    page?: AdminLegalItem;
    types: LegalTypeOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Legal', href: '/admin/legal' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

export default function LegalPageForm({ page, types }: LegalPageFormProps) {
    const isEdit = Boolean(page);

    const { data, setData, post, put, processing, errors } = useForm({
        type: str(page?.type) || types[0]?.value || 'privacy_policy',
        title: str(page?.title),
        slug: str(page?.slug),
        status: str(page?.status) || 'draft',
        content: str(page?.content),
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit && page) {
            put(route('admin.legal.update', { page: page.id }), { preserveScroll: true });
        } else {
            post(route('admin.legal.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Create'} Legal Page</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage the Privacy Policy and Terms &amp; Conditions content.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.legal.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="grid max-w-5xl gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page</CardTitle>
                            <CardDescription>Type, title, slug and publishing status.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <SelectField
                                label="Page type"
                                value={data.type}
                                onChange={(value) => setData('type', value)}
                                options={types.map((type) => ({ value: type.value, label: type.label }))}
                                error={errors.type}
                                required
                            />
                            <SelectField
                                label="Status"
                                value={data.status}
                                onChange={(value) => setData('status', value)}
                                options={[
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'published', label: 'Published' },
                                ]}
                                error={errors.status}
                                required
                            />
                            <TextField label="Title" value={data.title} onChange={(value) => setData('title', value)} error={errors.title} required />
                            <TextField label="Slug" value={data.slug} onChange={(value) => setData('slug', value)} error={errors.slug} hint="Lowercase words separated by hyphens." />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>Rich text shown on the public legal page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RichTextEditor
                                value={data.content}
                                onChange={(html) => setData('content', html)}
                                error={Boolean(errors.content)}
                                placeholder="Write your legal content here..."
                            />
                            {errors.content && <p className="text-destructive mt-2 text-sm">{errors.content}</p>}
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card sticky bottom-4 flex w-full max-w-5xl items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save page'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
