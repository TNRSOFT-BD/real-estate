import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { Field } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SiteAppearanceProps, type ThemeMode } from '@/types/site';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Site', href: '/admin/site/appearance' },
    { title: 'Appearance', href: '/admin/site/appearance' },
];

function luminance(hex: string): number {
    let value = hex.replace('#', '').trim();

    if (value.length === 3) {
        value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    }

    if (value.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(value)) {
        return 1;
    }

    const r = parseInt(value.slice(0, 2), 16) / 255;
    const g = parseInt(value.slice(2, 4), 16) / 255;
    const b = parseInt(value.slice(4, 6), 16) / 255;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function resolveMode(hex: string, mode: ThemeMode): 'light' | 'dark' {
    if (mode === 'light' || mode === 'dark') {
        return mode;
    }

    return luminance(hex) < 0.5 ? 'dark' : 'light';
}

export default function AppearanceEdit({ settings, flash }: SiteAppearanceProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        background_color: settings.background_color ?? '#F4F2ED',
        theme_mode: (settings.theme_mode ?? 'auto') as ThemeMode,
    });

    const mode = resolveMode(data.background_color, data.theme_mode);
    const ink = mode === 'dark' ? '#F5F3EF' : '#1A1815';
    const inkSoft = mode === 'dark' ? 'rgba(245,243,239,0.62)' : 'rgba(26,24,21,0.6)';
    const glass = mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)';
    const glassBorder = mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.65)';

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(route('admin.site.appearance.update'), { preserveScroll: true });
    };

    const modes: Array<{ value: ThemeMode; label: string; hint: string }> = [
        { value: 'auto', label: 'Auto', hint: 'Derive from the background colour.' },
        { value: 'light', label: 'Light', hint: 'Always use dark text.' },
        { value: 'dark', label: 'Dark', hint: 'Always use light text.' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Site Appearance"
                    description="Control the public site background colour and text mode."
                    flash={flash}
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Background</CardTitle>
                            <CardDescription>The base colour behind every public page.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Field
                                label="Background colour"
                                error={errors.background_color}
                                hint="Pick a colour or paste a hex value. Glass panels adapt automatically."
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={/^#[0-9a-fA-F]{6}$/.test(data.background_color) ? data.background_color : '#F4F2ED'}
                                        onChange={(event) => setData('background_color', event.target.value.toUpperCase())}
                                        aria-label="Background colour picker"
                                        className="border-input bg-background h-10 w-14 cursor-pointer rounded-md border p-1"
                                    />
                                    <Input
                                        value={data.background_color}
                                        onChange={(event) => setData('background_color', event.target.value)}
                                        className="font-mono uppercase"
                                        aria-invalid={Boolean(errors.background_color)}
                                    />
                                </div>
                            </Field>

                            <Field label="Text mode" error={errors.theme_mode} hint="Choose how text and glass contrast is resolved.">
                                <div className="grid grid-cols-3 gap-2">
                                    {modes.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setData('theme_mode', option.value)}
                                            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                data.theme_mode === option.value
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-input hover:bg-accent'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>How a glass panel looks on the selected background.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border p-6" style={{ backgroundColor: data.background_color }}>
                                <div
                                    className="rounded-xl border p-5 shadow-sm backdrop-blur-xl"
                                    style={{ backgroundColor: glass, borderColor: glassBorder }}
                                >
                                    <p className="text-[11px] font-medium tracking-[0.24em] uppercase" style={{ color: inkSoft }}>
                                        About us
                                    </p>
                                    <p className="mt-3 text-2xl font-medium tracking-tight" style={{ color: ink }}>
                                        Building places, shaping better futures.
                                    </p>
                                    <p className="mt-2 text-sm" style={{ color: inkSoft }}>
                                        A quick sample of body text over the selected colour.
                                    </p>
                                    <span
                                        className="mt-5 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
                                        style={{ backgroundColor: ink, color: data.background_color }}
                                    >
                                        Contact our team
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    {recentlySuccessful && <p className="text-muted-foreground text-sm">Saved.</p>}
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save appearance'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
