import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type AboutHero as AboutHeroData } from '@/types/about';

interface AboutValuesProps {
    hero: AboutHeroData;
}

export default function AboutValues({ hero }: AboutValuesProps) {
    if (!hero.values || hero.values.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-labelledby="about-values-title">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.values_badge ?? 'Our values'}</SectionLabel>
                <h2
                    id="about-values-title"
                    className="text-ink mt-7 text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance max-sm:text-2xl sm:text-4xl"
                >
                    {hero.values_title ?? 'The principles that guide every project.'}
                </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:gap-6">
                {hero.values.map((value, index) => (
                    <Reveal key={value.title} delay={index * 70} className="h-full">
                        <GlassPanel className="group hover:bg-glass-strong relative flex h-full flex-col overflow-hidden p-7 transition-colors duration-300 sm:p-8">
                            <span
                                aria-hidden
                                className="text-ink/10 group-hover:text-ink/15 absolute top-3 right-6 text-6xl leading-none font-semibold tracking-[-0.04em] transition-colors sm:text-7xl"
                            >
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <h3 className="text-ink relative text-xl font-medium tracking-[-0.01em] max-sm:text-lg sm:text-2xl">{value.title}</h3>

                            {value.description && (
                                <p className="text-ink-soft relative mt-3 max-w-md text-sm leading-relaxed sm:text-base">{value.description}</p>
                            )}
                        </GlassPanel>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
