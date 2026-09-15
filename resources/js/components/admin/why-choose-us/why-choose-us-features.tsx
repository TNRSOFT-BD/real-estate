import { SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { whyChooseUsIconMap, whyChooseUsIconOptions } from '@/lib/why-choose-us-icons';
import { type WhyChooseUsFeatureItem } from '@/types/why-choose-us';
import { router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react';

const iconOptions = [{ value: '', label: 'No icon' }, ...whyChooseUsIconOptions];

function IconSelect({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
    const Icon = value ? whyChooseUsIconMap[value] : undefined;

    return (
        <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
                <SelectField label="Icon" value={value} onChange={onChange} options={iconOptions} error={error} />
            </div>
            {Icon && (
                <span className="mt-5 inline-flex size-9 shrink-0 items-center justify-center rounded-md border" aria-hidden>
                    <Icon className="size-4" />
                </span>
            )}
        </div>
    );
}

export default function WhyChooseUsFeatures({ features }: { features: WhyChooseUsFeatureItem[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        icon: '',
    });

    const add = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('admin.why-choose-us.features.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const move = (index: number, direction: -1 | 1) => {
        const ids = features.map((feature) => feature.id);
        const target = index + direction;

        if (target < 0 || target >= ids.length) {
            return;
        }

        [ids[index], ids[target]] = [ids[target], ids[index]];

        router.patch(route('admin.why-choose-us.features.reorder'), { ids }, { preserveScroll: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>The reasons shown in the horizontal slider on the homepage. Drag order with the arrows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={add} className="grid gap-3 rounded-lg border border-dashed p-3 sm:grid-cols-[1fr_1.5fr_1fr_auto] sm:items-end">
                    <TextField
                        label="Title"
                        value={data.title}
                        onChange={(value) => setData('title', value)}
                        error={errors.title}
                        placeholder="Prime Location"
                    />
                    <TextAreaField
                        label="Description"
                        value={data.description}
                        onChange={(value) => setData('description', value)}
                        error={errors.description}
                        rows={2}
                        placeholder="Close to schools, hospitals and key facilities."
                    />
                    <IconSelect value={data.icon} onChange={(value) => setData('icon', value)} error={errors.icon} />
                    <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Plus />}
                        Add
                    </Button>
                </form>

                {features.length > 0 ? (
                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <FeatureRow
                                key={feature.id}
                                feature={feature}
                                isFirst={index === 0}
                                isLast={index === features.length - 1}
                                onMoveUp={() => move(index, -1)}
                                onMoveDown={() => move(index, 1)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No features yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function FeatureRow({
    feature,
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
}: {
    feature: WhyChooseUsFeatureItem;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: feature.title,
        description: feature.description ?? '',
        icon: feature.icon ?? '',
    });

    const save = () => put(route('admin.why-choose-us.features.update', { feature: feature.id }), { preserveScroll: true });

    return (
        <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1.5fr_1fr_auto] sm:items-end">
            <TextField label="Title" value={data.title} onChange={(value) => setData('title', value)} error={errors.title} />
            <TextAreaField
                label="Description"
                value={data.description}
                onChange={(value) => setData('description', value)}
                error={errors.description}
                rows={2}
            />
            <IconSelect value={data.icon} onChange={(value) => setData('icon', value)} error={errors.icon} />

            <div className="flex items-center gap-1">
                <Button type="button" size="sm" onClick={save} disabled={processing}>
                    {processing ? <Loader2 className="size-4 animate-spin" /> : null}
                    Save
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={feature.is_active ? 'secondary' : 'outline'}
                    onClick={() => router.patch(route('admin.why-choose-us.features.toggle', { feature: feature.id }), {}, { preserveScroll: true })}
                    aria-label={feature.is_active ? 'Hide feature' : 'Show feature'}
                    title={feature.is_active ? 'Visible on the site' : 'Hidden from the site'}
                >
                    {feature.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
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
                        if (window.confirm('Delete this feature?')) {
                            router.delete(route('admin.why-choose-us.features.destroy', { feature: feature.id }), { preserveScroll: true });
                        }
                    }}
                    aria-label="Delete"
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}
