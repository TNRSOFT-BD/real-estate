import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type PublicProject } from '@/types/project';
import { ExternalLink } from 'lucide-react';

export default function ProjectDeveloper({ project }: { project: PublicProject }) {
    if (!project.developer_name && !project.developer_website) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:pb-20 lg:px-8 lg:pb-24" aria-labelledby="project-developer-title">
            <div className="border-line bg-glass/40 rounded-2xl border p-8 sm:p-12">
                <Reveal>
                    <SectionLabel>Developer</SectionLabel>
                </Reveal>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <h2 id="project-developer-title" className="text-ink text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl">
                            {project.developer_name ?? 'Project developer'}
                        </h2>
                    </div>

                    {project.developer_website && (
                        <a
                            href={project.developer_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group text-ink inline-flex items-center gap-2 text-sm font-medium"
                        >
                            <span className="border-line group-hover:border-ink border-b pb-1 transition-colors">Visit website</span>
                            <ExternalLink className="size-4" />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
