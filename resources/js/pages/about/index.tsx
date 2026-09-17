import AboutCompanyInfo from '@/components/frontend/about/about-company-info';
import AboutDirection from '@/components/frontend/about/about-direction';
import AboutHero from '@/components/frontend/about/about-hero';
import AboutIntro from '@/components/frontend/about/about-intro';
import AboutJourney from '@/components/frontend/about/about-journey';
import AboutPartners from '@/components/frontend/about/about-partners';
import AboutTeam from '@/components/frontend/about/about-team';
import AboutValues from '@/components/frontend/about/about-values';
import AboutWhyUs from '@/components/frontend/about/about-why-us';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl, pageTitle } from '@/lib/seo';
import { type SharedData } from '@/types';
import { type AboutPageProps } from '@/types/about';
import { Head, usePage } from '@inertiajs/react';

export default function AboutIndex(props: AboutPageProps) {
    const { hero, contactInformation, socialLinks, teamMembers, seo } = props;
    const { name } = usePage<SharedData>().props;
    const canonical = seo.canonical_url ?? '/about';
    const seoImage = absoluteUrl(seo.og_image ? mediaUrl(seo.og_image) : null);
    const twitterImage = absoluteUrl(seo.twitter_image ? mediaUrl(seo.twitter_image) : null) ?? seoImage;

    return (
        <PublicLayout>
            <Head>
                <title>{pageTitle(seo.title, name, 'About Us')}</title>
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                <link rel="canonical" href={canonical} />
                {seo.robots && <meta name="robots" content={seo.robots} />}

                <meta property="og:type" content={seo.og_type ?? 'website'} />
                <meta property="og:title" content={seo.og_title ?? seo.title ?? 'About Us'} />
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {seoImage && <meta property="og:image" content={seoImage} />}
                <meta property="og:url" content={canonical} />
                <meta property="og:site_name" content={name} />

                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.twitter_title ?? seo.title ?? 'About Us'} />
                {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
                {twitterImage && <meta name="twitter:image" content={twitterImage} />}
            </Head>

            <div className="max-sm:text-center [&_dd]:text-justify [&_p]:text-justify">
                <AboutHero hero={hero} />

                <AboutIntro hero={hero} />

                <AboutDirection hero={hero} />

                <AboutValues hero={hero} />

                <AboutJourney hero={hero} />

                <AboutWhyUs hero={hero} />

                {teamMembers.length > 0 && <AboutTeam hero={hero} members={teamMembers} />}

                {contactInformation.length > 0 && <AboutCompanyInfo items={contactInformation} socialLinks={socialLinks} />}

                <AboutPartners hero={hero} />
            </div>
        </PublicLayout>
    );
}
