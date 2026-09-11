import { CheckboxField, Field, SelectField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, MessageCircle, Save } from 'lucide-react';

interface LiveChatEditProps {
    settings: Record<string, unknown>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Live Chat', href: '/admin/contact/live-chat' },
];

const providerOptions = [
    { value: 'custom', label: 'Custom' },
    { value: 'tawk', label: 'Tawk.to' },
    { value: 'crisp', label: 'Crisp' },
    { value: 'intercom', label: 'Intercom' },
    { value: 'other', label: 'Other' },
];

const positionOptions = [
    { value: 'bottom_right', label: 'Bottom right' },
    { value: 'bottom_left', label: 'Bottom left' },
    { value: 'top_right', label: 'Top right' },
    { value: 'top_left', label: 'Top left' },
];

export default function LiveChatEdit({ settings }: LiveChatEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        enabled: Boolean(settings.enabled),
        provider: typeof settings.provider === 'string' ? settings.provider : 'custom',
        script_url: typeof settings.script_url === 'string' ? settings.script_url : '',
        widget_id: typeof settings.widget_id === 'string' ? settings.widget_id : '',
        button_text: typeof settings.button_text === 'string' ? settings.button_text : '',
        position: typeof settings.position === 'string' ? settings.position : 'bottom_right',
        availability_text: typeof settings.availability_text === 'string' ? settings.availability_text : '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(route('admin.contact.live-chat.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <MessageCircle className="size-6" />
                            Live Chat
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">Configure the floating chat widget on the contact page.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.settings.edit'))}>
                        <ArrowLeft />
                        Back to settings
                    </Button>
                </div>

                <div className="max-w-3xl grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>Enable the widget and choose how it behaves.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <Field label="Status">
                                <CheckboxField label="Enable live chat widget" checked={data.enabled} onChange={(value) => setData('enabled', value)} />
                            </Field>
                            <SelectField label="Provider" value={data.provider} onChange={(value) => setData('provider', value)} options={providerOptions} error={errors.provider} required />
                            <div className="sm:col-span-2">
                                <TextField label="Script URL" value={data.script_url} onChange={(value) => setData('script_url', value)} error={errors.script_url} hint="Optional: URL of the chat provider script." />
                            </div>
                            <TextField label="Widget ID" value={data.widget_id} onChange={(value) => setData('widget_id', value)} error={errors.widget_id} hint="Identifier used by the provider." />
                            <SelectField label="Position" value={data.position} onChange={(value) => setData('position', value)} options={positionOptions} error={errors.position} />
                            <div className="sm:col-span-2">
                                <TextField label="Button text" value={data.button_text} onChange={(value) => setData('button_text', value)} error={errors.button_text} hint="Short label shown on the floating bubble." />
                            </div>
                            <div className="sm:col-span-2">
                                <TextField label="Availability text" value={data.availability_text} onChange={(value) => setData('availability_text', value)} error={errors.availability_text} hint="e.g. 'We reply within minutes'." />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save settings'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}