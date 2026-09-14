import ProjectsEmptyState from '@/components/frontend/project/projects-empty-state';
import ProjectsFilters from '@/components/frontend/project/projects-filters';
import ProjectsGrid from '@/components/frontend/project/projects-grid';
import ProjectsHero from '@/components/frontend/project/projects-hero';
import ProjectsPagination from '@/components/frontend/project/projects-pagination';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { type ProjectsIndexProps } from '@/types/project';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ProjectsIndex({ projects, types, statuses, filters, seo }: ProjectsIndexProps) {
    const { name } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const offStart = router.on('start', () => setLoading(true));
        const offFinish = router.on('finish', () => setLoading(false));

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    const filtered = Boolean(filters.project_type || filters.project_status || filters.search);
    const canonical = seo.canonical_url ?? '/projects';
    const ogImage = seo.og_image ? mediaUrl(seo.og_image) : null;
    const twitterImage = seo.twitter_image ? mediaUrl(seo.twitter_image) : ogImage;

    return (
        <PublicLayout>
            <Head>
                <title>{seo.title ? `${seo.title} | ${name}` : `Our Projects | ${name}`}</title>
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                <link rel="canonical" href={canonical} />
                {seo.robots && <meta name="robots" content={seo.robots} />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={seo.og_title ?? seo.title ?? 'Our Projects'} />
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta property="og:url" content={canonical} />

                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.twitter_title ?? seo.title ?? 'Our Projects'} />
                {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
                {twitterImage && <meta name="twitter:image" content={twitterImage} />}
            </Head>

            <div className="flex min-h-screen flex-col">
                <ProjectsHero />
                <ProjectsFilters types={types} statuses={statuses} filters={filters} />

                {projects.data.length > 0 ? (
                    <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-8" aria-label="Projects">
                        <div className={cn('transition-opacity duration-300', loading && 'pointer-events-none opacity-60')}>
                            <ProjectsGrid projects={projects.data} />
                            <ProjectsPagination paginator={projects} />
                        </div>
                    </section>
                ) : (
                    <ProjectsEmptyState filtered={filtered} />
                )}
            </div>
        </PublicLayout>
    );
}
