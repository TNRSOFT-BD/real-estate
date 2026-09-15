import SectionLabel from '@/components/frontend/glass/section-label';
import AboutUs from '@/components/frontend/home/AboutUs';
import HomeHero from '@/components/frontend/home/home-hero';
import ProjectsGrid from '@/components/frontend/project/projects-grid';
import WhyChooseUs from '@/components/frontend/shared/why-choose-us';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { type HomePageProps } from '@/types/project';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function Home({ featuredProjects, hero, about, whyChooseUs, seo }: HomePageProps) {
    const { name } = usePage<SharedData>().props;

    const canonical = seo.canonical_url ?? '/';
    const ogImage = seo.og_image ? mediaUrl(seo.og_image) : null;
    const twitterImage = seo.twitter_image ? mediaUrl(seo.twitter_image) : ogImage;

    return (
        <PublicLayout>
            <Head>
                <title>{seo.title ? `${seo.title} | ${name}` : `${name} | Premium Real Estate Development`}</title>
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                <link rel="canonical" href={canonical} />
                {seo.robots && <meta name="robots" content={seo.robots} />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={seo.og_title ?? seo.title ?? name} />
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta property="og:url" content={canonical} />

                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.twitter_title ?? seo.title ?? name} />
                {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
                {twitterImage && <meta name="twitter:image" content={twitterImage} />}
            </Head>

            <HomeHero hero={hero} />

            {featuredProjects.length > 0 && (
                <section className="mx-auto w-full max-w-7xl px-4 py-20 lg:px-8 lg:py-28" aria-labelledby="home-projects-title">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <SectionLabel>Selected work</SectionLabel>
                            <h2
                                id="home-projects-title"
                                className="text-ink mt-6 text-[clamp(2rem,3.4vw+1rem,2.75rem)] leading-[1.16] font-medium tracking-normal text-balance"
                            >
                                Our Projects
                            </h2>
                        </div>

                        <Link
                            href="/projects"
                            className="group text-ink-soft hover:text-ink inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <span className="border-line group-hover:border-ink border-b pb-1 transition-colors">View all projects</span>
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                        </Link>
                    </div>

                    <div className="mt-12">
                        <ProjectsGrid projects={featuredProjects} />
                    </div>
                </section>
            )}

            <AboutUs about={about} />

            <WhyChooseUs
                eyebrow={whyChooseUs.eyebrow}
                title={whyChooseUs.title}
                description={whyChooseUs.description}
                features={whyChooseUs.features}
            />
        </PublicLayout>
    );
}
