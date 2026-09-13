import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { humanizeLabel } from '@/lib/format';
import { projectIconMap } from '@/lib/project-icons';
import { type PublicProject } from '@/types/project';

export default function ProjectHighlights({ project }: { project: PublicProject }) {
    const features = (project.property_features ?? []).filter((feature) => feature.key.trim() !== '');

    if (features.length === 0) {
        return null;
    }

    return (
        <section className="border-line border-y" aria-labelledby="project-highlights-title">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <Reveal>
                    <SectionLabel>Property highlights</SectionLabel>
                </Reveal>
                <Reveal delay={80}>
                    <h2
                        id="project-highlights-title"
                        className="text-ink mt-6 max-w-2xl text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl"
                    >
                        Designed around the details
                    </h2>
                </Reveal>

                <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon ? projectIconMap[feature.icon] : undefined;

                        return (
                            <Reveal key={`${feature.key}-${index}`} delay={index * 50}>
                                <div className="flex items-start gap-4">
                                    {Icon && (
                                        <span className="border-line text-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden>
                                            <Icon className="size-5" />
                                        </span>
                                    )}
                                    <div>
                                        <dt className="text-ink-soft text-[11px] font-medium tracking-[0.22em] uppercase">{humanizeLabel(feature.key)}</dt>
                                        <dd className="text-ink mt-1.5 text-lg font-medium">{feature.value || '—'}</dd>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </dl>
            </div>
        </section>
    );
}
