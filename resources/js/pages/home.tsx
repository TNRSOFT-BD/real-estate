import SectionLabel from '@/components/frontend/glass/section-label';
import AboutUs from '@/components/frontend/home/AboutUs';
import HomeHero from '@/components/frontend/home/home-hero';
import ProjectsGrid from '@/components/frontend/project/projects-grid';
import WhyChooseUs, { type WhyChooseUsFeature } from '@/components/frontend/shared/why-choose-us';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { type HomePageProps } from '@/types/project';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const WHY_CHOOSE_US_FEATURES: WhyChooseUsFeature[] = [
    {
        title: 'Prime Location',
        description: 'Close to schools, hospitals, shopping centers and key facilities. Everything you need is within reach.',
    },
    {
        title: 'Trusted Developer',
        description: 'Years of experience, a solid reputation and a commitment to quality in every project.',
    },
    {
        title: 'Quality Construction',
        description: 'Built with durable materials and modern standards for long-lasting value and comfort.',
    },
    {
        title: 'Modern Amenities',
        description: 'More than a home, it\u2019s a lifestyle. Enjoy premium facilities designed for your convenience.',
    },
    {
        title: 'Flexible Payment Plans',
        description: 'Easy options for every stage of life. Your dream home is more affordable than you think.',
    },
    {
        title: 'Dedicated Support',
        description: 'We\u2019re with you, before and after purchase. Your satisfaction is our top priority.',
    },
];

export default function Home({ featuredProjects, hero, about, seo }: HomePageProps) {
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
                                className="text-ink mt-6 text-4xl leading-[1.04] font-medium tracking-[-0.02em] text-balance sm:text-5xl"
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
                eyebrow="Why Choose Us"
                title="Your Dream Home Our Commitment"
                description="We go beyond just selling properties. We build lasting relationships by offering quality, trust and exceptional service — because your future matters."
                features={WHY_CHOOSE_US_FEATURES}
            />
        </PublicLayout>
    );
}
