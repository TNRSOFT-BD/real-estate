import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type AboutHero as AboutHeroData, type AboutStat } from '@/types/about';

interface AboutIntroProps {
    hero: AboutHeroData;
}

const BASES = ['#D2CABB', '#C0C0C0', '#F1EDE8', '#C9A986'];

function StatCard({ base, stat }: { base: string; stat: AboutStat }) {
    return (
        <div
            className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/60 p-6 shadow-[0_2px_12px_-6px_rgba(24,21,16,0.25)] transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-7"
            style={{ backgroundColor: base }}
        >
            <p className="text-3xl font-bold tracking-[-0.03em] text-black sm:text-4xl">{stat.value}</p>
            <p className="mt-3 text-[11px] font-medium tracking-[0.18em] text-black/60 uppercase">{stat.label}</p>
        </div>
    );
}

export default function AboutIntro({ hero }: AboutIntroProps) {
    if (!hero.intro_title && !hero.intro_description) {
        return null;
    }

    const image = mediaUrl(hero.intro_image);
    const stats = hero.stats ?? [];

    return (
        <section id="story" className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-labelledby="about-intro-title">
            <Reveal>
                <SectionLabel>{hero.intro_badge ?? 'Who we are'}</SectionLabel>
            </Reveal>

            <div className="mt-7 grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-7">
                    <h2
                        id="about-intro-title"
                        className="text-ink text-3xl leading-[1.08] font-medium tracking-[-0.02em] max-sm:text-2xl sm:text-4xl"
                    >
                        {hero.intro_title}
                    </h2>
                    {hero.intro_description && <p className="text-ink-soft mt-6 text-base leading-relaxed sm:text-lg">{hero.intro_description}</p>}
                </Reveal>

                {stats.length > 0 && (
                    <Reveal delay={120} className="lg:col-span-5">
                        <div className="mx-auto grid max-w-md grid-cols-2 gap-5 sm:gap-6 lg:max-w-none">
                            {stats.map((stat, index) => (
                                <StatCard key={`${stat.label}-${index}`} base={BASES[index % BASES.length]} stat={stat} />
                            ))}
                        </div>
                    </Reveal>
                )}
            </div>

            {image && (
                <Reveal delay={160} className="mt-12">
                    <div className="bg-glass-strong border-glass-border overflow-hidden rounded-2xl border p-2">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
                            <img src={image} alt="" aria-hidden loading="lazy" className="size-full object-cover" />
                        </div>
                    </div>
                </Reveal>
            )}
        </section>
    );
}
