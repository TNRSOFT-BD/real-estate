import RichTextEditor from '@/components/admin/legal/rich-text-editor';
import { SelectField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AdminLegalItem } from '@/types/legal';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface LegalPageFormProps {
    page?: AdminLegalItem;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Legal', href: '/admin/legal' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function LegalPageForm({ page }: LegalPageFormProps) {
    const isEdit = Boolean(page);

    const { data, setData, post, put, processing, errors } = useForm({
        title: str(page?.title),
        status: str(page?.status) || 'draft',
        content: str(page?.content),
    });

    const slug = slugify(data.title);

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
                        <p className="text-muted-foreground mt-1 text-sm">Manage the content shown on the public legal pages.</p>
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
                            <CardDescription>Title and publishing status. The URL is generated from the title.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
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
                            <div className="grid gap-2 sm:col-span-2">
                                <span className="text-sm font-medium">Public URL</span>
                                <div className="border-input bg-muted/40 text-muted-foreground flex h-10 items-center rounded-md border px-3 text-sm">
                                    <span className="truncate">/{slug || '…'}</span>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Generated from the title. A numeric suffix is added automatically if the URL is already taken.
                                </p>
                            </div>
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
