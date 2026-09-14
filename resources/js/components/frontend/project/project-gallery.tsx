import { humanizeLabel } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type ProjectGalleryImage } from '@/types/project';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ProjectSectionHeading from './project-section-heading';

export default function ProjectGallery({ images }: { images: ProjectGalleryImage[] }) {
    const validImages = useMemo(() => (images ?? []).filter((image) => Boolean(image.image_path)), [images]);

    const types = useMemo(() => {
        const unique = new Set<string>();

        validImages.forEach((image) => {
            if (image.type) {
                unique.add(image.type);
            }
        });

        return Array.from(unique);
    }, [validImages]);

    const [filter, setFilter] = useState('all');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const filtered = useMemo(
        () => (filter === 'all' ? validImages : validImages.filter((image) => image.type === filter)),
        [validImages, filter],
    );

    // Pack the bento with square tiles. A 4-column grid only fills when
    // (count + 3 * large) is divisible by 4, so the number of 2x2 tiles is
    // count % 4 (and count % 2 for the 2-column grid). Tiles are picked in a
    // stable pseudo-random order so it looks random but never shifts on re-render.
    const { rankOf, largeDesktop, largeMobile, single } = useMemo(() => {
        const count = filtered.length;

        if (count === 0) {
            return { rankOf: new Map<number, number>(), largeDesktop: 0, largeMobile: 0, single: false };
        }

        const order = [...filtered].sort((a, b) => ((a.id * 9301 + 49297) % 233280) - ((b.id * 9301 + 49297) % 233280));
        const rankMap = new Map<number, number>();
        order.forEach((image, index) => rankMap.set(image.id, index));

        const cap = Math.max(0, Math.floor(count / 2));

        return {
            rankOf: rankMap,
            largeDesktop: Math.min(count % 4, cap),
            largeMobile: Math.min(count % 2, cap),
            single: count === 1,
        };
    }, [filtered]);

    const close = useCallback(() => setActiveIndex(null), []);
    const previous = useCallback(
        () => setActiveIndex((index) => (index === null ? null : (index - 1 + filtered.length) % filtered.length)),
        [filtered.length],
    );
    const next = useCallback(() => setActiveIndex((index) => (index === null ? null : (index + 1) % filtered.length)), [filtered.length]);

    useEffect(() => {
        if (activeIndex === null) {
            return;
        }

        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
            } else if (event.key === 'ArrowLeft') {
                previous();
            } else if (event.key === 'ArrowRight') {
                next();
            }
        };

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, [activeIndex, close, previous, next]);

    if (validImages.length === 0) {
        return null;
    }

    const active = activeIndex !== null ? filtered[activeIndex] : null;

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-6">
                <ProjectSectionHeading id="project-gallery-title" className="mb-0">
                    From Our Gallery
                </ProjectSectionHeading>

                {types.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter gallery">
                        {['all', ...types].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    setFilter(type);
                                    setActiveIndex(null);
                                }}
                                aria-pressed={filter === type}
                                className={cn(
                                    'rounded-full border px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase transition-colors',
                                    filter === type ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-soft hover:text-ink',
                                )}
                            >
                                {type === 'all' ? 'All' : humanizeLabel(type)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {filtered.map((image, index) => {
                    const rank = rankOf.get(image.id) ?? 0;
                    const largeMobileTile = !single && rank < largeMobile;
                    const largeDesktopTile = !single && rank < largeDesktop;
                    const isLarge = largeMobileTile || largeDesktopTile;

                    return (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                'group border-line relative aspect-square overflow-hidden rounded-2xl border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                                single && 'col-span-full',
                                largeMobileTile && 'col-span-2 row-span-2 sm:col-span-1 sm:row-span-1 lg:col-span-2 lg:row-span-2',
                                !largeMobileTile && largeDesktopTile && 'lg:col-span-2 lg:row-span-2',
                            )}
                            aria-label={image.caption ?? `Open image ${index + 1}`}
                        >
                            <img
                                src={mediaUrl(image.image_path) ?? ''}
                                alt={image.alt_text ?? image.caption ?? ''}
                                loading="lazy"
                                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            {image.caption && (
                                <span
                                    className={cn(
                                        'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-xs font-medium text-white transition-opacity',
                                        isLarge ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                                    )}
                                >
                                    {image.caption}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {active && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={close}
                >
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="absolute top-5 right-5 inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
                    >
                        <X className="size-5" />
                    </button>

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            previous();
                        }}
                        aria-label="Previous image"
                        className="absolute left-3 inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:left-6"
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
                        <img src={mediaUrl(active.image_path) ?? ''} alt={active.alt_text ?? active.caption ?? ''} className="max-h-[80vh] w-auto rounded-lg object-contain" />
                        {(active.caption || active.alt_text) && <figcaption className="mt-4 text-center text-sm text-white/80">{active.caption ?? active.alt_text}</figcaption>}
                    </figure>

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            next();
                        }}
                        aria-label="Next image"
                        className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:right-6"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
