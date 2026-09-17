import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type ContactHero as ContactHeroData } from '@/types/contact';

interface ContactHeroProps {
    hero: ContactHeroData;
}

export default function ContactHero({ hero }: ContactHeroProps) {
    const image = mediaUrl(hero.hero_background_image);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-6 pb-4 sm:pt-10 lg:px-8 lg:pt-14" aria-labelledby="contact-hero-title">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                    <SectionLabel>{hero.hero_badge ?? 'Contact'}</SectionLabel>

                    <h1
                        id="contact-hero-title"
                        className="text-ink mt-8 text-4xl leading-[1.04] font-medium tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
                    >
                        {hero.hero_title ?? "Let's build something exceptional."}
                        {hero.hero_highlight && <span className="text-ink-soft block">{hero.hero_highlight}</span>}
                    </h1>

                    {hero.hero_description && (
                        <p className="text-ink-soft mt-7 max-w-xl text-base leading-relaxed sm:text-lg">{hero.hero_description}</p>
                    )}
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-glass-strong relative aspect-[4/3] w-full overflow-hidden">
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
                                <span className="text-ink-soft text-center text-[11px] font-medium tracking-[0.28em] uppercase">
                                    Architecture &middot; Development
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
