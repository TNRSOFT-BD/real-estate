import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { Field, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import HeroImagesManager from '@/components/admin/site/hero-images-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type HeroVideoQuality, type HeroVideoSource, type SiteHomepageProps } from '@/types/site';
import { router, useForm } from '@inertiajs/react';
import { Loader2, Save, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage', href: '/admin/site/homepage' },
    { title: 'Hero Section', href: '/admin/site/homepage' },
];

const heroQualities: Array<{ value: HeroVideoQuality; label: string; hint: string }> = [
    { value: 'auto', label: 'Auto', hint: 'Let Cloudinary decide quality and size.' },
    { value: 'eco', label: 'Eco', hint: 'Smallest file — 1280px desktop / 720px mobile.' },
    { value: 'good', label: 'Good', hint: 'Balanced — 1920px desktop / 1280px mobile.' },
    { value: 'best', label: 'Best', hint: 'Sharpest — 2560px desktop / 1920px mobile.' },
];

const videoSources: Array<{ value: HeroVideoSource; label: string; hint: string }> = [
    { value: 'default', label: 'Default', hint: 'Use the built-in showcase video.' },
    { value: 'upload', label: 'Upload', hint: 'Upload MP4/WebM to Cloudinary.' },
    { value: 'url', label: 'Video URL', hint: 'Use a direct video link.' },
];

export default function HomepageEdit({ settings, flash }: SiteHomepageProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [ogUploading, setOgUploading] = useState(false);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const ogInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        hero_eyebrow: settings.hero_eyebrow ?? '',
        hero_title: settings.hero_title ?? '',
        hero_description: settings.hero_description ?? '',
        hero_video_quality: (settings.hero_video_quality ?? 'good') as HeroVideoQuality,
        hero_video_enabled: settings.hero_video_enabled ?? true,
        hero_video_source: (settings.hero_video_source ?? 'default') as HeroVideoSource,
        hero_video_link: settings.hero_video_link ?? '',
        seo_title: settings.seo_title ?? '',
        seo_description: settings.seo_description ?? '',
        seo_keywords: settings.seo_keywords ?? '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(route('admin.site.homepage.update'), { preserveScroll: true });
    };

    const uploadOgImage = (file: File) => {
        setOgUploading(true);

        router.post(
            route('admin.site.homepage.og-image.store'),
            { image: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => {
                    setOgUploading(false);
                    if (ogInputRef.current) {
                        ogInputRef.current.value = '';
                    }
                },
            },
        );
    };

    const removeOgImage = () => {
        router.delete(route('admin.site.homepage.og-image.destroy'), { preserveScroll: true });
    };

    const uploadVideo = async (file: File) => {
        setUploadError(null);
        setUploading(true);

        try {
            const signatureResponse = await fetch(route('admin.site.homepage.video.signature'), { headers: { Accept: 'application/json' } });

            if (!signatureResponse.ok) {
                throw new Error('Cloudinary is not configured.');
            }

            const signature = await signatureResponse.json();

            if (typeof signature.max_kb === 'number' && file.size > signature.max_kb * 1024) {
                throw new Error(`The video is larger than the ${Math.round(signature.max_kb / 1024)} MB limit.`);
            }

            const form = new FormData();
            form.append('file', file);
            form.append('api_key', signature.api_key);
            form.append('timestamp', String(signature.timestamp));
            form.append('folder', signature.folder);
            form.append('signature', signature.signature);

            const uploadResponse = await fetch(signature.upload_url, { method: 'POST', body: form });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed. The video may be too large or an unsupported format.');
            }

            const uploaded = await uploadResponse.json();

            router.post(
                route('admin.site.homepage.video.store'),
                { url: uploaded.secure_url, public_id: uploaded.public_id },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setData('hero_video_source', 'upload');
                        if (videoInputRef.current) {
                            videoInputRef.current.value = '';
                        }
                    },
                    onError: () => setUploadError('The uploaded video could not be saved.'),
                },
            );
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed.');
            setUploading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader title="Homepage" description="Manage the homepage hero content and background media." flash={flash} />

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero content</CardTitle>
                            <CardDescription>Text shown over the hero background. Leave a field blank to use the default copy.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <TextField
                                label="Eyebrow"
                                value={data.hero_eyebrow}
                                onChange={(value) => setData('hero_eyebrow', value)}
                                error={errors.hero_eyebrow}
                                placeholder="Excellence in Real Estate"
                            />
                            <TextField
                                label="Heading"
                                value={data.hero_title}
                                onChange={(value) => setData('hero_title', value)}
                                error={errors.hero_title}
                                placeholder="Crafting Iconic Landmarks & Luxury Living"
                            />
                            <TextAreaField
                                label="Description"
                                value={data.hero_description}
                                onChange={(value) => setData('hero_description', value)}
                                error={errors.hero_description}
                                rows={3}
                                placeholder="Discover bespoke architectural designs…"
                            />
                        </CardContent>
                    </Card>

                    <HeroImagesManager images={settings.hero_images ?? []} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Hero background video</CardTitle>
                            <CardDescription>Show a looping background video, or turn it off to show the image slideshow instead.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Field label="Background media" error={errors.hero_video_enabled} hint="Turning the video off shows the image slideshow.">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={data.hero_video_enabled}
                                    onClick={() => setData('hero_video_enabled', !data.hero_video_enabled)}
                                    className="border-input hover:bg-accent inline-flex items-center gap-3 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
                                >
                                    <span
                                        className={cn(
                                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                                            data.hero_video_enabled ? 'bg-primary' : 'bg-muted',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'inline-block size-4 transform rounded-full bg-white shadow transition-transform',
                                                data.hero_video_enabled ? 'translate-x-4' : 'translate-x-0.5',
                                            )}
                                        />
                                    </span>
                                    {data.hero_video_enabled ? 'Video on' : 'Video off — image slideshow'}
                                </button>
                            </Field>

                            <Field
                                label="Video source"
                                error={errors.hero_video_source}
                                hint={
                                    data.hero_video_enabled
                                        ? 'Choose one: the built-in video, an upload, or a link.'
                                        : 'Used only when the video is turned on.'
                                }
                            >
                                <div className={cn('grid gap-2 sm:grid-cols-3', !data.hero_video_enabled && 'opacity-50')}>
                                    {videoSources.map((option) => {
                                        const active = data.hero_video_source === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                disabled={!data.hero_video_enabled}
                                                onClick={() => setData('hero_video_source', option.value)}
                                                className={cn(
                                                    'rounded-md border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed',
                                                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-accent',
                                                )}
                                            >
                                                <span className="block text-sm font-medium">{option.label}</span>
                                                <span
                                                    className={cn(
                                                        'mt-0.5 block text-xs',
                                                        active ? 'text-primary-foreground/80' : 'text-muted-foreground',
                                                    )}
                                                >
                                                    {option.hint}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>

                            {data.hero_video_source === 'upload' && (
                                <Field
                                    label="Upload video"
                                    error={uploadError ?? undefined}
                                    hint="MP4, WebM or MOV. Large videos upload directly to Cloudinary. A new upload replaces and deletes the previous one."
                                >
                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/mp4,video/webm,video/quicktime"
                                        className="hidden"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];

                                            if (file) {
                                                void uploadVideo(file);
                                            }
                                        }}
                                    />

                                    <Button type="button" variant="outline" onClick={() => videoInputRef.current?.click()} disabled={uploading}>
                                        {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                                        {uploading ? 'Uploading…' : 'Choose video'}
                                    </Button>

                                    {!uploading &&
                                        (settings.hero_video_url ? (
                                            <video
                                                src={settings.hero_video_url}
                                                controls
                                                preload="metadata"
                                                className="mt-3 w-full max-w-sm rounded-md border"
                                            />
                                        ) : (
                                            <p className="text-muted-foreground mt-2 text-xs">No video uploaded yet.</p>
                                        ))}
                                </Field>
                            )}

                            {data.hero_video_source === 'url' && (
                                <TextField
                                    label="Video URL"
                                    value={data.hero_video_link}
                                    onChange={(value) => setData('hero_video_link', value)}
                                    error={errors.hero_video_link}
                                    placeholder="https://example.com/video.mp4"
                                    hint="A direct video file link (MP4/WebM)."
                                />
                            )}

                            <Field
                                label="Video quality"
                                error={errors.hero_video_quality}
                                hint={
                                    data.hero_video_source === 'url'
                                        ? 'Applies only to the built-in and uploaded videos.'
                                        : 'Applies to the homepage hero video.'
                                }
                            >
                                <div
                                    className={cn(
                                        'grid gap-2 sm:grid-cols-2',
                                        (!data.hero_video_enabled || data.hero_video_source === 'url') && 'opacity-50',
                                    )}
                                >
                                    {heroQualities.map((option) => {
                                        const active = data.hero_video_quality === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                disabled={!data.hero_video_enabled || data.hero_video_source === 'url'}
                                                onClick={() => setData('hero_video_quality', option.value)}
                                                className={cn(
                                                    'rounded-md border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed',
                                                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-accent',
                                                )}
                                            >
                                                <span className="block text-sm font-medium">{option.label}</span>
                                                <span
                                                    className={cn(
                                                        'mt-0.5 block text-xs',
                                                        active ? 'text-primary-foreground/80' : 'text-muted-foreground',
                                                    )}
                                                >
                                                    {option.hint}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO & sharing</CardTitle>
                            <CardDescription>
                                Search engine metadata and the image shown when the homepage is shared on social media. Leave the title blank to use
                                the default.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <TextField
                                label="SEO title"
                                value={data.seo_title}
                                onChange={(value) => setData('seo_title', value)}
                                error={errors.seo_title}
                                placeholder="Premium Real Estate Development"
                            />
                            <TextAreaField
                                label="Meta description"
                                value={data.seo_description}
                                onChange={(value) => setData('seo_description', value)}
                                error={errors.seo_description}
                                rows={3}
                                placeholder="Architectural excellence and modern living…"
                            />
                            <TextField
                                label="Meta keywords"
                                value={data.seo_keywords}
                                onChange={(value) => setData('seo_keywords', value)}
                                error={errors.seo_keywords}
                                placeholder="real estate, property development, luxury homes"
                            />

                            <Field label="Open Graph image" hint="Recommended 1200×630px. Falls back to the first hero image, then the company logo.">
                                <input
                                    ref={ogInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (file) {
                                            uploadOgImage(file);
                                        }
                                    }}
                                />

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button type="button" variant="outline" onClick={() => ogInputRef.current?.click()} disabled={ogUploading}>
                                        {ogUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                                        {ogUploading ? 'Uploading…' : 'Choose image'}
                                    </Button>

                                    {settings.og_image && (
                                        <Button type="button" variant="outline" onClick={removeOgImage}>
                                            <Trash2 />
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                {settings.og_image && (
                                    <img
                                        src={mediaUrl(settings.og_image) ?? undefined}
                                        alt="Open Graph preview"
                                        className="mt-3 w-full max-w-sm rounded-md border"
                                    />
                                )}
                            </Field>
                        </CardContent>
                    </Card>

                    <div className="bg-card sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                        {recentlySuccessful && <p className="text-muted-foreground text-sm">Saved.</p>}
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? <Loader2 className="animate-spin" /> : <Save />}
                            {processing ? 'Saving…' : 'Save homepage'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
