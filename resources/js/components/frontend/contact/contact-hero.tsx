import ContactReveal from '@/components/frontend/contact/contact-reveal';
import ContactSectionLabel from '@/components/frontend/contact/contact-section-label';
import { Button } from '@/components/ui/button';
import { mediaUrl } from '@/lib/media';
import { type ContactHero } from '@/types/contact';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface ContactHeroProps {
    hero: ContactHero;
}

export default function ContactHero({ hero }: ContactHeroProps) {
    const image = mediaUrl(hero.hero_background_image);

    const primaryLabel = hero.hero_primary_button_text;
    const primaryHref = hero.hero_primary_button_link ?? '#contact-form';
    const secondaryLabel = hero.hero_secondary_button_text;
    const secondaryHref = hero.hero_secondary_button_link ?? '#contact-form';

    return (
        <section className="border-b" aria-labelledby="contact-hero-title">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    <ContactReveal className="lg:col-span-7">
                        <ContactSectionLabel>{hero.hero_badge ?? 'Contact'}</ContactSectionLabel>

                        <h1
                            id="contact-hero-title"
                            className="mt-8 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            {hero.hero_title ?? "Let's build something exceptional."}
                            {hero.hero_highlight && <span className="text-primary block">{hero.hero_highlight}</span>}
                        </h1>

                        {hero.hero_description && (
                            <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed sm:text-lg">{hero.hero_description}</p>
                        )}

                        {(primaryLabel || secondaryLabel) && (
                            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
                                {primaryLabel && (
                                    <Button asChild size="lg" className="group rounded-sm px-7">
                                        <Link href={primaryHref}>
                                            {primaryLabel}
                                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                )}

                                {secondaryLabel && (
                                    <Link
                                        href={secondaryHref}
                                        className="group text-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors"
                                    >
                                        <span className="border-border group-hover:border-primary border-b pb-1 transition-colors">
                                            {secondaryLabel}
                                        </span>
                                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </ContactReveal>

                    <ContactReveal delay={120} className="lg:col-span-5">
                        <div className="bg-muted relative aspect-4/5 w-full overflow-hidden border">
                            {image ? (
                                <img
                                    src={image}
                                    alt=""
                                    aria-hidden
                                    loading="eager"
                                    className="size-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center p-10">
                                    <span className="text-muted-foreground text-center text-xs font-medium tracking-[0.28em] uppercase">
                                        Architecture &middot; Development
                                    </span>
                                </div>
                            )}
                        </div>
                    </ContactReveal>
                </div>
            </div>
        </section>
    );
}
