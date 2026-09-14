import ProjectAmenities from '@/components/frontend/project/project-amenities';
import ProjectBreadcrumb from '@/components/frontend/project/project-breadcrumb';
import ProjectCta from '@/components/frontend/project/project-cta';
import ProjectFloorPlans from '@/components/frontend/project/project-floor-plans';
import ProjectGallery from '@/components/frontend/project/project-gallery';
import ProjectHighlights from '@/components/frontend/project/project-highlights';
import ProjectImageSlider, { type ProjectSlide } from '@/components/frontend/project/project-image-slider';
import ProjectLegal from '@/components/frontend/project/project-legal';
import ProjectLocation, { mapEmbedUrl } from '@/components/frontend/project/project-location';
import ProjectMeta from '@/components/frontend/project/project-meta';
import ProjectOverview from '@/components/frontend/project/project-overview';
import ProjectPricing from '@/components/frontend/project/project-pricing';
import ProjectSectionHeading from '@/components/frontend/project/project-section-heading';
import ProjectSidebar from '@/components/frontend/project/project-sidebar';
import ProjectSpecs from '@/components/frontend/project/project-specs';
import ProjectVideo from '@/components/frontend/project/project-video';
import RelatedProjects from '@/components/frontend/project/related-projects';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { type ProjectShowProps } from '@/types/project';
import { Head, usePage } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

export default function ProjectShow({ project, seo, relatedProjects, currency }: ProjectShowProps) {
    const { name } = usePage<SharedData>().props;

    const galleries = project.galleries ?? [];
    const pricingPlans = project.pricing_plans ?? [];
    const floorPlans = project.floor_plans ?? [];
    const canonical = seo.canonical_url ?? `/projects/${project.slug}`;
    const ogImage = seo.og_image ? mediaUrl(seo.og_image) : project.hero_banner ? mediaUrl(project.hero_banner) : null;
    const twitterImage = seo.twitter_image ? mediaUrl(seo.twitter_image) : ogImage;

    const location = [project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');

    const slides: ProjectSlide[] = [];
    const heroSrc = mediaUrl(project.hero_banner);

    if (heroSrc) {
        slides.push({ id: 'hero', src: heroSrc, alt: project.hero_banner_alt ?? project.title });
    }

    galleries.forEach((image) => {
        const src = mediaUrl(image.image_path);

        if (src) {
            slides.push({ id: image.id, src, alt: image.alt_text ?? image.caption ?? project.title, caption: image.caption });
        }
    });

    const hasMap = Boolean(mapEmbedUrl(project) || project.google_map_url);

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: '/projects' },
            { '@type': 'ListItem', position: 3, name: project.title, item: canonical },
        ],
    };

    return (
        <PublicLayout>
            <Head>
                <title>{seo.title ?? `${project.title} | ${name}`}</title>
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                <link rel="canonical" href={canonical} />
                {seo.robots && <meta name="robots" content={seo.robots} />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={seo.og_title ?? seo.title ?? project.title} />
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta property="og:url" content={canonical} />

                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.twitter_title ?? seo.title ?? project.title} />
                {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
                {twitterImage && <meta name="twitter:image" content={twitterImage} />}

                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            </Head>

            {slides.length > 0 && (
                <div className="relative">
                    <ProjectImageSlider slides={slides} />
                    <ProjectBreadcrumb project={project} />
                </div>
            )}

            <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
                    <div className="space-y-12 lg:col-span-8">
                        <div>
                            <ProjectMeta project={project} />

                            <h1 className="text-ink mt-6 text-3xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-5xl">
                                {project.title}
                            </h1>

                            {location && (
                                <p className="text-ink-soft mt-4 inline-flex items-center gap-2 text-sm">
                                    <MapPin className="text-ink size-4 shrink-0" aria-hidden />
                                    {location}
                                </p>
                            )}

                            {project.short_description && <p className="text-ink-soft mt-5 text-base leading-relaxed">{project.short_description}</p>}
                        </div>

                        <ProjectOverview project={project} />

                        <section aria-labelledby="project-specs-title">
                            <ProjectSectionHeading id="project-specs-title">Property Detail</ProjectSectionHeading>
                            <ProjectSpecs project={project} plans={pricingPlans} currency={currency} />
                        </section>

                        <ProjectHighlights project={project} />

                        <ProjectPricing plans={pricingPlans} currency={currency} />

                        {galleries.length > 0 && <ProjectGallery images={galleries} />}

                        <section aria-labelledby="project-amenities-title">
                            <ProjectSectionHeading id="project-amenities-title">Amenities</ProjectSectionHeading>
                            <ProjectAmenities project={project} />
                        </section>

                        {hasMap && (
                            <section aria-labelledby="project-location-title">
                                <ProjectSectionHeading id="project-location-title">Location</ProjectSectionHeading>
                                <ProjectLocation project={project} />
                            </section>
                        )}

                        {floorPlans.length > 0 && (
                            <section aria-labelledby="project-floor-plans-title">
                                <ProjectSectionHeading id="project-floor-plans-title">Floor Plans</ProjectSectionHeading>
                                <ProjectFloorPlans plans={floorPlans} />
                            </section>
                        )}

                        <ProjectVideo project={project} />

                        <ProjectLegal project={project} />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24">
                            <ProjectSidebar project={project} plans={pricingPlans} currency={currency} />
                        </div>
                    </div>
                </div>
            </div>

            <ProjectCta />
            <RelatedProjects projects={relatedProjects} />
        </PublicLayout>
    );
}
