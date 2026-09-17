import { mediaUrl } from '@/lib/media';
import { type PublicProject } from '@/types/project';
import { Link } from '@inertiajs/react';
import { ArrowRight, Download, MapPin } from 'lucide-react';

export default function ProjectHero({ project }: { project: PublicProject }) {
    const image = mediaUrl(project.hero_banner);
    const location = [project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');

    return (
        <section className="relative flex min-h-[78vh] items-end overflow-hidden sm:min-h-[88vh]" aria-labelledby="project-title">
            {image ? (
                <img src={image} alt={project.hero_banner_alt ?? project.title} className="absolute inset-0 size-full object-cover" loading="eager" />
            ) : (
                <div aria-hidden className="absolute inset-0 bg-neutral-900" />
            )}

            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-36 pb-12 sm:pt-44 sm:pb-16 lg:px-8">
                <div className="flex flex-wrap items-center gap-3">
                    {project.type && (
                        <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-[0.22em] text-white uppercase backdrop-blur">
                            {project.type.name}
                        </span>
                    )}
                    {project.status && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-[0.22em] text-white uppercase backdrop-blur">
                            <span className="size-2 rounded-full" style={{ backgroundColor: project.status.color ?? '#ffffff' }} aria-hidden />
                            {project.status.name}
                        </span>
                    )}
                </div>

                <h1
                    id="project-title"
                    className="mt-6 max-w-5xl text-4xl leading-[1.03] font-medium tracking-[-0.02em] text-balance text-white max-sm:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl"
                >
                    {project.title}
                </h1>

                {location && (
                    <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/80 sm:text-base">
                        <MapPin className="size-4 shrink-0" />
                        {location}
                    </p>
                )}

                {project.short_description && (
                    <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">{project.short_description}</p>
                )}

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-90"
                    >
                        Request a Consultation
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    {project.brochure_pdf && (
                        <a
                            href={mediaUrl(project.brochure_pdf) ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                        >
                            <Download className="size-4" />
                            Download Brochure
                        </a>
                    )}

                    {project.google_map_url && (
                        <a
                            href={project.google_map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                        >
                            <MapPin className="size-4" />
                            Open in Google Maps
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
