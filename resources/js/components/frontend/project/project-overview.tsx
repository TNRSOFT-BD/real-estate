import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type PublicProject } from '@/types/project';

export default function ProjectOverview({ project }: { project: PublicProject }) {
    if (!project.short_description && !project.overview) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="project-overview-title">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                    <Reveal>
                        <SectionLabel>Overview</SectionLabel>
                    </Reveal>
                    <Reveal delay={80}>
                        <h2
                            id="project-overview-title"
                            className="text-ink mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl"
                        >
                            The project
                        </h2>
                    </Reveal>
                </div>

                <div className="lg:col-span-8">
                    {project.short_description && (
                        <Reveal>
                            <p className="text-ink text-xl leading-relaxed font-normal tracking-[-0.01em] sm:text-2xl">{project.short_description}</p>
                        </Reveal>
                    )}

                    {project.overview && (
                        <Reveal delay={120}>
                            <div
                                className="prose prose-neutral text-ink-soft prose-headings:text-ink prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-p:text-ink-soft prose-a:text-ink prose-a:underline prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-line prose-blockquote:text-ink-soft prose-hr:border-line prose-li:text-ink-soft mt-8 max-w-3xl"
                                dangerouslySetInnerHTML={{ __html: project.overview }}
                            />
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}
