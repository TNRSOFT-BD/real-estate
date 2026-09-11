import ContactClosing from '@/components/frontend/contact/contact-closing';
import ContactFaq from '@/components/frontend/contact/contact-faq';
import ContactForm from '@/components/frontend/contact/contact-form';
import ContactHero from '@/components/frontend/contact/contact-hero';
import ContactInformation from '@/components/frontend/contact/contact-information';
import ContactLocation from '@/components/frontend/contact/contact-location';
import ContactReveal from '@/components/frontend/contact/contact-reveal';
import ContactSectionLabel from '@/components/frontend/contact/contact-section-label';
import ContactSocialLinks from '@/components/frontend/contact/contact-social-links';
import ContactTeam from '@/components/frontend/contact/contact-team';
import LiveChatWidget from '@/components/frontend/contact/live-chat-widget';
import PublicLayout from '@/layouts/public-layout';
import { type ContactPageProps } from '@/types/contact';
import { Head } from '@inertiajs/react';

export default function ContactIndex(props: ContactPageProps) {
    const { hero, contactInformation, form, faqs, teamMembers, locations, socialLinks, liveChat, seo } = props;

    const seoImage = seo.og_image;

    return (
        <PublicLayout>
            <Head>
                <title>{`${seo.title ?? 'Contact Us'} | Real Estate`}</title>
                {seo.title && <meta name="title" content={seo.title} />}
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
                {seo.og_title && <meta property="og:title" content={seo.og_title} />}
                {seo.og_description && <meta property="og:description" content={seo.og_description} />}
                {seoImage && <meta property="og:image" content={seoImage} />}
                {seo.twitter_card && <meta name="twitter:card" content={seo.twitter_card} />}
            </Head>

            <ContactHero hero={hero} />

            {contactInformation.length > 0 && <ContactInformation items={contactInformation} />}

            <section id="contact-form" className="bg-muted/40 border-b" aria-labelledby="contact-form-title">
                <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <ContactReveal className="lg:col-span-5">
                            <div className="lg:sticky lg:top-28">
                                <ContactSectionLabel>Inquiry</ContactSectionLabel>

                                <h2 id="contact-form-title" className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                    {hero.form_title ?? 'Tell us about your project'}
                                </h2>

                                {hero.form_description && (
                                    <p className="text-muted-foreground mt-5 max-w-md text-sm leading-relaxed">{hero.form_description}</p>
                                )}

                                {socialLinks.length > 0 && (
                                    <div className="border-border mt-12 border-t pt-8">
                                        <ContactSocialLinks items={socialLinks} />
                                    </div>
                                )}
                            </div>
                        </ContactReveal>

                        <ContactReveal delay={120} className="lg:col-span-7">
                            <ContactForm fields={form} successMessage={hero.form_success_message} />
                        </ContactReveal>
                    </div>
                </div>
            </section>

            {faqs.length > 0 && <ContactFaq faqs={faqs} hero={hero} />}

            <ContactTeam members={teamMembers} hero={hero} />

            {locations.length > 0 && <ContactLocation locations={locations} hero={hero} />}

            <ContactClosing hero={hero} />

            {liveChat?.enabled && <LiveChatWidget config={liveChat} />}
        </PublicLayout>
    );
}
