import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type PublicProjectCard } from '@/types/project';
import { Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

interface ProjectCardProps {
    project: PublicProjectCard;
    priority?: boolean;
    showFeaturedBadge?: boolean;
}

export default function ProjectCard({ project, priority = false, showFeaturedBadge = true }: ProjectCardProps) {
    const image = mediaUrl(project.hero_banner);
    const location = [project.location_area, project.location_city].filter(Boolean).join(', ') || project.location_country || null;

    return (
        <Link
            href={`/projects/${project.slug}`}
            aria-label={project.title}
            className={cn(
                'group border-line relative block aspect-[4/5] overflow-hidden border bg-ink',
                'transition-colors duration-500 hover:border-ink/25',
                'focus-visible:ring-ink focus-visible:ring-offset-canvas focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
        >
            {image ? (
                <img
                    src={image}
                    alt={project.hero_banner_alt ?? project.title}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    className={cn(
                        'absolute inset-0 size-full object-cover will-change-transform',
                        'transition-[transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                        'lg:group-hover:scale-[1.045] lg:group-hover:blur-[4px]',
                        'motion-reduce:transition-none motion-reduce:lg:group-hover:scale-100 motion-reduce:lg:group-hover:blur-0',
                    )}
                />
            ) : (
                <div aria-hidden className="bg-ink absolute inset-0" />
            )}

            {/* Static depth gradient keeps the image grounded. */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Hover deepens the image for the information reveal. */}
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5 opacity-0 transition-opacity duration-700 ease-out lg:group-hover:opacity-100 motion-reduce:transition-none"
            />

            {project.is_featured && showFeaturedBadge && (
                <span className="bg-canvas/90 text-ink absolute top-4 left-4 px-2.5 py-1 text-[10px] font-medium tracking-[0.22em] uppercase backdrop-blur-sm">
                    Featured
                </span>
            )}

            {project.status && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 border border-white/25 bg-black/25 px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: project.status.color ?? '#ffffff' }} aria-hidden />
                    {project.status.name}
                </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h2 className="text-lg leading-tight font-semibold tracking-[-0.01em] text-white text-balance drop-shadow-sm sm:text-xl">{project.title}</h2>

                <div
                    className={cn(
                        'mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/75',
                        'transition-all duration-500 ease-out',
                        'lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100',
                        'motion-reduce:transition-none motion-reduce:lg:translate-y-0 motion-reduce:lg:opacity-100',
                    )}
                >
                    {project.type && <span className="font-medium tracking-[0.16em] uppercase">{project.type.name}</span>}
                    {location && (
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5" aria-hidden />
                            {location}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
