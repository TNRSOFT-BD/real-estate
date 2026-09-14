import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export interface ProjectSlide {
    id: number | string;
    src: string;
    alt: string;
    caption?: string | null;
}

export default function ProjectImageSlider({ slides }: { slides: ProjectSlide[] }) {
    const [index, setIndex] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const count = slides.length;

    const go = useCallback((next: number) => setIndex((current) => (current + next + count) % count), [count]);

    useEffect(() => {
        if (!lightbox) {
            return;
        }

        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setLightbox(false);
            } else if (event.key === 'ArrowLeft') {
                go(-1);
            } else if (event.key === 'ArrowRight') {
                go(1);
            }
        };

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, [lightbox, go]);

    if (count === 0) {
        return null;
    }

    const active = slides[index];

    return (
        <section aria-label="Project images" className="border-line border-b">
            <div className="group relative aspect-[3/2] max-h-[820px] w-full overflow-hidden sm:aspect-[16/9]">
                <button type="button" onClick={() => setLightbox(true)} className="block size-full cursor-zoom-in" aria-label="Open image viewer">
                    <img src={active.src} alt={active.alt} className="size-full object-cover" />
                </button>

                {active.caption && (
                    <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-sm text-white sm:p-7">{active.caption}</p>
                )}

                {count > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous image"
                            className="absolute top-1/2 left-4 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/60"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next image"
                            className="absolute top-1/2 right-4 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/60"
                        >
                            <ChevronRight className="size-6" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                            {slides.map((slide, i) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setIndex(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                    aria-current={i === index}
                                    className={cn('h-2 rounded-full transition-all', i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80')}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {lightbox && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightbox(false)}
                >
                    <button
                        type="button"
                        onClick={() => setLightbox(false)}
                        aria-label="Close"
                        className="absolute top-5 right-5 inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
                    >
                        <X className="size-5" />
                    </button>

                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    go(-1);
                                }}
                                aria-label="Previous image"
                                className="absolute left-3 inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:left-6"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    go(1);
                                }}
                                aria-label="Next image"
                                className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:right-6"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}

                    <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
                        <img src={active.src} alt={active.alt} className="max-h-[80vh] w-auto rounded-lg object-contain" />
                        {active.caption && <figcaption className="mt-4 text-center text-sm text-white/80">{active.caption}</figcaption>}
                    </figure>
                </div>
            )}
        </section>
    );
}
