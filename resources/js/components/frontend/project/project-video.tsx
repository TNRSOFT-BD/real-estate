import { type PublicProject } from '@/types/project';
import { ExternalLink } from 'lucide-react';
import ProjectSectionHeading from './project-section-heading';

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
        <div>
            <ProjectSectionHeading id="project-video-title">Property Video</ProjectSectionHeading>

            <div className="border-line overflow-hidden rounded-2xl border">
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
        </div>
    );
}
