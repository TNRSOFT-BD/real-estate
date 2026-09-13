import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { CheckboxField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { type FlashAlert } from '@/types/contact-admin';
import { useForm } from '@inertiajs/react';
import { FileUp, Loader2 } from 'lucide-react';

type SettingsForm = Record<string, string | boolean | File | null>;

interface SettingsPageProps {
    settings: Record<string, unknown>;
    flash?: FlashAlert;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'About', href: '/admin/about/settings' },
    { title: 'Page Settings', href: '/admin/about/settings' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">{children}</CardContent>
        </Card>
    );
}

function ImageUploadField({
    label,
    currentSrc,
    file,
    error,
    onChange,
}: {
    label: string;
    currentSrc: string | null;
    file: File | null;
    error?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="sm:col-span-2">
            <label className="text-sm font-medium">
                {label}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className="text-muted-foreground file:bg-muted mt-2 flex h-10 w-full cursor-pointer items-center text-sm file:mr-3 file:cursor-pointer file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                />
            </label>
            {file && <p className="text-muted-foreground mt-1 text-xs">New file: {file.name}</p>}
            {currentSrc && !file && (
                <div className="mt-3">
                    <p className="text-muted-foreground text-xs">Current image</p>
                    <img src={currentSrc} alt="" className="mt-1 h-24 w-auto border object-cover" />
                </div>
            )}
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export default function AboutSettingsEdit({ settings, flash }: SettingsPageProps) {
    const { data, setData, post, processing, errors, progress, transform } = useForm<SettingsForm>({
        hero_badge: str(settings.hero_badge),
        hero_title: str(settings.hero_title),
        hero_highlight: str(settings.hero_highlight),
        hero_description: str(settings.hero_description),
        hero_cta_text: str(settings.hero_cta_text),
        hero_cta_link: str(settings.hero_cta_link),
        hero_image: null,
        intro_badge: str(settings.intro_badge),
        intro_title: str(settings.intro_title),
        intro_description: str(settings.intro_description),
        intro_image: null,
        direction_badge: str(settings.direction_badge),
        values_badge: str(settings.values_badge),
        values_title: str(settings.values_title),
        journey_badge: str(settings.journey_badge),
        journey_title: str(settings.journey_title),
        why_badge: str(settings.why_badge),
        why_title: str(settings.why_title),
        team_badge: str(settings.team_badge),
        team_title: str(settings.team_title),
        team_description: str(settings.team_description),
        partners_title: str(settings.partners_title),
        closing_badge: str(settings.closing_badge),
        closing_title: str(settings.closing_title),
        closing_description: str(settings.closing_description),
        closing_button_text: str(settings.closing_button_text),
        closing_button_link: str(settings.closing_button_link),
        seo_title: str(settings.seo_title),
        seo_description: str(settings.seo_description),
        seo_keywords: str(settings.seo_keywords),
        canonical_url: str(settings.canonical_url),
        og_title: str(settings.og_title),
        og_description: str(settings.og_description),
        og_image: null,
        twitter_card: str(settings.twitter_card),
        is_active: Boolean(settings.is_active ?? true),
    });

    const setStr = (key: string) => (value: string) => setData(key, value);
    const setFile = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(key, event.target.files?.[0] ?? null);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => {
            const clean: SettingsForm = { ...formData, _method: 'put' as string };
            if (!(clean.hero_image instanceof File)) delete clean.hero_image;
            if (!(clean.intro_image instanceof File)) delete clean.intro_image;
            if (!(clean.og_image instanceof File)) delete clean.og_image;
            return clean;
        });
        post(route('admin.about.settings.update'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader title="About Page Settings" description="Hero, section headings and SEO for the public About page." flash={flash} />

                <div className="grid gap-6">
                    <Section title="Hero" description="The top section visitors see first.">
                        <TextField label="Badge" value={str(data.hero_badge)} onChange={setStr('hero_badge')} error={errors.hero_badge} />
                        <TextField label="Title" value={str(data.hero_title)} onChange={setStr('hero_title')} error={errors.hero_title} />
                        <TextField label="Highlight" value={str(data.hero_highlight)} onChange={setStr('hero_highlight')} error={errors.hero_highlight} />
                        <TextField label="CTA text" value={str(data.hero_cta_text)} onChange={setStr('hero_cta_text')} error={errors.hero_cta_text} />
                        <TextField label="CTA link" value={str(data.hero_cta_link)} onChange={setStr('hero_cta_link')} error={errors.hero_cta_link} hint="URL, /path or #anchor." />
                        <div className="sm:col-span-2">
                            <TextAreaField label="Description" value={str(data.hero_description)} onChange={setStr('hero_description')} error={errors.hero_description} />
                        </div>
                        <ImageUploadField label="Replace hero image" currentSrc={mediaUrl(str(settings.hero_image))} file={data.hero_image instanceof File ? data.hero_image : null} error={errors.hero_image} onChange={setFile('hero_image')} />
                    </Section>

                    <Section title="Introduction" description="The 'Who we are' block.">
                        <TextField label="Badge" value={str(data.intro_badge)} onChange={setStr('intro_badge')} error={errors.intro_badge} />
                        <TextField label="Title" value={str(data.intro_title)} onChange={setStr('intro_title')} error={errors.intro_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField label="Description" value={str(data.intro_description)} onChange={setStr('intro_description')} error={errors.intro_description} />
                        </div>
                        <ImageUploadField label="Replace intro image" currentSrc={mediaUrl(str(settings.intro_image))} file={data.intro_image instanceof File ? data.intro_image : null} error={errors.intro_image} onChange={setFile('intro_image')} />
                    </Section>

                    <Section title="Section headings" description="Titles shown above each repeatable section.">
                        <TextField label="Direction badge" value={str(data.direction_badge)} onChange={setStr('direction_badge')} error={errors.direction_badge} />
                        <TextField label="Values badge" value={str(data.values_badge)} onChange={setStr('values_badge')} error={errors.values_badge} />
                        <TextField label="Values title" value={str(data.values_title)} onChange={setStr('values_title')} error={errors.values_title} />
                        <TextField label="Journey badge" value={str(data.journey_badge)} onChange={setStr('journey_badge')} error={errors.journey_badge} />
                        <TextField label="Journey title" value={str(data.journey_title)} onChange={setStr('journey_title')} error={errors.journey_title} />
                        <TextField label="Why us badge" value={str(data.why_badge)} onChange={setStr('why_badge')} error={errors.why_badge} />
                        <TextField label="Why us title" value={str(data.why_title)} onChange={setStr('why_title')} error={errors.why_title} />
                        <TextField label="Partners title" value={str(data.partners_title)} onChange={setStr('partners_title')} error={errors.partners_title} />
                        <TextField label="Team badge" value={str(data.team_badge)} onChange={setStr('team_badge')} error={errors.team_badge} />
                        <TextField label="Team title" value={str(data.team_title)} onChange={setStr('team_title')} error={errors.team_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField label="Team description" value={str(data.team_description)} onChange={setStr('team_description')} error={errors.team_description} />
                        </div>
                    </Section>

                    <Section title="Closing" description="The final call-to-action.">
                        <TextField label="Badge" value={str(data.closing_badge)} onChange={setStr('closing_badge')} error={errors.closing_badge} />
                        <TextField label="Title" value={str(data.closing_title)} onChange={setStr('closing_title')} error={errors.closing_title} />
                        <TextField label="Button text" value={str(data.closing_button_text)} onChange={setStr('closing_button_text')} error={errors.closing_button_text} />
                        <TextField label="Button link" value={str(data.closing_button_link)} onChange={setStr('closing_button_link')} error={errors.closing_button_link} />
                        <div className="sm:col-span-2">
                            <TextAreaField label="Description" value={str(data.closing_description)} onChange={setStr('closing_description')} error={errors.closing_description} />
                        </div>
                    </Section>

                    <Section title="SEO" description="Search engine and social sharing metadata.">
                        <TextField label="SEO title" value={str(data.seo_title)} onChange={setStr('seo_title')} error={errors.seo_title} />
                        <TextField label="SEO keywords" value={str(data.seo_keywords)} onChange={setStr('seo_keywords')} error={errors.seo_keywords} />
                        <div className="sm:col-span-2">
                            <TextAreaField label="SEO description" value={str(data.seo_description)} onChange={setStr('seo_description')} error={errors.seo_description} />
                        </div>
                        <TextField label="Canonical URL" value={str(data.canonical_url)} onChange={setStr('canonical_url')} error={errors.canonical_url} />
                        <TextField label="Twitter card" value={str(data.twitter_card)} onChange={setStr('twitter_card')} error={errors.twitter_card} />
                        <TextField label="Open Graph title" value={str(data.og_title)} onChange={setStr('og_title')} error={errors.og_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField label="Open Graph description" value={str(data.og_description)} onChange={setStr('og_description')} error={errors.og_description} />
                        </div>
                        <ImageUploadField label="Replace Open Graph image" currentSrc={mediaUrl(str(settings.og_image))} file={data.og_image instanceof File ? data.og_image : null} error={errors.og_image} onChange={setFile('og_image')} />
                    </Section>

                    <Card>
                        <CardContent className="pt-6">
                            <CheckboxField label="Page is active" checked={Boolean(data.is_active)} onChange={(value) => setData('is_active', value)} hint="When disabled, the public About page hides." />
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    {progress && <p className="text-muted-foreground text-sm">Uploading {Math.round(progress.percentage ?? 0)}%</p>}
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <FileUp />}
                        {processing ? 'Saving…' : 'Save settings'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
