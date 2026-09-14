import { type PublicProject } from '@/types/project';
import { ExternalLink } from 'lucide-react';

export function mapEmbedUrl(project: PublicProject): string | null {
    const url = project.google_map_url?.trim();

    if (url && /(\/maps\/embed|output=embed|[?&]q=)/i.test(url)) {
        return url.startsWith('http') ? url : `https://${url}`;
    }

    if (project.latitude && project.longitude) {
        return `https://www.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`;
    }

    const query = [project.location_address, project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');

    if (query) {
        return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
    }

    return null;
}

export default function ProjectLocation({ project }: { project: PublicProject }) {
    const embed = mapEmbedUrl(project);

    if (!embed && !project.google_map_url) {
        return null;
    }

    return (
        <div className="border-line overflow-hidden rounded-2xl border">
            {embed ? (
                <iframe
                    src={embed}
                    title={`${project.title} location`}
                    className="h-[360px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            ) : null}

            {project.google_map_url && (
                <a
                    href={project.google_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:bg-glass border-line flex items-center justify-between gap-4 border-t px-5 py-4 text-sm font-medium transition-colors"
                >
                    Open in Google Maps
                    <ExternalLink className="size-4" />
                </a>
            )}
        </div>
    );
}
