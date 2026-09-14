import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { type FlashAlert, type ProjectFloorPlanItem } from '@/types/project-admin';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

interface FloorPlansIndexProps {
    project: { id: number; title: string; slug: string };
    floorPlans: ProjectFloorPlanItem[];
    flash?: FlashAlert;
}

export default function ProjectFloorPlansIndex({ project, floorPlans, flash }: FloorPlansIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/admin/projects' },
        { title: project.title, href: route('admin.projects.edit', { project: project.id }) },
        { title: 'Floor plans', href: '#' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        description: string;
        image: File | null;
        total_area: string;
        bedrooms: string;
        bathrooms: string;
        balcony: string;
        lounge: string;
    }>({
        title: '',
        description: '',
        image: null,
        total_area: '',
        bedrooms: '',
        bathrooms: '',
        balcony: '',
        lounge: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('admin.projects.floor-plans.store', { project: project.id }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const move = (index: number, direction: -1 | 1) => {
        const ids = floorPlans.map((plan) => plan.id);
        const target = index + direction;

        if (target < 0 || target >= ids.length) {
            return;
        }

        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.patch(route('admin.projects.floor-plans.reorder', { project: project.id }), { ids }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={`Floor plans — ${project.title}`}
                    description="Add tabbed floor plans with dimensions and an image."
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
                        <CardTitle>Add floor plan</CardTitle>
                        <CardDescription>Upload an image and fill in the plan details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField label="Title" value={data.title} onChange={(value) => setData('title', value)} error={errors.title} required />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image</label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(event) => setData('image', event.target.files?.[0] ?? null)}
                                        className="text-muted-foreground file:bg-muted block w-full text-sm"
                                    />
                                    {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
                                </div>
                                <TextField label="Total area" value={data.total_area} onChange={(value) => setData('total_area', value)} error={errors.total_area} />
                                <TextField label="Bedrooms" value={data.bedrooms} onChange={(value) => setData('bedrooms', value)} error={errors.bedrooms} />
                                <TextField label="Bathrooms" value={data.bathrooms} onChange={(value) => setData('bathrooms', value)} error={errors.bathrooms} />
                                <TextField label="Balcony" value={data.balcony} onChange={(value) => setData('balcony', value)} error={errors.balcony} />
                                <TextField label="Lounge" value={data.lounge} onChange={(value) => setData('lounge', value)} error={errors.lounge} />
                            </div>
                            <TextAreaField label="Description" value={data.description} onChange={(value) => setData('description', value)} error={errors.description} rows={3} />

                            <Button type="submit" disabled={processing}>
                                {processing ? <Loader2 className="animate-spin" /> : <Upload />}
                                Add floor plan
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {floorPlans.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {floorPlans.map((plan, index) => (
                            <FloorPlanCard
                                key={plan.id}
                                plan={plan}
                                projectId={project.id}
                                isFirst={index === 0}
                                isLast={index === floorPlans.length - 1}
                                onMoveUp={() => move(index, -1)}
                                onMoveDown={() => move(index, 1)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground flex min-h-40 items-center justify-center rounded-xl border p-8 text-sm">
                        No floor plans yet. Add your first plan above.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function FloorPlanCard({
    plan,
    projectId,
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
}: {
    plan: ProjectFloorPlanItem;
    projectId: number;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm<{
        title: string;
        description: string;
        image: File | null;
        total_area: string;
        bedrooms: string;
        bathrooms: string;
        balcony: string;
        lounge: string;
    }>({
        title: plan.title,
        description: plan.description ?? '',
        image: null,
        total_area: plan.total_area ?? '',
        bedrooms: plan.bedrooms ?? '',
        bathrooms: plan.bathrooms ?? '',
        balcony: plan.balcony ?? '',
        lounge: plan.lounge ?? '',
    });

    const [preview, setPreview] = useState<string | null>(null);

    const save = () => put(route('admin.projects.floor-plans.update', { project: projectId, floorPlan: plan.id }), { forceFormData: true, preserveScroll: true });

    return (
        <Card>
            <CardContent className="space-y-3 p-4">
                <div className="relative overflow-hidden rounded-md border">
                    <img src={preview ?? mediaUrl(plan.image_path) ?? ''} alt={plan.title} className="aspect-video w-full object-cover" />
                    <label className="bg-background/80 hover:bg-background absolute right-2 bottom-2 inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                        <ImagePlus className="size-3.5" />
                        Replace
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                setData('image', file);
                                setPreview(file ? URL.createObjectURL(file) : null);
                            }}
                        />
                    </label>
                </div>

                <TextField label="Title" value={data.title} onChange={(value) => setData('title', value)} error={errors.title} required />
                <TextAreaField label="Description" value={data.description} onChange={(value) => setData('description', value)} error={errors.description} rows={2} />

                <div className="grid grid-cols-2 gap-3">
                    <TextField label="Total area" value={data.total_area} onChange={(value) => setData('total_area', value)} error={errors.total_area} />
                    <TextField label="Bedrooms" value={data.bedrooms} onChange={(value) => setData('bedrooms', value)} error={errors.bedrooms} />
                    <TextField label="Bathrooms" value={data.bathrooms} onChange={(value) => setData('bathrooms', value)} error={errors.bathrooms} />
                    <TextField label="Balcony" value={data.balcony} onChange={(value) => setData('balcony', value)} error={errors.balcony} />
                    <TextField label="Lounge" value={data.lounge} onChange={(value) => setData('lounge', value)} error={errors.lounge} />
                </div>

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
                        variant="destructive"
                        onClick={() => {
                            if (window.confirm('Delete this floor plan?')) {
                                router.delete(route('admin.projects.floor-plans.destroy', { project: projectId, floorPlan: plan.id }), { preserveScroll: true });
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
