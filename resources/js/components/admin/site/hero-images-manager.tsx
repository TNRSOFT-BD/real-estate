import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mediaUrl } from '@/lib/media';
import { router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface HeroImagesManagerProps {
    images: string[];
}

export default function HeroImagesManager({ images }: HeroImagesManagerProps) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append('images[]', file));

        setUploading(true);
        router.post(route('admin.site.homepage.images.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            },
        });
    };

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;

        if (target < 0 || target >= images.length) {
            return;
        }

        const next = [...images];
        [next[index], next[target]] = [next[target], next[index]];

        router.patch(route('admin.site.homepage.images.reorder'), { images: next }, { preserveScroll: true });
    };

    const remove = (path: string) => {
        if (!window.confirm('Delete this image? It will be removed from the server permanently.')) {
            return;
        }

        router.delete(route('admin.site.homepage.images.destroy'), { data: { path }, preserveScroll: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Static images</CardTitle>
                <CardDescription>Shown as an automatic slideshow when the video is off. They change every 5 seconds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <input ref={inputRef} type="file" multiple accept="image/png,image/jpeg,image/webp" className="hidden" onChange={upload} />
                <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
                    Add images
                </Button>

                {errors.images && <p className="text-destructive text-sm">{errors.images}</p>}

                {images.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {images.map((path, index) => (
                            <div key={path} className="rounded-md border p-2">
                                <div className="relative overflow-hidden rounded">
                                    <img src={mediaUrl(path) ?? ''} alt="" className="aspect-video w-full object-cover" />
                                    <span className="bg-background/85 absolute top-1 left-1 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums">
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-1">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => move(index, -1)}
                                        disabled={index === 0}
                                        aria-label="Move image up"
                                    >
                                        <ArrowUp className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => move(index, 1)}
                                        disabled={index === images.length - 1}
                                        aria-label="Move image down"
                                    >
                                        <ArrowDown className="size-4" />
                                    </Button>
                                    <Button type="button" size="sm" variant="destructive" onClick={() => remove(path)} aria-label="Delete image">
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">
                        No images yet. If the video is off and no images are added, the video poster frame is shown.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
