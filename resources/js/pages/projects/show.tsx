import ProjectAmenities from '@/components/frontend/project/project-amenities';
import ProjectBreadcrumb from '@/components/frontend/project/project-breadcrumb';
import ProjectCta from '@/components/frontend/project/project-cta';
import ProjectDeveloper from '@/components/frontend/project/project-developer';
import ProjectFacts from '@/components/frontend/project/project-facts';
import ProjectFloorPlans from '@/components/frontend/project/project-floor-plans';
import ProjectGallery from '@/components/frontend/project/project-gallery';
import ProjectHero from '@/components/frontend/project/project-hero';
import ProjectHighlights from '@/components/frontend/project/project-highlights';
import ProjectLegal from '@/components/frontend/project/project-legal';
import ProjectLocation from '@/components/frontend/project/project-location';
import ProjectOverview from '@/components/frontend/project/project-overview';
import ProjectPricing from '@/components/frontend/project/project-pricing';
import ProjectVideo from '@/components/frontend/project/project-video';
import RelatedProjects from '@/components/frontend/project/related-projects';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { type ProjectShowProps } from '@/types/project';
import { Head, usePage } from '@inertiajs/react';

export default function ProjectShow({ project, seo, relatedProjects, currency }: ProjectShowProps) {
    const { name } = usePage<SharedData>().props;

    const galleries = project.galleries ?? [];
    const pricingPlans = project.pricing_plans ?? [];
    const canonical = seo.canonical_url ?? `/projects/${project.slug}`;
    const ogImage = seo.og_image ? mediaUrl(seo.og_image) : project.hero_banner ? mediaUrl(project.hero_banner) : null;
    const twitterImage = seo.twitter_image ? mediaUrl(seo.twitter_image) : ogImage;

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

            <ProjectHero project={project} />
            <ProjectBreadcrumb project={project} />
            <ProjectFacts project={project} />
            <ProjectOverview project={project} />
            <ProjectHighlights project={project} />
            <ProjectAmenities project={project} />
            <ProjectLocation project={project} />
            {galleries.length > 0 && <ProjectGallery images={galleries} />}
            <ProjectFloorPlans plans={pricingPlans} gallery={galleries} />
            <ProjectPricing plans={pricingPlans} currency={currency} />
            <ProjectDeveloper project={project} />
            <ProjectLegal project={project} />
            <ProjectVideo project={project} />
            <ProjectCta />
            <RelatedProjects projects={relatedProjects} />
        </PublicLayout>
    );
}
