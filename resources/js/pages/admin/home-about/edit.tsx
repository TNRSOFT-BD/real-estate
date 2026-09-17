import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { TextField } from '@/components/admin/contact/form-fields';
import HomeAboutStats from '@/components/admin/home-about/home-about-stats';
import RichTextEditor from '@/components/admin/legal/rich-text-editor';
import ImageUploadField from '@/components/admin/project/image-upload-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type HomeAboutAdminProps } from '@/types/home-about';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage', href: '/admin/site/homepage' },
    { title: 'About Section', href: '/admin/home-about' },
];

export default function HomeAboutEdit({ settings, stats, flash }: HomeAboutAdminProps) {
    const { data, setData, post, processing, errors, transform, recentlySuccessful } = useForm<{
        heading: string;
        description: string;
        badge_figure: string;
        badge_copy: string;
        main_image: File | null;
        main_image_alt: string;
        remove_main_image: boolean;
        accent_image: File | null;
        accent_image_alt: string;
        remove_accent_image: boolean;
    }>({
        heading: settings.heading ?? '',
        description: settings.description ?? '',
        badge_figure: settings.badge_figure ?? '',
        badge_copy: settings.badge_copy ?? '',
        main_image: null,
        main_image_alt: settings.main_image_alt ?? '',
        remove_main_image: false,
        accent_image: null,
        accent_image_alt: settings.accent_image_alt ?? '',
        remove_accent_image: false,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        transform((formData) => {
            const clean: Record<string, unknown> = { ...formData, _method: 'put' };

            if (!(clean.main_image instanceof File)) {
                delete clean.main_image;
            }

            if (!(clean.accent_image instanceof File)) {
                delete clean.accent_image;
            }

            return clean;
        });

        post(route('admin.home-about.update'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader title="Homepage about section" description="The 'About Us' block shown on the homepage." flash={flash} />

                <form onSubmit={submit} encType="multipart/form-data" className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>Heading, description and badge copy.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <TextField
                                label="Heading"
                                value={data.heading}
                                onChange={(value) => setData('heading', value)}
                                error={errors.heading}
                                placeholder="We know every block because we've walked it."
                            />

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(html) => setData('description', html)}
                                    error={Boolean(errors.description)}
                                    placeholder="Write the about section description…"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField
                                    label="Badge figure"
                                    value={data.badge_figure}
                                    onChange={(value) => setData('badge_figure', value)}
                                    error={errors.badge_figure}
                                    placeholder="98%"
                                />
                                <TextField
                                    label="Badge copy"
                                    value={data.badge_copy}
                                    onChange={(value) => setData('badge_copy', value)}
                                    error={errors.badge_copy}
                                    placeholder="of clients refer us to someone they trust"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>
                                A large main image and a smaller accent image. Uploading a new image replaces the previous one.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <ImageUploadField
                                    label="Main image"
                                    currentSrc={settings.main_image}
                                    file={data.main_image}
                                    error={errors.main_image}
                                    removeFlag={data.remove_main_image}
                                    onToggleRemove={() => setData('remove_main_image', !data.remove_main_image)}
                                    onChange={(file) => {
                                        setData('main_image', file);
                                        if (file) {
                                            setData('remove_main_image', false);
                                        }
                                    }}
                                />
                                <TextField
                                    label="Main image alt text"
                                    value={data.main_image_alt}
                                    onChange={(value) => setData('main_image_alt', value)}
                                    error={errors.main_image_alt}
                                />
                            </div>

                            <div className="space-y-4">
                                <ImageUploadField
                                    label="Accent image"
                                    currentSrc={settings.accent_image}
                                    file={data.accent_image}
                                    error={errors.accent_image}
                                    removeFlag={data.remove_accent_image}
                                    onToggleRemove={() => setData('remove_accent_image', !data.remove_accent_image)}
                                    onChange={(file) => {
                                        setData('accent_image', file);
                                        if (file) {
                                            setData('remove_accent_image', false);
                                        }
                                    }}
                                />
                                <TextField
                                    label="Accent image alt text"
                                    value={data.accent_image_alt}
                                    onChange={(value) => setData('accent_image_alt', value)}
                                    error={errors.accent_image_alt}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-card sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                        {recentlySuccessful && <p className="text-muted-foreground text-sm">Saved.</p>}
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? <Loader2 className="animate-spin" /> : <Save />}
                            {processing ? 'Saving…' : 'Save about section'}
                        </Button>
                    </div>
                </form>

                <HomeAboutStats stats={stats} />
            </div>
        </AppLayout>
    );
}
