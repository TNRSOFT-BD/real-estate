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
import { type AboutPageProps } from '@/types/about';
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function AboutIndex(props: AboutPageProps) {
    const { hero, contactInformation, socialLinks, teamMembers, seo } = props;
    const { name } = usePage<SharedData>().props;
    const seoImage = seo.og_image;

    return (
        <PublicLayout>
            <Head>
                <title>{seo.title ?? `About Us | ${name}`}</title>
                {seo.title && <meta name="title" content={seo.title} />}
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
                {seo.og_title && <meta property="og:title" content={seo.og_title} />}
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {seoImage && <meta property="og:image" content={seoImage} />}
                {seo.twitter_card && <meta name="twitter:card" content={seo.twitter_card} />}
            </Head>

            <div className="[&_p]:text-justify max-sm:text-center max-sm:[&_p]:text-center">
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
