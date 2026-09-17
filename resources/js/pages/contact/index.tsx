import ContactFaq from '@/components/frontend/contact/contact-faq';
import ContactForm from '@/components/frontend/contact/contact-form';
import ContactHero from '@/components/frontend/contact/contact-hero';
import ContactInformation from '@/components/frontend/contact/contact-information';
import ContactLocation from '@/components/frontend/contact/contact-location';
import ContactSocialLinks from '@/components/frontend/contact/contact-social-links';
import ContactTeam from '@/components/frontend/contact/contact-team';
import LiveChatWidget from '@/components/frontend/contact/live-chat-widget';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import PublicLayout from '@/layouts/public-layout';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl, pageTitle } from '@/lib/seo';
import { type SharedData } from '@/types';
import { type ContactPageProps } from '@/types/contact';
import { Head, usePage } from '@inertiajs/react';

export default function ContactIndex(props: ContactPageProps) {
    const { hero, contactInformation, form, faqs, teamMembers, locations, socialLinks, liveChat, seo } = props;
    const { name } = usePage<SharedData>().props;

    const canonical = seo.canonical_url ?? '/contact';
    const seoImage = absoluteUrl(seo.og_image ? mediaUrl(seo.og_image) : null);
    const twitterImage = absoluteUrl(seo.twitter_image ? mediaUrl(seo.twitter_image) : null) ?? seoImage;

    return (
        <PublicLayout>
            <Head>
                <title>{pageTitle(seo.title, name, 'Contact Us')}</title>
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                <link rel="canonical" href={canonical} />
                {seo.robots && <meta name="robots" content={seo.robots} />}

                <meta property="og:type" content={seo.og_type ?? 'website'} />
                <meta property="og:title" content={seo.og_title ?? seo.title ?? 'Contact Us'} />
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {seoImage && <meta property="og:image" content={seoImage} />}
                <meta property="og:url" content={canonical} />
                <meta property="og:site_name" content={name} />

                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.twitter_title ?? seo.title ?? 'Contact Us'} />
                {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
                {twitterImage && <meta name="twitter:image" content={twitterImage} />}
            </Head>

            <ContactHero hero={hero} />

            {contactInformation.length > 0 && <ContactInformation items={contactInformation} />}

            <section id="contact-form" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 lg:px-8 lg:py-16" aria-labelledby="contact-form-title">
                <div className="mx-auto max-w-4xl">
                    <Reveal className="flex flex-col items-center text-center">
                        <SectionLabel withLine={false}>Inquiry</SectionLabel>

                        <h2
                            id="contact-form-title"
                            className="text-ink mt-6 text-3xl leading-tight font-medium tracking-[-0.02em] text-balance sm:text-4xl"
                        >
                            {hero.form_title ?? 'Send us a message'}
                        </h2>

                        {hero.form_description && <p className="text-ink-soft mt-4 max-w-xl text-sm leading-relaxed">{hero.form_description}</p>}
                    </Reveal>

                    <Reveal delay={120} className="mt-10">
                        <ContactForm fields={form} successMessage={hero.form_success_message} />
                    </Reveal>

                    {socialLinks.length > 0 && (
                        <Reveal delay={160} className="mt-10 flex justify-center">
                            <ContactSocialLinks items={socialLinks} orientation="horizontal" />
                        </Reveal>
                    )}
                </div>
            </section>

            {faqs.length > 0 && <ContactFaq faqs={faqs} hero={hero} />}

            <ContactTeam members={teamMembers} hero={hero} />

            {locations.length > 0 && <ContactLocation locations={locations} hero={hero} />}

            {liveChat?.enabled && <LiveChatWidget config={liveChat} />}
        </PublicLayout>
    );
}
