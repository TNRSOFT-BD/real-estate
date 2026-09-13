import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { type FlashAlert } from '@/types/contact-admin';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';

type ProfileForm = Record<string, string | File | null>;

interface CompanyProfileProps {
    profile: {
        name?: string | null;
        tagline?: string | null;
        logo?: string | null;
    };
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'About', href: '/admin/about/settings' },
    { title: 'Company', href: '/admin/about/company' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

export default function CompanyProfileEdit({ profile, flash }: CompanyProfileProps) {
    const { data, setData, post, processing, errors, progress, transform } = useForm<ProfileForm>({
        name: str(profile.name),
        tagline: str(profile.tagline),
        logo: null,
    });

    const currentLogo = mediaUrl(str(profile.logo));

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => {
            const clean: ProfileForm = { ...formData, _method: 'put' as string };
            if (!(clean.logo instanceof File)) delete clean.logo;
            return clean;
        });
        post(route('admin.about.company.update'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader title="Company Profile" description="The company name, tagline and logo shown across the public site." flash={flash} />

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identity</CardTitle>
                            <CardDescription>Used in the navbar, footer and admin panel.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <TextField
                                label="Company name"
                                value={str(data.name)}
                                onChange={(value) => setData('name', value)}
                                error={errors.name}
                                hint="Leave blank to fall back to the application name."
                            />

                            <TextAreaField
                                label="Tagline"
                                value={str(data.tagline)}
                                onChange={(value) => setData('tagline', value)}
                                error={errors.tagline}
                                rows={2}
                                hint="A short line shown beneath the brand in the footer."
                            />

                            <div>
                                <label className="text-sm font-medium">
                                    Logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => setData('logo', event.target.files?.[0] ?? null)}
                                        className="text-muted-foreground file:bg-muted mt-2 flex h-10 w-full cursor-pointer items-center text-sm file:mr-3 file:cursor-pointer file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                                    />
                                </label>

                                {data.logo instanceof File && <p className="text-muted-foreground mt-1 text-xs">New file: {data.logo.name}</p>}

                                {currentLogo && !(data.logo instanceof File) && (
                                    <div className="mt-3">
                                        <p className="text-muted-foreground text-xs">Current logo</p>
                                        <img src={currentLogo} alt="" className="mt-1 h-16 w-auto border object-contain p-1" />
                                    </div>
                                )}

                                {errors.logo && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.logo}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    {progress && <p className="text-muted-foreground text-sm">Uploading {Math.round(progress.percentage ?? 0)}%</p>}
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save profile'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
