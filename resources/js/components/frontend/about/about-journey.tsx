import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type AboutHero as AboutHeroData } from '@/types/about';
import { ArrowUpRight } from 'lucide-react';

interface AboutJourneyProps {
    hero: AboutHeroData;
}

export default function AboutJourney({ hero }: AboutJourneyProps) {
    if (!hero.journey || hero.journey.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-labelledby="about-journey-title">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.journey_badge ?? 'Our journey'}</SectionLabel>
                <h2
                    id="about-journey-title"
                    className="text-ink mt-7 text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance max-sm:text-2xl sm:text-4xl"
                >
                    {hero.journey_title ?? 'Milestones that shaped us.'}
                </h2>
            </Reveal>

            <div className="relative mt-14">
                <span aria-hidden className="bg-line absolute top-1 right-0 left-0 hidden h-px lg:block" />

                <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
                    {hero.journey.map((item, index) => (
                        <Reveal key={`${item.year}-${item.title}`} delay={index * 70} className="h-full">
                            <li className="group relative flex h-full flex-col lg:pt-8">
                                <span
                                    aria-hidden
                                    className="bg-ink absolute top-1 left-0 hidden size-2.5 -translate-y-1/2 rounded-full transition-transform duration-300 group-hover:scale-150 lg:block"
                                />
                                <span aria-hidden className="bg-ink mb-4 block size-2.5 rounded-full lg:hidden" />

                                <GlassPanel className="group-hover:bg-glass-strong flex h-full flex-col p-5 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_18px_40px_-24px_rgba(24,21,16,0.5)] sm:p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-ink text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{item.year}</p>
                                        <ArrowUpRight className="text-ink-soft size-4 shrink-0 -translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0 group-hover:opacity-100" />
                                    </div>
                                    <h3 className="text-ink mt-3 text-base font-medium tracking-[-0.01em] sm:text-lg">{item.title}</h3>
                                    {item.description && <p className="text-ink-soft mt-2 text-sm leading-relaxed">{item.description}</p>}
                                </GlassPanel>
                            </li>
                        </Reveal>
                    ))}
                </ol>
            </div>
        </section>
    );
}
