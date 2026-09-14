import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { mediaUrl } from '@/lib/media';
import { type BreadcrumbItem } from '@/types';
import { type AdminProjectItem, type ProjectSeoData } from '@/types/project-admin';
import { Link } from '@inertiajs/react';
import { Image as ImageIcon, Layers, MessageSquare, Pencil, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/admin/projects' },
];

export default function ProjectShow({ project, seo }: { project: AdminProjectItem; seo: ProjectSeoData }) {
    const hero = mediaUrl(project.hero_banner ?? null);

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: project.title, href: '#' }]}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={project.title}
                    description={project.short_description ?? undefined}
                    actions={
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.projects.gallery.index', { project: project.id })}>
                                    <ImageIcon />
                                    Gallery
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.projects.pricing.index', { project: project.id })}>
                                    <Wallet />
                                    Pricing
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.projects.floor-plans.index', { project: project.id })}>
                                    <Layers />
                                    Floor plans
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.projects.reviews.index', { project: project.id })}>
                                    <MessageSquare />
                                    Reviews
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('admin.projects.edit', { project: project.id })}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>Key project information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <Info label="Project code" value={project.project_code} />
                            <Info label="Type" value={project.type?.name} />
                            <Info label="Status" value={project.status?.name} />
                            <Info label="Slug" value={project.slug} />
                            <Info label="City" value={project.location_city} />
                            <Info label="Country" value={project.location_country} />
                            <Info label="Total units" value={project.total_units != null ? String(project.total_units) : null} />
                            <Info label="Handover" value={project.handover_date ? project.handover_date.substring(0, 10) : null} />
                            <Info label="Gallery images" value={String(project.galleries_count ?? 0)} />
                            <Info label="Pricing plans" value={String(project.pricing_plans_count ?? 0)} />
                            <Info label="Floor plans" value={String(project.floor_plans_count ?? 0)} />
                            <Info label="Reviews" value={String(project.reviews_count ?? 0)} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hero ? (
                                <img src={hero} alt={project.hero_banner_alt ?? project.title} className="aspect-video w-full rounded-lg border object-cover" />
                            ) : (
                                <div className="text-muted-foreground bg-muted flex aspect-video items-center justify-center rounded-lg border text-sm">
                                    No hero image
                                </div>
                            )}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant={project.is_published ? 'default' : 'secondary'}>{project.is_published ? 'Published' : 'Draft'}</Badge>
                                {project.is_featured && <Badge>Featured</Badge>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>SEO preview</CardTitle>
                            <CardDescription>Resolved with the documented fallbacks.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <Info label="Title" value={seo.title} />
                            <Info label="Canonical" value={seo.canonical_url} />
                            <Info label="Description" value={seo.description} />
                            <Info label="OG title" value={seo.og_title} />
                            <Info label="OG image" value={seo.og_image} />
                            <Info label="Twitter card" value={seo.twitter_card} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function Info({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">{label}</p>
            <p className="mt-1 text-sm font-medium break-words">{value && value !== '' ? value : '—'}</p>
        </div>
    );
}
