import Reveal from '@/components/frontend/glass/reveal';
import { whyChooseUsIconMap } from '@/lib/why-choose-us-icons';
import { Building2, ChevronLeft, ChevronRight, CreditCard, Headset, MapPin, ShieldCheck, Star, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface WhyChooseUsFeature {
    title: string;
    description?: string | null;
    icon?: string | null;
}

export interface WhyChooseUsProps {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    features: WhyChooseUsFeature[];
}

const FEATURE_ICONS: LucideIcon[] = [MapPin, ShieldCheck, Building2, Star, CreditCard, Headset];

const DEFAULT_TITLE = 'Your Dream Home Our Commitment';
const DEFAULT_DESCRIPTION =
    'We go beyond just selling properties. We build lasting relationships by offering quality, trust and exceptional service — because your future matters.';

function getStep(track: HTMLOListElement): number {
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;

    if (first && second) {
        return second.offsetLeft - first.offsetLeft;
    }

    return first?.offsetWidth ?? track.clientWidth;
}

export default function WhyChooseUs({ eyebrow, title, description, features }: WhyChooseUsProps) {
    const trackRef = useRef<HTMLOListElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const sync = useCallback(() => {
        const el = trackRef.current;

        if (!el) {
            return;
        }

        const max = el.scrollWidth - el.clientWidth;

        setAtStart(el.scrollLeft <= 1);
        setAtEnd(el.scrollLeft >= max - 1);

        const step = getStep(el);
        const index = step > 0 ? Math.round(el.scrollLeft / step) : 0;

        setActiveIndex(Math.min(Math.max(index, 0), el.children.length - 1));
    }, []);

    useEffect(() => {
        const el = trackRef.current;

        if (!el) {
            return;
        }

        sync();

        const observer = new ResizeObserver(sync);
        observer.observe(el);

        return () => observer.disconnect();
    }, [sync]);

    const scrollByPanel = (direction: number) => {
        const el = trackRef.current;

        if (!el) {
            return;
        }

        const panel = el.children[0] as HTMLElement | undefined;
        const step = panel ? getStep(el) : el.clientWidth * 0.8;

        el.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    if (features.length === 0) {
        return null;
    }

    const heading = title?.trim() || DEFAULT_TITLE;
    const copy = description?.trim() || DEFAULT_DESCRIPTION;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-12 pb-2 sm:pt-16 sm:pb-3 lg:px-8 lg:pt-20 lg:pb-4" aria-labelledby="why-choose-us-title">
            <div className="border-line border-t pt-12 lg:pt-16">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <div className="max-w-2xl">
                        <Reveal>
                            <span className="text-ink-soft inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] uppercase">
                                <span aria-hidden className="bg-ink/30 h-px w-8 shrink-0" />
                                {eyebrow?.trim() || 'Why Choose Us'}
                            </span>
                        </Reveal>

                        <Reveal delay={80}>
                            <h2
                                id="why-choose-us-title"
                                className="text-ink mt-6 text-[clamp(2rem,3.4vw+1rem,2.75rem)] leading-[1.16] font-medium tracking-normal text-balance"
                            >
                                {heading}
                            </h2>
                        </Reveal>
                    </div>

                    <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-end lg:gap-6">
                        <Reveal delay={140}>
                            <p className="text-ink-soft max-w-md text-[1.05rem] leading-[1.75] lg:text-right">{copy}</p>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => scrollByPanel(-1)}
                                    disabled={atStart}
                                    aria-label="Show previous reason"
                                    className="border-line text-ink hover:border-ink hover:bg-ink hover:text-canvas inline-flex size-10 items-center justify-center border transition-colors disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ChevronLeft className="size-4" aria-hidden />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => scrollByPanel(1)}
                                    disabled={atEnd}
                                    aria-label="Show next reason"
                                    className="border-line text-ink hover:border-ink hover:bg-ink hover:text-canvas inline-flex size-10 items-center justify-center border transition-colors disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ChevronRight className="size-4" aria-hidden />
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </div>

                <ol
                    ref={trackRef}
                    onScroll={sync}
                    tabIndex={0}
                    aria-label="Reasons to choose us"
                    className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {features.map((feature, index) => {
                        const Icon = (feature.icon ? whyChooseUsIconMap[feature.icon] : undefined) ?? FEATURE_ICONS[index % FEATURE_ICONS.length];

                        return (
                            <li
                                key={`${feature.title}-${index}`}
                                className="border-line group relative flex w-[82%] shrink-0 snap-start flex-col border-l pt-8 pl-6 sm:w-[46%] lg:w-[23.5%]"
                            >
                                <span
                                    aria-hidden
                                    className="text-ink/15 group-hover:text-ink/40 text-5xl leading-none font-medium tabular-nums transition-colors"
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <span
                                    aria-hidden
                                    className="border-line text-ink group-hover:bg-ink group-hover:text-canvas mt-8 inline-flex size-11 shrink-0 items-center justify-center border transition-colors"
                                >
                                    <Icon className="size-5" />
                                </span>

                                <h3 className="text-ink mt-6 text-xl font-medium tracking-[-0.01em]">{feature.title}</h3>

                                {feature.description && <p className="text-ink-soft mt-3 text-sm leading-relaxed">{feature.description}</p>}
                            </li>
                        );
                    })}
                </ol>

                <div className="bg-line mt-2 h-px w-full overflow-hidden" role="presentation">
                    <div
                        className="bg-ink h-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
                        style={{ width: `${((activeIndex + 1) / features.length) * 100}%` }}
                    />
                </div>
            </div>
        </section>
    );
}
