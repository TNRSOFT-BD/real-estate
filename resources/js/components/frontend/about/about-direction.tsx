import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type AboutHero as AboutHeroData } from '@/types/about';

interface AboutDirectionProps {
    hero: AboutHeroData;
}

function PanelLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-ink inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] uppercase">
            <span aria-hidden className="bg-ink h-px w-8 shrink-0" />
            {children}
        </span>
    );
}

export default function AboutDirection({ hero }: AboutDirectionProps) {
    if (!hero.mission_title && !hero.vision_title) {
        return null;
    }

    const missionImage = mediaUrl(hero.mission_image);
    const visionImage = mediaUrl(hero.vision_image);

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-labelledby="about-direction-title">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.direction_badge ?? 'Our direction'}</SectionLabel>
                <h2
                    id="about-direction-title"
                    className="text-ink mt-7 text-xl leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-4xl"
                >
                    Mission and vision
                </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
                <Reveal>
                    <GlassPanel className="flex h-full flex-col p-8 sm:p-10">
                        <PanelLabel>Mission</PanelLabel>

                        <h3 className="text-ink mt-7 max-w-md text-lg leading-snug font-medium tracking-[-0.01em] text-balance sm:text-2xl">{hero.mission_title}</h3>
                        {hero.mission_description && <p className="text-ink-soft mt-5 max-w-md text-base leading-relaxed">{hero.mission_description}</p>}

                        {missionImage && (
                            <div className="bg-glass-strong border-glass-border mt-8 aspect-[4/3] w-full overflow-hidden rounded-xl border">
                                <img src={missionImage} alt="" aria-hidden loading="lazy" className="size-full object-cover" />
                            </div>
                        )}
                    </GlassPanel>
                </Reveal>

                <Reveal delay={120}>
                    <GlassPanel className="flex h-full flex-col p-8 sm:p-10">
                        <PanelLabel>Vision</PanelLabel>

                        <h3 className="text-ink mt-7 max-w-md text-lg leading-snug font-medium tracking-[-0.01em] text-balance sm:text-2xl">{hero.vision_title}</h3>
                        {hero.vision_description && <p className="text-ink-soft mt-5 max-w-md text-base leading-relaxed">{hero.vision_description}</p>}

                        {visionImage && (
                            <div className="bg-glass-strong border-glass-border mt-8 aspect-[4/3] w-full overflow-hidden rounded-xl border">
                                <img src={visionImage} alt="" aria-hidden loading="lazy" className="size-full object-cover" />
                            </div>
                        )}
                    </GlassPanel>
                </Reveal>
            </div>
        </section>
    );
}
