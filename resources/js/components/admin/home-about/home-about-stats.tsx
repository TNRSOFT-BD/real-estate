import { TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type HomeAboutStatItem } from '@/types/home-about';
import { router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from 'lucide-react';

export default function HomeAboutStats({ stats }: { stats: HomeAboutStatItem[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        figure: '',
        label: '',
    });

    const add = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('admin.home-about.stats.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const move = (index: number, direction: -1 | 1) => {
        const ids = stats.map((stat) => stat.id);
        const target = index + direction;

        if (target < 0 || target >= ids.length) {
            return;
        }

        [ids[index], ids[target]] = [ids[target], ids[index]];

        router.patch(route('admin.home-about.stats.reorder'), { ids }, { preserveScroll: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>The figures shown below the description (e.g. years, homes placed, rating).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                    <TextField
                        label="Figure"
                        value={data.figure}
                        onChange={(value) => setData('figure', value)}
                        error={errors.figure}
                        placeholder="18"
                    />
                    <TextField
                        label="Label"
                        value={data.label}
                        onChange={(value) => setData('label', value)}
                        error={errors.label}
                        placeholder="Years serving the city"
                    />
                    <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Plus />}
                        Add
                    </Button>
                </form>

                {stats.length > 0 ? (
                    <div className="space-y-3">
                        {stats.map((stat, index) => (
                            <StatRow
                                key={stat.id}
                                stat={stat}
                                isFirst={index === 0}
                                isLast={index === stats.length - 1}
                                onMoveUp={() => move(index, -1)}
                                onMoveDown={() => move(index, 1)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No statistics yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function StatRow({
    stat,
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
}: {
    stat: HomeAboutStatItem;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        figure: stat.figure,
        label: stat.label,
    });

    const save = () => put(route('admin.home-about.stats.update', { stat: stat.id }), { preserveScroll: true });

    return (
        <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
            <TextField label="Figure" value={data.figure} onChange={(value) => setData('figure', value)} error={errors.figure} />
            <TextField label="Label" value={data.label} onChange={(value) => setData('label', value)} error={errors.label} />

            <div className="flex items-center gap-1">
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
                        if (window.confirm('Delete this statistic?')) {
                            router.delete(route('admin.home-about.stats.destroy', { stat: stat.id }), { preserveScroll: true });
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
