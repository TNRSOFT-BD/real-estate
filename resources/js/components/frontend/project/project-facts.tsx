import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { formatDate, formatNumber } from '@/lib/format';
import { type PublicProject } from '@/types/project';
import { Activity, Building, Building2, CalendarClock, House, LandPlot, Layers, MapPin, Users, type LucideIcon } from 'lucide-react';

interface Fact {
    label: string;
    value: string;
    icon: LucideIcon;
}

export default function ProjectFacts({ project }: { project: PublicProject }) {
    const location = [project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');

    const facts: Fact[] = [
        project.type?.name ? { label: 'Project type', value: project.type.name, icon: Building2 } : null,
        project.status?.name ? { label: 'Status', value: project.status.name, icon: Activity } : null,
        project.total_land_area
            ? { label: 'Land area', value: formatNumber(project.total_land_area) ?? String(project.total_land_area), icon: LandPlot }
            : null,
        project.total_units != null ? { label: 'Total units', value: String(project.total_units), icon: House } : null,
        project.number_of_floors != null ? { label: 'Floors', value: String(project.number_of_floors), icon: Layers } : null,
        project.number_of_buildings != null ? { label: 'Buildings', value: String(project.number_of_buildings), icon: Building } : null,
        project.units_per_floor != null ? { label: 'Units per floor', value: String(project.units_per_floor), icon: Users } : null,
        project.handover_date ? { label: 'Handover', value: formatDate(project.handover_date) ?? '', icon: CalendarClock } : null,
        location ? { label: 'Location', value: location, icon: MapPin } : null,
    ].filter((fact): fact is Fact => fact !== null);

    if (facts.length === 0) {
        return null;
    }

    return (
        <section aria-label="Quick facts" className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
            <Reveal>
                <div className="border-line bg-glass-strong relative rounded-[1.75rem] border p-6 shadow-[0_30px_80px_-40px_rgba(20,18,15,0.35)] sm:p-10 lg:p-14">
                    <span aria-hidden className="border-ink/20 pointer-events-none absolute top-5 left-5 size-4 border-t border-l" />
                    <span aria-hidden className="border-ink/20 pointer-events-none absolute top-5 right-5 size-4 border-t border-r" />
                    <span aria-hidden className="border-ink/20 pointer-events-none absolute bottom-5 left-5 size-4 border-b border-l" />
                    <span aria-hidden className="border-ink/20 pointer-events-none absolute right-5 bottom-5 size-4 border-r border-b" />

                    <header className="border-line flex flex-wrap items-end justify-between gap-4 border-b pb-8">
                        <div>
                            <SectionLabel>At a glance</SectionLabel>
                            <h2 className="text-ink mt-5 text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl">The essentials</h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {project.status && (
                                <span className="border-line inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase">
                                    <span className="size-2 rounded-full" style={{ backgroundColor: project.status.color ?? undefined }} aria-hidden />
                                    {project.status.name}
                                </span>
                            )}
                            {project.project_code && (
                                <span className="text-ink-soft text-[11px] font-medium tracking-[0.24em] uppercase">Ref {project.project_code}</span>
                            )}
                        </div>
                    </header>

                    <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {facts.map((fact) => (
                            <div key={fact.label} className="border-line flex flex-col border-t py-7 pr-8">
                                <span className="border-line text-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden>
                                    <fact.icon className="size-5" />
                                </span>
                                <dt className="text-ink-soft mt-5 text-[11px] font-medium tracking-[0.24em] uppercase">{fact.label}</dt>
                                <dd className="text-ink mt-2 text-2xl font-medium tracking-[-0.02em] tabular-nums sm:text-3xl">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Reveal>
        </section>
    );
}
