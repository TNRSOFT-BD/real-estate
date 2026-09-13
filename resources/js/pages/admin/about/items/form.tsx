import { CheckboxField, Field, SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { aboutItemTypeLabels, type AboutItemFormData, type AboutItemType, type AdminAboutItem } from '@/types/about-admin';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface AboutItemFormProps {
    item?: AdminAboutItem;
    types: AboutItemType[];
    selectedType: AboutItemType;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'About', href: '/admin/about/settings' },
    { title: 'Content', href: '/admin/about/items' },
];

const TYPES_WITH_TITLE: AboutItemType[] = ['mission', 'vision', 'value', 'milestone', 'feature', 'partner'];
const TYPES_WITH_IMAGE: AboutItemType[] = ['mission', 'vision', 'value', 'milestone', 'feature', 'partner'];
const TYPES_WITH_ICON: AboutItemType[] = ['mission', 'vision', 'statistic', 'value', 'milestone', 'feature'];

export default function AboutItemForm({ item, types, selectedType }: AboutItemFormProps) {
    const isEdit = Boolean(item);

    const { data, setData, post, processing, errors, transform } = useForm<AboutItemFormData>({
        type: item?.type ?? selectedType,
        title: item?.title ?? '',
        subtitle: item?.subtitle ?? '',
        description: item?.description ?? '',
        content: item?.content ?? '',
        value: item?.value ?? '',
        label: item?.label ?? '',
        year: item?.year ?? '',
        date: item?.date ? String(item.date).slice(0, 10) : '',
        image: null,
        image_alt: item?.image_alt ?? '',
        icon: item?.icon ?? '',
        url: item?.url ?? '',
        sort_order: item?.sort_order ?? 0,
        is_active: item?.is_active ?? true,
        is_featured: item?.is_featured ?? false,
    });

    const type = data.type;
    const has = (list: AboutItemType[]) => list.includes(type);
    const typeOptions = types.map((value) => ({ value, label: aboutItemTypeLabels[value] }));
    const currentImage = mediaUrl(item?.image ?? null);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => {
            const payload = { ...formData } as Record<string, unknown>;

            if (isEdit) {
                payload._method = 'put';
            }

            if (!payload.type) {
                payload.type = item?.type ?? selectedType;
            }

            if (!(payload.image instanceof File)) {
                delete payload.image;
            }

            return payload as unknown as AboutItemFormData;
        });

        const options = { forceFormData: true } as const;

        if (isEdit && item) {
            post(route('admin.about.items.update', { item: item.id }), options);
        } else {
            post(route('admin.about.items.store'), options);
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} About content</h1>
                        <p className="mt-1 text-sm text-muted-foreground">A single entry in one of the About page sections.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.about.items.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="grid max-w-4xl gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section</CardTitle>
                            <CardDescription>Which About section this entry belongs to.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <SelectField label="Section" value={type} onChange={(value) => setData('type', value as AboutItemType)} options={typeOptions} error={errors.type} required />
                            <TextField
                                label="Sort order"
                                type="number"
                                value={String(data.sort_order)}
                                onChange={(value) => setData('sort_order', Number(value) || 0)}
                                error={errors.sort_order}
                                hint="Lower numbers appear first."
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>Fields adapt to the selected section.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            {has(TYPES_WITH_TITLE) && (
                                <TextField label="Title" value={data.title} onChange={(value) => setData('title', value)} error={errors.title} required />
                            )}

                            {type === 'statistic' && (
                                <>
                                    <TextField label="Value" value={data.value} onChange={(value) => setData('value', value)} error={errors.value} required hint="e.g. 15+ or 10K+" />
                                    <TextField label="Label" value={data.label} onChange={(value) => setData('label', value)} error={errors.label} required hint="e.g. Years of experience" />
                                </>
                            )}

                            {type === 'milestone' && (
                                <>
                                    <TextField label="Year" value={data.year} onChange={(value) => setData('year', value)} error={errors.year} required />
                                    <TextField label="Date" type="date" value={data.date} onChange={(value) => setData('date', value)} error={errors.date} />
                                </>
                            )}

                            {type === 'partner' && (
                                <TextField label="Website URL" value={data.url} onChange={(value) => setData('url', value)} error={errors.url} hint="Optional external link." />
                            )}

                            <TextField label="Subtitle" value={data.subtitle} onChange={(value) => setData('subtitle', value)} error={errors.subtitle} hint="Optional." />

                            <div className="sm:col-span-2">
                                <TextAreaField label="Description" value={data.description} onChange={(value) => setData('description', value)} error={errors.description} rows={3} />
                            </div>

                            {has(['mission', 'vision', 'value', 'feature']) && (
                                <div className="sm:col-span-2">
                                    <TextAreaField label="Content" value={data.content} onChange={(value) => setData('content', value)} error={errors.content} rows={4} hint="Optional extended copy." />
                                </div>
                            )}

                            {has(TYPES_WITH_ICON) && (
                                <TextField label="Icon" value={data.icon} onChange={(value) => setData('icon', value)} error={errors.icon} hint="Optional icon key or URL." />
                            )}
                        </CardContent>
                    </Card>

                    {has(TYPES_WITH_IMAGE) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Image</CardTitle>
                                <CardDescription>Optional image or logo for this entry.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field label="Image" error={errors.image}>
                                        <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="text-muted-foreground file:bg-muted mt-1 flex h-10 w-full cursor-pointer items-center text-sm file:mr-3 file:cursor-pointer file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium" />
                                    </Field>
                                    {currentImage && !(data.image instanceof File) && (
                                        <div className="mt-3">
                                            <p className="text-muted-foreground text-xs">Current image</p>
                                            <img src={currentImage} alt="" className="mt-1 h-24 w-auto border object-cover" />
                                        </div>
                                    )}
                                </div>
                                <TextField label="Image alt text" value={data.image_alt} onChange={(value) => setData('image_alt', value)} error={errors.image_alt} />
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                            <Field label="Visibility">
                                <CheckboxField label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                            </Field>
                            <Field label="Highlight">
                                <CheckboxField label="Featured" checked={data.is_featured} onChange={(value) => setData('is_featured', value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card sticky bottom-4 flex w-full max-w-4xl items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save item'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
