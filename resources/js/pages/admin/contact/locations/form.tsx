import { CheckboxField, Field, SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Compass, Loader2, Save } from 'lucide-react';
import { useState } from 'react';

type Props = { item?: Record<string, unknown> };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Locations', href: '/admin/contact/locations' },
];

export default function LocationForm({ item }: Props) {
    const isEdit = Boolean(item);
    const num = (key: string): number | null => {
        const v = item?.[key];
        return typeof v === 'number' ? v : v == null || v === '' ? null : Number(v);
    };

    const { data, setData, post, put, processing, errors } = useForm({
        name: typeof item?.name === 'string' ? item.name : '',
        address: typeof item?.address === 'string' ? item.address : '',
        city: typeof item?.city === 'string' ? item.city : '',
        state: typeof item?.state === 'string' ? item.state : '',
        country: typeof item?.country === 'string' ? item.country : '',
        postal_code: typeof item?.postal_code === 'string' ? item.postal_code : '',
        latitude: num('latitude'),
        longitude: num('longitude'),
        google_maps_url: typeof item?.google_maps_url === 'string' ? item.google_maps_url : '',
        place_id: typeof item?.place_id === 'string' ? item.place_id : '',
        phone: typeof item?.phone === 'string' ? item.phone : '',
        email: typeof item?.email === 'string' ? item.email : '',
        business_hours: typeof item?.business_hours === 'string'
            ? item.business_hours
            : Array.isArray(item?.business_hours)
                ? item.business_hours.join('\n')
                : '',
        is_primary: Boolean(item?.is_primary),
        is_active: Boolean(item?.is_active ?? true),
    });

    const [resolving, setResolving] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);

    const resolveAddress = () => {
        if (!data.address) {
            setLookupError('Enter the address first.');
            return;
        }
        setResolving(true);
        setLookupError(null);
        router.get(
            route('admin.contact.locations.lookup'),
            { address: data.address },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: (res) => {
                    const props = res.props as any;
                    if (props.locationLookup) {
                        const loc = props.locationLookup;
                        setData((prev) => ({
                            ...prev,
                            latitude: loc.latitude ?? prev.latitude,
                            longitude: loc.longitude ?? prev.longitude,
                            google_maps_url: loc.google_maps_url ?? prev.google_maps_url,
                            place_id: loc.place_id ?? prev.place_id,
                            city: loc.city ?? prev.city,
                            state: loc.state ?? prev.state,
                            country: loc.country ?? prev.country,
                            postal_code: loc.postal_code ?? prev.postal_code,
                        }));
                    }
                },
                onError: () => setLookupError('Could not resolve the address. Fill coordinates manually.'),
                onFinish: () => setResolving(false),
            },
        );
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.contact.locations.update', { location: item?.id as number }));
        } else {
            post(route('admin.contact.locations.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} location</h1>
                        <p className="mt-1 text-sm text-muted-foreground">An office or showroom shown on the page.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.contact.locations.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                            <CardDescription>Enter the address and optionally resolve coordinates via Google Maps.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <TextField label="Name" value={data.name} onChange={(value) => setData('name', value)} error={errors.name} required />
                            <TextField label="Address" value={data.address} onChange={(value) => setData('address', value)} error={errors.address} required />
                            <div className="flex items-center gap-3">
                                <Button type="button" variant="outline" disabled={resolving} onClick={resolveAddress}>
                                    <Compass className={resolving ? 'animate-spin' : ''} />
                                    {resolving ? 'Resolving…' : 'Resolve coordinates'}
                                </Button>
                                {lookupError && <span className="text-sm text-destructive">{lookupError}</span>}
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField label="City" value={data.city} onChange={(value) => setData('city', value)} error={errors.city} />
                                <TextField label="State" value={data.state} onChange={(value) => setData('state', value)} error={errors.state} />
                                <TextField label="Country" value={data.country} onChange={(value) => setData('country', value)} error={errors.country} />
                                <TextField label="Postal code" value={data.postal_code} onChange={(value) => setData('postal_code', value)} error={errors.postal_code} />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField label="Latitude" type="number" step="any" value={data.latitude?.toString() ?? ''} onChange={(value) => setData('latitude', value === '' ? null : Number(value))} error={errors.latitude} />
                                <TextField label="Longitude" type="number" step="any" value={data.longitude?.toString() ?? ''} onChange={(value) => setData('longitude', value === '' ? null : Number(value))} error={errors.longitude} />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField label="Google Maps URL" value={data.google_maps_url} onChange={(value) => setData('google_maps_url', value)} error={errors.google_maps_url} />
                                <TextField label="Place ID" value={data.place_id} onChange={(value) => setData('place_id', value)} error={errors.place_id} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact & hours</CardTitle>
                            <CardDescription>Optional contact details for this location.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Phone" value={data.phone} onChange={(value) => setData('phone', value)} error={errors.phone} />
                            <TextField label="Email" type="email" value={data.email} onChange={(value) => setData('email', value)} error={errors.email} />
                            <div className="sm:col-span-2">
                                <TextAreaField label="Business hours" value={data.business_hours} onChange={(value) => setData('business_hours', value)} error={errors.business_hours} hint="One line per day, e.g. Monday – Friday: 9am to 5pm." rows={4} />
                            </div>
                            <Field label="Primary location">
                                <CheckboxField label="Show as the main location" checked={data.is_primary} onChange={(value) => setData('is_primary', value)} />
                            </Field>
                            <Field label="Visibility">
                                <CheckboxField label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save location'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}