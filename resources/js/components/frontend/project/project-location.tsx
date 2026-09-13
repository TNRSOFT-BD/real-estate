import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type PublicProject } from '@/types/project';
import { MapPin } from 'lucide-react';

export default function ProjectLocation({ project }: { project: PublicProject }) {
    const lines = [project.location_address, project.location_area, project.location_city, project.location_country].filter(Boolean);
    const coordinates =
        project.latitude && project.longitude ? `${Number(project.latitude).toFixed(5)}, ${Number(project.longitude).toFixed(5)}` : null;

    if (lines.length === 0 && !project.google_map_url && !coordinates) {
        return null;
    }

    return (
        <section className="border-line border-y" aria-labelledby="project-location-title">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <SectionLabel>Location</SectionLabel>
                        </Reveal>
                        <Reveal delay={80}>
                            <h2
                                id="project-location-title"
                                className="text-ink mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl"
                            >
                                Where it sits
                            </h2>
                        </Reveal>

                        {lines.length > 0 && (
                            <Reveal delay={120}>
                                <address className="text-ink-soft mt-8 text-lg leading-relaxed not-italic">
                                    {lines.map((line, index) => (
                                        <span key={index} className="block">
                                            {line}
                                        </span>
                                    ))}
                                </address>
                            </Reveal>
                        )}

                        {coordinates && <p className="text-ink-soft mt-4 text-sm tracking-wide">{coordinates}</p>}
                    </div>

                    <div className="flex items-end lg:col-span-7">
                        <Reveal delay={140} className="w-full">
                            <div className="border-line bg-glass/40 flex flex-col justify-between gap-8 rounded-2xl border p-8 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-ink text-xl font-medium tracking-[-0.01em]">Explore the neighbourhood</p>
                                    <p className="text-ink-soft mt-2 text-sm">Open the exact location in Google Maps.</p>
                                </div>

                                {project.google_map_url ? (
                                    <a
                                        href={project.google_map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-ink text-canvas inline-flex shrink-0 items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium transition-opacity hover:opacity-90"
                                    >
                                        <MapPin className="size-4" />
                                        Open in Google Maps
                                    </a>
                                ) : (
                                    <span className="text-ink-soft text-sm">Map link not available</span>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
