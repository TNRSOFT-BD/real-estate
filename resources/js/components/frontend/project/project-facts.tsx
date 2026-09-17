import Reveal from '@/components/frontend/glass/reveal';
import { formatDate, formatNumber } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import { type PublicProject } from '@/types/project';

interface Fact {
    label: string;
    value: string;
    dot?: string | null;
}

export default function ProjectFacts({ project }: { project: PublicProject }) {
    const location = [project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');

    const facts: Fact[] = [
        project.type?.name ? { label: 'Project type', value: project.type.name } : null,
        project.status?.name ? { label: 'Status', value: project.status.name, dot: project.status.color ?? null } : null,
        project.total_land_area ? { label: 'Land area', value: formatNumber(project.total_land_area) ?? String(project.total_land_area) } : null,
        project.total_units != null ? { label: 'Total units', value: String(project.total_units) } : null,
        project.number_of_floors != null ? { label: 'Floors', value: String(project.number_of_floors) } : null,
        project.number_of_buildings != null ? { label: 'Buildings', value: String(project.number_of_buildings) } : null,
        project.units_per_floor != null ? { label: 'Units per floor', value: String(project.units_per_floor) } : null,
        project.handover_date ? { label: 'Handover', value: formatDate(project.handover_date) ?? '' } : null,
        location ? { label: 'Location', value: location } : null,
    ].filter((fact): fact is Fact => fact !== null);

    if (facts.length === 0) {
        return null;
    }

    const image = mediaUrl(project.at_a_glance_image ?? null);
    const heading = [project.type?.name, project.status?.name].filter(Boolean).join(' · ');

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-9 lg:px-8 lg:py-12" aria-label="At a glance">
            <Reveal>
                <div className="border-line relative isolate flex min-h-[300px] items-end overflow-hidden rounded-3xl border sm:min-h-[340px]">
                    {image ? (
                        <img
                            src={image}
                            alt={project.at_a_glance_image_alt ?? ''}
                            aria-hidden={project.at_a_glance_image_alt ? undefined : true}
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover"
                        />
                    ) : (
                        <div aria-hidden className="bg-ink absolute inset-0" />
                    )}

                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />

                    <div className="relative z-10 w-full p-5 sm:p-6 lg:p-8">
                        <p className="text-[11px] font-medium tracking-[0.28em] text-white/60 uppercase">At a glance</p>

                        {heading && (
                            <h2 className="mt-4 max-w-2xl text-3xl leading-[1.06] font-medium tracking-[-0.02em] text-balance text-white max-sm:text-2xl sm:text-4xl">
                                {heading}
                            </h2>
                        )}

                        <dl className="mt-8 flex flex-wrap gap-3">
                            {facts.map((fact) => (
                                <div key={fact.label} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
                                    <dt className="flex items-center gap-2 text-[10px] font-medium tracking-[0.22em] text-white/60 uppercase">
                                        {fact.dot && <span className="size-2 rounded-full" style={{ backgroundColor: fact.dot }} aria-hidden />}
                                        {fact.label}
                                    </dt>
                                    <dd className="mt-1.5 text-2xl font-medium tracking-[-0.01em] text-white tabular-nums">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
