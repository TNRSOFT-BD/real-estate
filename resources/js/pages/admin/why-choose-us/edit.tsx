import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import WhyChooseUsFeatures from '@/components/admin/why-choose-us/why-choose-us-features';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type WhyChooseUsAdminProps } from '@/types/why-choose-us';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage', href: '/admin/site/homepage' },
    { title: 'Why Choose Us', href: '/admin/why-choose-us' },
];

export default function WhyChooseUsEdit({ settings, features, flash }: WhyChooseUsAdminProps) {
    const { data, setData, put, processing, errors } = useForm({
        eyebrow: settings.eyebrow ?? '',
        title: settings.title ?? '',
        description: settings.description ?? '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('admin.why-choose-us.update'), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title="Why Choose Us section"
                    description="The reasons slider shown near the bottom of the homepage."
                    flash={flash}
                />

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>The section heading and supporting copy.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <TextField
                                label="Eyebrow"
                                value={data.eyebrow}
                                onChange={(value) => setData('eyebrow', value)}
                                error={errors.eyebrow}
                                placeholder="Why Choose Us"
                            />
                            <TextField
                                label="Title"
                                value={data.title}
                                onChange={(value) => setData('title', value)}
                                error={errors.title}
                                placeholder="Your Dream Home Our Commitment"
                            />
                            <TextAreaField
                                label="Description"
                                value={data.description}
                                onChange={(value) => setData('description', value)}
                                error={errors.description}
                                rows={3}
                                placeholder="We go beyond just selling properties…"
                            />
                        </CardContent>
                    </Card>

                    <div className="bg-card sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? <Loader2 className="animate-spin" /> : <Save />}
                            {processing ? 'Saving…' : 'Save section'}
                        </Button>
                    </div>
                </form>

                <WhyChooseUsFeatures features={features} />
            </div>
        </AppLayout>
    );
}
