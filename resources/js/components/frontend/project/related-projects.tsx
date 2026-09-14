import Reveal from '@/components/frontend/glass/reveal';
import { mediaUrl } from '@/lib/media';
import { type RelatedProject } from '@/types/project';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import ProjectSectionHeading from './project-section-heading';

export default function RelatedProjects({ projects }: { projects: RelatedProject[] }) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="related-projects-title">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-9 lg:px-8 lg:py-12">
                <Reveal>
                    <ProjectSectionHeading id="related-projects-title">Related Properties</ProjectSectionHeading>
                </Reveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => {
                        const image = mediaUrl(project.hero_banner);

                        return (
                            <Reveal key={project.id} delay={index * 60}>
                                <Link href={`/projects/${project.slug}`} className="group block">
                                    <div className="border-line relative aspect-4/3 w-full overflow-hidden rounded-2xl border">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={project.title}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                            />
                                        ) : (
                                            <div className="bg-muted size-full" />
                                        )}
                                        <span className="bg-canvas/90 text-ink absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                                            <ArrowUpRight className="size-4" />
                                        </span>
                                    </div>

                                    <div className="mt-5 flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-ink text-lg font-medium tracking-[-0.01em]">{project.title}</h3>
                                            {project.location_city && <p className="text-ink-soft mt-1 text-sm">{project.location_city}</p>}
                                        </div>
                                        {project.type && (
                                            <span className="text-ink-soft text-[11px] font-medium tracking-[0.18em] whitespace-nowrap uppercase">
                                                {project.type}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
