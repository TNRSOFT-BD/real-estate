import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type AboutHero as AboutHeroData } from '@/types/about';
import { Link } from '@inertiajs/react';
import { ArrowDownRight } from 'lucide-react';

interface AboutHeroProps {
    hero: AboutHeroData;
}

export default function AboutHero({ hero }: AboutHeroProps) {
    const image = mediaUrl(hero.hero_image);

    return (
        <section className="mx-auto w-full max-w-7xl px-3 pt-5 pb-3 sm:pt-8 lg:px-6 lg:pt-10" aria-labelledby="about-hero-title">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                    <SectionLabel>{hero.hero_badge ?? 'About us'}</SectionLabel>

                    <h1
                        id="about-hero-title"
                        className="text-ink mt-8 text-4xl leading-[1.04] font-medium tracking-[-0.02em] text-balance max-sm:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl"
                    >
                        {hero.hero_title ?? 'Building places,'}
                        {hero.hero_highlight && <span className="text-ink-soft block">{hero.hero_highlight}</span>}
                    </h1>

                    {hero.hero_description && (
                        <p className="text-ink-soft mt-7 max-w-xl text-base leading-relaxed sm:text-lg">{hero.hero_description}</p>
                    )}

                    <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link
                            href={hero.hero_cta_link ?? '#story'}
                            className="group bg-ink text-canvas inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium transition-opacity hover:opacity-90"
                        >
                            {hero.hero_cta_text ?? 'Discover our story'}
                            <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
                        </Link>

                        <Link
                            href="#team"
                            className="group text-ink-soft hover:text-ink inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <span className="border-line group-hover:border-ink border-b pb-1 transition-colors">Meet the team</span>
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <figure>
                        <div className="border-glass-border bg-glass-strong relative aspect-4/5 w-full overflow-hidden rounded-2xl border">
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

                        <figcaption className="text-ink-soft mt-4 flex items-center justify-between text-[11px] font-medium tracking-[0.24em] uppercase">
                            <span>Est. 2008</span>
                            <span>Design &middot; Build &middot; Place</span>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
}
