import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type AboutHero as AboutHeroData } from '@/types/about';

interface AboutWhyUsProps {
    hero: AboutHeroData;
}

export default function AboutWhyUs({ hero }: AboutWhyUsProps) {
    if (!hero.why_items || hero.why_items.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-labelledby="about-why-title">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.why_badge ?? 'Why choose us'}</SectionLabel>
                <h2 id="about-why-title" className="text-ink mt-7 text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-4xl">
                    {hero.why_title ?? 'A partner you can build on.'}
                </h2>
            </Reveal>

            <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:gap-6">
                {hero.why_items.map((item, index) => (
                    <Reveal key={item.title} delay={index > 0 ? 60 : 0} className="h-full">
                        <GlassPanel className="h-full p-7 sm:p-8">
                            <dt className="text-ink flex items-baseline gap-4 text-lg font-medium tracking-[-0.01em] sm:text-xl">
                                <span aria-hidden className="text-ink-soft text-xs font-medium tracking-[0.2em]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                {item.title}
                            </dt>
                            {item.description && <dd className="text-ink-soft mt-3 max-w-md text-sm leading-relaxed">{item.description}</dd>}
                        </GlassPanel>
                    </Reveal>
                ))}
            </dl>
        </section>
    );
}
