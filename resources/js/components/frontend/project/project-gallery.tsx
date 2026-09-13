import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { humanizeLabel } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type ProjectGalleryImage } from '@/types/project';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="project-gallery-title">
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <Reveal>
                        <SectionLabel>Gallery</SectionLabel>
                    </Reveal>
                    <Reveal delay={80}>
                        <h2 id="project-gallery-title" className="text-ink mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl">
                            A closer look
                        </h2>
                    </Reveal>
                </div>

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

            <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
                {filtered.map((image, index) => (
                    <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                            'group border-line relative overflow-hidden rounded-xl border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                            index === 0 && 'col-span-2 row-span-2',
                        )}
                        aria-label={image.caption ?? `Open image ${index + 1}`}
                    >
                        <img
                            src={mediaUrl(image.image_path) ?? ''}
                            alt={image.alt_text ?? image.caption ?? ''}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        {image.caption && (
                            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                                {image.caption}
                            </span>
                        )}
                    </button>
                ))}
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
        </section>
    );
}
