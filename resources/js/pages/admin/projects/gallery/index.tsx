import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import AdminPagination from '@/components/admin/contact/admin-pagination';
import { SelectField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { type Filters, type FlashAlert, type Paginator, type ProjectGalleryItem, type SelectOption } from '@/types/project-admin';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowDown, ArrowUp, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

interface GalleryIndexProps {
    project: { id: number; title: string; slug: string };
    images: Paginator<ProjectGalleryItem>;
    types: SelectOption[];
    flash?: FlashAlert;
    filters?: Filters;
}

export default function ProjectGalleryIndex({ project, images, types, flash }: GalleryIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/admin/projects' },
        { title: project.title, href: route('admin.projects.edit', { project: project.id }) },
        { title: 'Gallery', href: '#' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<{
        images: File[];
        types: string[];
        captions: string[];
        alt_texts: string[];
    }>({ images: [], types: [], captions: [], alt_texts: [] });

    const [selected, setSelected] = useState<File[]>([]);

    const onFiles = (fileList: FileList | null) => {
        const files = Array.from(fileList ?? []);
        setSelected(files);
        setData((current) => ({
            ...current,
            images: files,
            types: files.map(() => 'exterior'),
            captions: files.map(() => ''),
            alt_texts: files.map(() => ''),
        }));
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('admin.projects.gallery.store', { project: project.id }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSelected([]);
                reset();
            },
        });
    };

    const move = (index: number, direction: -1 | 1) => {
        const ids = images.data.map((image) => image.id);
        const target = index + direction;

        if (target < 0 || target >= ids.length) {
            return;
        }

        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.patch(route('admin.projects.gallery.reorder', { project: project.id }), { ids }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={`Gallery — ${project.title}`}
                    description="Upload, caption, reorder and feature gallery images."
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

                <Card>
                    <CardHeader>
                        <CardTitle>Upload images</CardTitle>
                        <CardDescription>Select one or more images (JPEG, PNG or WebP) with an optional caption.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(event) => onFiles(event.target.files)} className="text-sm" />
                            {errors.images && <p className="text-destructive text-sm">{errors.images}</p>}

                            {selected.map((file, index) => (
                                <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
                                    <p className="text-muted-foreground truncate text-sm sm:col-span-3">{file.name}</p>
                                    <SelectField
                                        label="Type"
                                        value={data.types[index] ?? 'exterior'}
                                        onChange={(value) => setData('types', data.types.map((item, i) => (i === index ? value : item)))}
                                        options={types}
                                    />
                                    <TextField label="Caption" value={data.captions[index] ?? ''} onChange={(value) => setData('captions', data.captions.map((item, i) => (i === index ? value : item)))} />
                                    <TextField label="Alt text" value={data.alt_texts[index] ?? ''} onChange={(value) => setData('alt_texts', data.alt_texts.map((item, i) => (i === index ? value : item)))} />
                                </div>
                            ))}

                            <Button type="submit" disabled={processing || selected.length === 0}>
                                {processing ? <Loader2 className="animate-spin" /> : <Upload />}
                                Upload {selected.length > 0 ? `(${selected.length})` : ''}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {images.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {images.data.map((image, index) => (
                            <GalleryCard
                                key={image.id}
                                image={image}
                                projectId={project.id}
                                types={types}
                                isFirst={index === 0}
                                isLast={index === images.data.length - 1}
                                onMoveUp={() => move(index, -1)}
                                onMoveDown={() => move(index, 1)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground flex min-h-40 items-center justify-center rounded-xl border p-8 text-sm">
                        No gallery images yet. Upload project images to build the gallery.
                    </div>
                )}

                <AdminPagination paginator={images} />
            </div>
        </AppLayout>
    );
}

function GalleryCard({
    image,
    projectId,
    types,
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
}: {
    image: ProjectGalleryItem;
    projectId: number;
    types: SelectOption[];
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        type: image.type,
        caption: image.caption ?? '',
        alt_text: image.alt_text ?? '',
        is_featured: image.is_featured,
    });

    const save = () => put(route('admin.projects.gallery.update', { project: projectId, gallery: image.id }), { preserveScroll: true });

    return (
        <Card>
            <CardContent className="space-y-3 p-4">
                <img src={mediaUrl(image.image_path) ?? ''} alt={image.alt_text ?? ''} className="aspect-video w-full rounded-md border object-cover" />

                <SelectField label="Type" value={data.type} onChange={(value) => setData('type', value)} options={types} error={errors.type} />
                <TextField label="Caption" value={data.caption} onChange={(value) => setData('caption', value)} error={errors.caption} />
                <TextField label="Alt text" value={data.alt_text} onChange={(value) => setData('alt_text', value)} error={errors.alt_text} />

                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" size="sm" onClick={save} disabled={processing}>
                        {processing ? <Loader2 className="size-4 animate-spin" /> : null}
                        Save
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
                        variant={image.is_featured ? 'default' : 'outline'}
                        onClick={() => router.patch(route('admin.projects.gallery.feature', { project: projectId, gallery: image.id }), { is_featured: !image.is_featured }, { preserveScroll: true })}
                    >
                        <Star className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            if (window.confirm('Delete this image?')) {
                                router.delete(route('admin.projects.gallery.destroy', { project: projectId, gallery: image.id }), { preserveScroll: true });
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
