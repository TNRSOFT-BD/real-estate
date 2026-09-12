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
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Page Settings', href: '/admin/contact/settings' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function bool(value: unknown): boolean {
    return Boolean(value);
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
                    <img src={currentSrc} alt="" className="mt-1 h-24 w-full max-w-xs border object-cover" />
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export default function SettingsEdit({ settings, flash }: SettingsPageProps) {
    const { data, setData, post, processing, errors, progress, transform } = useForm<SettingsForm>({
        hero_badge: str(settings.hero_badge),
        hero_title: str(settings.hero_title),
        hero_highlight: str(settings.hero_highlight),
        hero_description: str(settings.hero_description),
        hero_primary_button_text: str(settings.hero_primary_button_text),
        hero_primary_button_link: str(settings.hero_primary_button_link),
        hero_secondary_button_text: str(settings.hero_secondary_button_text),
        hero_secondary_button_link: str(settings.hero_secondary_button_link),
        hero_background_image: null,
        form_title: str(settings.form_title),
        form_description: str(settings.form_description),
        form_success_message: str(settings.form_success_message),
        faq_badge: str(settings.faq_badge),
        faq_title: str(settings.faq_title),
        faq_description: str(settings.faq_description),
        team_badge: str(settings.team_badge),
        team_title: str(settings.team_title),
        team_description: str(settings.team_description),
        location_badge: str(settings.location_badge),
        location_title: str(settings.location_title),
        location_description: str(settings.location_description),
        live_chat_title: str(settings.live_chat_title),
        live_chat_description: str(settings.live_chat_description),
        closing_badge: str(settings.closing_badge),
        closing_title: str(settings.closing_title),
        closing_description: str(settings.closing_description),
        seo_title: str(settings.seo_title),
        seo_description: str(settings.seo_description),
        seo_keywords: str(settings.seo_keywords),
        canonical_url: str(settings.canonical_url),
        og_title: str(settings.og_title),
        og_description: str(settings.og_description),
        og_image: null,
        twitter_card: str(settings.twitter_card),
        is_active: bool(settings.is_active),
    });

    const setStr = (key: string) => (value: string) => setData(key, value);
    const setFile = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData(key, file);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => {
            const clean: SettingsForm = { ...formData, _method: 'put' as string };
            if (!(clean.hero_background_image instanceof File)) delete clean.hero_background_image;
            if (!(clean.og_image instanceof File)) delete clean.og_image;
            return clean;
        });
        post(route('admin.contact.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader title="Contact Page Settings" description="Configure the public contact page content and SEO." flash={flash} />

                <div className="grid gap-6">
                    <Section title="Hero" description="The top section visitors see first.">
                        <TextField label="Badge" value={str(data.hero_badge)} onChange={setStr('hero_badge')} error={errors.hero_badge} />
                        <TextField label="Title" value={str(data.hero_title)} onChange={setStr('hero_title')} error={errors.hero_title} />
                        <TextField
                            label="Highlight"
                            value={str(data.hero_highlight)}
                            onChange={setStr('hero_highlight')}
                            error={errors.hero_highlight}
                            hint="Accented part of the title."
                        />
                        <TextField
                            label="Background image"
                            value={str(settings.hero_background_image)}
                            onChange={() => {}}
                            disabled
                            hint="Kept until you upload a replacement."
                        />
                        <ImageUploadField
                            label="Replace background image"
                            currentSrc={mediaUrl(str(settings.hero_background_image))}
                            file={data.hero_background_image instanceof File ? data.hero_background_image : null}
                            error={errors.hero_background_image}
                            onChange={setFile('hero_background_image')}
                        />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Description"
                                value={str(data.hero_description)}
                                onChange={setStr('hero_description')}
                                error={errors.hero_description}
                            />
                        </div>
                        <TextField
                            label="Primary button text"
                            value={str(data.hero_primary_button_text)}
                            onChange={setStr('hero_primary_button_text')}
                            error={errors.hero_primary_button_text}
                        />
                        <TextField
                            label="Primary button link"
                            value={str(data.hero_primary_button_link)}
                            onChange={setStr('hero_primary_button_link')}
                            error={errors.hero_primary_button_link}
                            hint="URL, /path, #anchor, tel: or mailto:. Defaults to the contact form."
                        />
                        <TextField
                            label="Secondary button text"
                            value={str(data.hero_secondary_button_text)}
                            onChange={setStr('hero_secondary_button_text')}
                            error={errors.hero_secondary_button_text}
                        />
                        <TextField
                            label="Secondary button link"
                            value={str(data.hero_secondary_button_link)}
                            onChange={setStr('hero_secondary_button_link')}
                            error={errors.hero_secondary_button_link}
                            hint="URL, /path, #anchor, tel: or mailto:."
                        />
                    </Section>

                    <Section title="Contact form" description="Headings shown beside the contact form.">
                        <TextField label="Form title" value={str(data.form_title)} onChange={setStr('form_title')} error={errors.form_title} />
                        <TextField
                            label="Success message"
                            value={str(data.form_success_message)}
                            onChange={setStr('form_success_message')}
                            error={errors.form_success_message}
                        />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Form description"
                                value={str(data.form_description)}
                                onChange={setStr('form_description')}
                                error={errors.form_description}
                            />
                        </div>
                    </Section>

                    <Section title="FAQ section" description="Settings for the frequently asked questions section.">
                        <TextField label="Badge" value={str(data.faq_badge)} onChange={setStr('faq_badge')} error={errors.faq_badge} />
                        <TextField label="Title" value={str(data.faq_title)} onChange={setStr('faq_title')} error={errors.faq_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Description"
                                value={str(data.faq_description)}
                                onChange={setStr('faq_description')}
                                error={errors.faq_description}
                            />
                        </div>
                    </Section>

                    <Section title="Team section" description="Settings for the team members section.">
                        <TextField label="Badge" value={str(data.team_badge)} onChange={setStr('team_badge')} error={errors.team_badge} />
                        <TextField label="Title" value={str(data.team_title)} onChange={setStr('team_title')} error={errors.team_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Description"
                                value={str(data.team_description)}
                                onChange={setStr('team_description')}
                                error={errors.team_description}
                            />
                        </div>
                    </Section>

                    <Section title="Location section" description="Settings for the offices section.">
                        <TextField label="Badge" value={str(data.location_badge)} onChange={setStr('location_badge')} error={errors.location_badge} />
                        <TextField label="Title" value={str(data.location_title)} onChange={setStr('location_title')} error={errors.location_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Description"
                                value={str(data.location_description)}
                                onChange={setStr('location_description')}
                                error={errors.location_description}
                            />
                        </div>
                    </Section>

                    <Section title="Live chat" description="Headings shown in the chat widget.">
                        <TextField
                            label="Live chat title"
                            value={str(data.live_chat_title)}
                            onChange={setStr('live_chat_title')}
                            error={errors.live_chat_title}
                        />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Live chat description"
                                value={str(data.live_chat_description)}
                                onChange={setStr('live_chat_description')}
                                error={errors.live_chat_description}
                            />
                        </div>
                    </Section>

                    <Section title="Closing section" description="The final call-to-action before the footer.">
                        <TextField label="Badge" value={str(data.closing_badge)} onChange={setStr('closing_badge')} error={errors.closing_badge} />
                        <TextField label="Title" value={str(data.closing_title)} onChange={setStr('closing_title')} error={errors.closing_title} />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Description"
                                value={str(data.closing_description)}
                                onChange={setStr('closing_description')}
                                error={errors.closing_description}
                            />
                        </div>
                    </Section>

                    <Section title="SEO" description="Search engine and social sharing metadata.">
                        <TextField label="SEO title" value={str(data.seo_title)} onChange={setStr('seo_title')} error={errors.seo_title} />
                        <TextField
                            label="SEO keywords"
                            value={str(data.seo_keywords)}
                            onChange={setStr('seo_keywords')}
                            error={errors.seo_keywords}
                        />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="SEO description"
                                value={str(data.seo_description)}
                                onChange={setStr('seo_description')}
                                error={errors.seo_description}
                            />
                        </div>
                        <TextField
                            label="Canonical URL"
                            value={str(data.canonical_url)}
                            onChange={setStr('canonical_url')}
                            error={errors.canonical_url}
                        />
                        <TextField
                            label="Twitter card"
                            value={str(data.twitter_card)}
                            onChange={setStr('twitter_card')}
                            error={errors.twitter_card}
                        />
                        <TextField label="Open Graph title" value={str(data.og_title)} onChange={setStr('og_title')} error={errors.og_title} />
                        <TextField
                            label="Open Graph image"
                            value={str(settings.og_image)}
                            onChange={() => {}}
                            disabled
                            hint="Kept until you upload a replacement."
                        />
                        <ImageUploadField
                            label="Replace Open Graph image"
                            currentSrc={mediaUrl(str(settings.og_image))}
                            file={data.og_image instanceof File ? data.og_image : null}
                            error={errors.og_image}
                            onChange={setFile('og_image')}
                        />
                        <div className="sm:col-span-2">
                            <TextAreaField
                                label="Open Graph description"
                                value={str(data.og_description)}
                                onChange={setStr('og_description')}
                                error={errors.og_description}
                            />
                        </div>
                    </Section>

                    <Card>
                        <CardContent className="pt-6">
                            <CheckboxField
                                label="Page is active"
                                checked={Boolean(data.is_active)}
                                onChange={(value) => setData('is_active', value)}
                                hint="When disabled, the public contact page hides."
                            />
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
