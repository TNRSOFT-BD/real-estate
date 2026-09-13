import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { amenityName } from '@/lib/format';
import { projectIconMap } from '@/lib/project-icons';
import { type ProjectAmenity, type PublicProject } from '@/types/project';

export default function ProjectAmenities({ project }: { project: PublicProject }) {
    const amenities = (project.amenities ?? [])
        .map((item): ProjectAmenity => (typeof item === 'string' ? { name: item } : item))
        .filter((item) => item.name.trim() !== '');

    if (amenities.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="project-amenities-title">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                    <Reveal>
                        <SectionLabel>Amenities</SectionLabel>
                    </Reveal>
                    <Reveal delay={80}>
                        <h2
                            id="project-amenities-title"
                            className="text-ink mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl"
                        >
                            Everyday comfort, considered
                        </h2>
                    </Reveal>
                </div>

                <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8">
                    {amenities.map((amenity, index) => {
                        const Icon = amenity.icon ? projectIconMap[amenity.icon] : undefined;
                        const name = amenityName(amenity);

                        return (
                            <Reveal key={`${name}-${index}`} delay={index * 40}>
                                <li className="border-line flex items-center gap-5 border-b pb-5">
                                    <span className="text-ink-soft/70 w-8 shrink-0 text-xs font-medium tracking-[0.2em]" aria-hidden>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {Icon ? (
                                        <Icon className="text-ink size-5 shrink-0" aria-hidden />
                                    ) : (
                                        <span className="bg-ink/20 size-1.5 shrink-0 rounded-full" aria-hidden />
                                    )}
                                    <span className="text-ink text-base font-medium sm:text-lg">{name}</span>
                                </li>
                            </Reveal>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
