import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type PublicProject } from '@/types/project';
import { ExternalLink } from 'lucide-react';

function embedUrl(url: string): string | null {
    const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);

    if (youtube) {
        return `https://www.youtube.com/embed/${youtube[1]}`;
    }

    const vimeo = url.match(/vimeo\.com\/(\d+)/);

    if (vimeo) {
        return `https://player.vimeo.com/video/${vimeo[1]}`;
    }

    return null;
}

export default function ProjectVideo({ project }: { project: PublicProject }) {
    if (!project.promo_video_url) {
        return null;
    }

    const embed = embedUrl(project.promo_video_url);

    return (
        <section className="border-line border-y" aria-labelledby="project-video-title">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <Reveal>
                    <SectionLabel>Promotional video</SectionLabel>
                </Reveal>
                <Reveal delay={80}>
                    <h2 id="project-video-title" className="text-ink mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl">
                        See it in motion
                    </h2>
                </Reveal>

                <Reveal delay={120}>
                    <div className="border-line mt-10 overflow-hidden rounded-2xl border">
                        {embed ? (
                            <div className="aspect-video w-full">
                                <iframe
                                    src={embed}
                                    title={`${project.title} promotional video`}
                                    className="size-full"
                                    loading="lazy"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <a
                                href={project.promo_video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink hover:bg-glass flex items-center justify-between gap-4 p-8 transition-colors"
                            >
                                <span className="text-lg font-medium">Watch the promotional video</span>
                                <ExternalLink className="size-5" />
                            </a>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
