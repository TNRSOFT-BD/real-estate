import { CheckboxField, Field, SelectField, TextAreaField, TextField } from '@/components/admin/contact/form-fields';
import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import FileUploadField from '@/components/admin/project/file-upload-field';
import ImageUploadField from '@/components/admin/project/image-upload-field';
import KeyValueRepeater from '@/components/admin/project/key-value-repeater';
import AmenityRepeater from '@/components/admin/project/amenity-repeater';
import RichTextEditor from '@/components/admin/legal/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type AdminProjectItem, type AmenityItem, type CurrencyConfig, type MediaLimits, type ProjectFeature, type SelectOption } from '@/types/project-admin';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Wallet } from 'lucide-react';

interface ProjectFormProps {
    project?: AdminProjectItem;
    types: SelectOption[];
    statuses: SelectOption[];
    currency: CurrencyConfig;
    mediaLimits: MediaLimits;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/admin/projects' },
];

function str(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
}

export default function ProjectForm({ project, types, statuses, currency, mediaLimits }: ProjectFormProps) {
    const isEdit = Boolean(project);
    const { flash } = usePage<SharedData>().props;

    const formatMaxSize = (kb: number): string => (kb >= 1024 ? `${(kb / 1024).toFixed(kb % 1024 === 0 ? 0 : 1)} MB` : `${kb} KB`);
    const imageHint = `${mediaLimits.imageMimes.map((mime) => mime.toUpperCase()).join(', ')} · up to ${formatMaxSize(mediaLimits.imageMaxKb)}`;
    const documentHint = `${mediaLimits.documentMimes.map((mime) => mime.toUpperCase()).join(', ')} · up to ${formatMaxSize(mediaLimits.documentMaxKb)}`;

    const { data, setData, post, processing, errors, transform } = useForm({
        title: str(project?.title),
        slug: str(project?.slug),
        project_code: str(project?.project_code),
        project_type_id: str(project?.project_type_id) || types[0]?.value || '',
        project_status_id: str(project?.project_status_id) || statuses[0]?.value || '',
        short_description: str(project?.short_description),
        overview: str(project?.overview),
        is_published: project?.is_published ?? false,
        is_featured: project?.is_featured ?? false,
        sort_order: project?.sort_order ?? 0,

        location_address: str(project?.location_address),
        location_area: str(project?.location_area),
        location_city: str(project?.location_city),
        location_country: str(project?.location_country),
        google_map_url: str(project?.google_map_url),
        latitude: str(project?.latitude),
        longitude: str(project?.longitude),

        total_land_area: str(project?.total_land_area),
        total_units: project?.total_units != null ? String(project.total_units) : '',
        number_of_floors: project?.number_of_floors != null ? String(project.number_of_floors) : '',
        number_of_buildings: project?.number_of_buildings != null ? String(project.number_of_buildings) : '',
        units_per_floor: project?.units_per_floor != null ? String(project.units_per_floor) : '',
        handover_date: project?.handover_date ? project.handover_date.substring(0, 10) : '',

        property_features: (project?.property_features ?? []) as ProjectFeature[],
        amenities: ((project?.amenities ?? []) as (AmenityItem | string)[]).map((item) =>
            typeof item === 'string' ? { name: item, icon: '' } : { name: item.name, icon: item.icon ?? '' },
        ) as AmenityItem[],

        hero_banner: null as File | null,
        hero_banner_alt: str(project?.hero_banner_alt),
        remove_hero_banner: false as boolean,
        brochure_pdf: null as File | null,
        remove_brochure_pdf: false as boolean,
        promo_video_url: str(project?.promo_video_url),

        legal_approval_no: str(project?.legal_approval_no),
        legal_approval_document: null as File | null,
        remove_legal_approval_document: false as boolean,

        developer_name: str(project?.developer_name),
        developer_website: str(project?.developer_website),

        meta_title: str(project?.meta_title),
        meta_description: str(project?.meta_description),
        meta_keywords: str(project?.meta_keywords),
        canonical_url: str(project?.canonical_url),
        robots: str(project?.robots),
        og_title: str(project?.og_title),
        og_description: str(project?.og_description),
        og_image: null as File | null,
        remove_og_image: false as boolean,
        twitter_card: str(project?.twitter_card),
        twitter_title: str(project?.twitter_title),
        twitter_description: str(project?.twitter_description),
        twitter_image: null as File | null,
        remove_twitter_image: false as boolean,
    });

    transform((payload) => ({
        ...payload,
        ...(isEdit ? { _method: 'put' } : {}),
        property_features: (payload.property_features ?? []).filter((row) => row.key.trim() !== ''),
        amenities: (payload.amenities ?? []).filter((item) => item.name.trim() !== ''),
    }));

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const url = isEdit && project ? route('admin.projects.update', { project: project.id }) : route('admin.projects.store');

        post(url, { forceFormData: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={`${isEdit ? 'Edit' : 'Create'} Project`}
                    description="Manage project details, media, SEO and publishing."
                    flash={flash}
                    actions={
                        <>
                            {isEdit && project && (
                                <>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('admin.projects.gallery.index', { project: project.id })}>
                                            <ImageIcon />
                                            Gallery
                                        </Link>
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('admin.projects.pricing.index', { project: project.id })}>
                                            <Wallet />
                                            Pricing
                                        </Link>
                                    </Button>
                                </>
                            )}
                            <Button type="button" variant="outline" onClick={() => router.visit(route('admin.projects.index'))}>
                                <ArrowLeft />
                                Back
                            </Button>
                        </>
                    }
                />

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Title, code, type, status and description.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Title" value={data.title} onChange={(v) => setData('title', v)} error={errors.title} required />
                            <TextField label="Project code" value={data.project_code} onChange={(v) => setData('project_code', v)} error={errors.project_code} hint="Optional unique identifier." />
                            <TextField label="Slug" value={data.slug} onChange={(v) => setData('slug', v)} error={errors.slug} hint="Leave blank to generate from the title." />
                            <TextField label="Sort order" type="number" value={String(data.sort_order)} onChange={(v) => setData('sort_order', Number(v) || 0)} error={errors.sort_order} />
                            <SelectField label="Project type" value={data.project_type_id} onChange={(v) => setData('project_type_id', v)} options={types} error={errors.project_type_id} required />
                            <SelectField label="Project status" value={data.project_status_id} onChange={(v) => setData('project_status_id', v)} options={statuses} error={errors.project_status_id} required />
                            <div className="sm:col-span-2">
                                <TextAreaField label="Short description" value={data.short_description} onChange={(v) => setData('short_description', v)} error={errors.short_description} rows={3} />
                            </div>
                            <div className="sm:col-span-2">
                                <Field label="Overview" error={errors.overview}>
                                    <RichTextEditor value={data.overview} onChange={(html) => setData('overview', html)} error={Boolean(errors.overview)} />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                            <CardDescription>Address and Google Maps share link.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Address" value={data.location_address} onChange={(v) => setData('location_address', v)} error={errors.location_address} />
                            <TextField label="Area" value={data.location_area} onChange={(v) => setData('location_area', v)} error={errors.location_area} />
                            <TextField label="City" value={data.location_city} onChange={(v) => setData('location_city', v)} error={errors.location_city} />
                            <TextField label="Country" value={data.location_country} onChange={(v) => setData('location_country', v)} error={errors.location_country} />
                            <div className="sm:col-span-2">
                                <TextField
                                    label="Google Maps URL"
                                    value={data.google_map_url}
                                    onChange={(v) => setData('google_map_url', v)}
                                    error={errors.google_map_url}
                                    hint="Paste a share link, e.g. https://maps.app.goo.gl/..."
                                />
                                {data.google_map_url && (
                                    <a href={data.google_map_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground mt-1 inline-block text-xs underline">
                                        Open in Google Maps ↗
                                    </a>
                                )}
                            </div>
                            <TextField label="Latitude" value={data.latitude} onChange={(v) => setData('latitude', v)} error={errors.latitude} />
                            <TextField label="Longitude" value={data.longitude} onChange={(v) => setData('longitude', v)} error={errors.longitude} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Property Information</CardTitle>
                            <CardDescription>Areas, units and handover.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-3">
                            <TextField label="Total land area" value={data.total_land_area} onChange={(v) => setData('total_land_area', v)} error={errors.total_land_area} />
                            <TextField label="Total units" type="number" value={data.total_units} onChange={(v) => setData('total_units', v)} error={errors.total_units} />
                            <TextField label="Floors" type="number" value={data.number_of_floors} onChange={(v) => setData('number_of_floors', v)} error={errors.number_of_floors} />
                            <TextField label="Buildings" type="number" value={data.number_of_buildings} onChange={(v) => setData('number_of_buildings', v)} error={errors.number_of_buildings} />
                            <TextField label="Units per floor" type="number" value={data.units_per_floor} onChange={(v) => setData('units_per_floor', v)} error={errors.units_per_floor} />
                            <TextField label="Handover date" type="date" value={data.handover_date} onChange={(v) => setData('handover_date', v)} error={errors.handover_date} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Features &amp; Amenities</CardTitle>
                            <CardDescription>Flexible key/value features and a list of amenities.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <KeyValueRepeater
                                label="Property features"
                                value={data.property_features}
                                onChange={(rows) => setData('property_features', rows)}
                                error={errors.property_features}
                                keyLabel="e.g. Building height"
                                valueLabel="e.g. G+10"
                                withIcon
                            />
                            <AmenityRepeater
                                label="Amenities"
                                value={data.amenities}
                                onChange={(items) => setData('amenities', items)}
                                error={errors.amenities}
                                hint="Add a name and pick an optional icon. Legacy plain amenities are upgraded automatically."
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>Hero banner, brochure and promo video.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <ImageUploadField
                                label="Hero banner"
                                currentSrc={project?.hero_banner}
                                file={data.hero_banner}
                                error={errors.hero_banner}
                                hint={imageHint}
                                removeFlag={data.remove_hero_banner}
                                onToggleRemove={() => setData('remove_hero_banner', !data.remove_hero_banner)}
                                onChange={(file) => setData('hero_banner', file)}
                            />
                            <TextField label="Hero banner alt text" value={data.hero_banner_alt} onChange={(v) => setData('hero_banner_alt', v)} error={errors.hero_banner_alt} />
                            <FileUploadField
                                label="Brochure (PDF)"
                                currentSrc={project?.brochure_pdf}
                                file={data.brochure_pdf}
                                error={errors.brochure_pdf}
                                hint={documentHint}
                                removeFlag={data.remove_brochure_pdf}
                                onToggleRemove={() => setData('remove_brochure_pdf', !data.remove_brochure_pdf)}
                                onChange={(file) => setData('brochure_pdf', file)}
                            />
                            <TextField label="Promo video URL" value={data.promo_video_url} onChange={(v) => setData('promo_video_url', v)} error={errors.promo_video_url} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Legal Information</CardTitle>
                            <CardDescription>Approval number and document.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Approval number" value={data.legal_approval_no} onChange={(v) => setData('legal_approval_no', v)} error={errors.legal_approval_no} />
                            <FileUploadField
                                label="Approval document (PDF)"
                                currentSrc={project?.legal_approval_document}
                                file={data.legal_approval_document}
                                error={errors.legal_approval_document}
                                hint={documentHint}
                                removeFlag={data.remove_legal_approval_document}
                                onToggleRemove={() => setData('remove_legal_approval_document', !data.remove_legal_approval_document)}
                                onChange={(file) => setData('legal_approval_document', file)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Developer</CardTitle>
                            <CardDescription>Optional developer details.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Developer name" value={data.developer_name} onChange={(v) => setData('developer_name', v)} error={errors.developer_name} />
                            <TextField label="Developer website" value={data.developer_website} onChange={(v) => setData('developer_website', v)} error={errors.developer_website} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO &amp; Social Sharing</CardTitle>
                            <CardDescription>Optional metadata with sensible fallbacks.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Meta title" value={data.meta_title} onChange={(v) => setData('meta_title', v)} error={errors.meta_title} />
                            <TextField label="Meta keywords" value={data.meta_keywords} onChange={(v) => setData('meta_keywords', v)} error={errors.meta_keywords} />
                            <div className="sm:col-span-2">
                                <TextAreaField label="Meta description" value={data.meta_description} onChange={(v) => setData('meta_description', v)} error={errors.meta_description} rows={2} />
                            </div>
                            <TextField label="Canonical URL" value={data.canonical_url} onChange={(v) => setData('canonical_url', v)} error={errors.canonical_url} />
                            <SelectField
                                label="Robots"
                                value={data.robots}
                                onChange={(v) => setData('robots', v)}
                                options={[
                                    { value: '', label: 'Default' },
                                    { value: 'index,follow', label: 'index,follow' },
                                    { value: 'noindex,follow', label: 'noindex,follow' },
                                    { value: 'index,nofollow', label: 'index,nofollow' },
                                    { value: 'noindex,nofollow', label: 'noindex,nofollow' },
                                ]}
                                error={errors.robots}
                            />
                            <TextField label="OG title" value={data.og_title} onChange={(v) => setData('og_title', v)} error={errors.og_title} />
                            <TextField label="Twitter card" value={data.twitter_card} onChange={(v) => setData('twitter_card', v)} error={errors.twitter_card} hint="summary or summary_large_image" />
                            <div className="sm:col-span-2">
                                <TextAreaField label="OG description" value={data.og_description} onChange={(v) => setData('og_description', v)} error={errors.og_description} rows={2} />
                            </div>
                            <ImageUploadField
                                label="OG image"
                                currentSrc={project?.og_image}
                                file={data.og_image}
                                error={errors.og_image}
                                hint={`${imageHint}. Falls back to the hero banner when empty.`}
                                removeFlag={data.remove_og_image}
                                onToggleRemove={() => setData('remove_og_image', !data.remove_og_image)}
                                onChange={(file) => setData('og_image', file)}
                            />
                            <ImageUploadField
                                label="Twitter image"
                                currentSrc={project?.twitter_image}
                                file={data.twitter_image}
                                error={errors.twitter_image}
                                hint={imageHint}
                                removeFlag={data.remove_twitter_image}
                                onToggleRemove={() => setData('remove_twitter_image', !data.remove_twitter_image)}
                                onChange={(file) => setData('twitter_image', file)}
                            />
                            <TextField label="Twitter title" value={data.twitter_title} onChange={(v) => setData('twitter_title', v)} error={errors.twitter_title} />
                            <TextField label="Twitter description" value={data.twitter_description} onChange={(v) => setData('twitter_description', v)} error={errors.twitter_description} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                            <CardDescription>Visibility and featured placement. Currency: {currency.code}.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <CheckboxField label="Published" checked={data.is_published} onChange={(v) => setData('is_published', v)} error={errors.is_published} />
                            <CheckboxField label="Featured" checked={data.is_featured} onChange={(v) => setData('is_featured', v)} error={errors.is_featured} />
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card sticky bottom-4 flex w-full items-center justify-end gap-3 rounded-lg border p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : 'Save project'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
