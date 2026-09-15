import Reveal from '@/components/frontend/glass/reveal';
import { Building2, CreditCard, Headset, MapPin, ShieldCheck, Star, type LucideIcon } from 'lucide-react';

export interface WhyChooseUsFeature {
    title: string;
    description?: string | null;
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

export default function WhyChooseUs({ eyebrow, title, description, features }: WhyChooseUsProps) {
    if (features.length === 0) {
        return null;
    }

    const heading = title?.trim() || DEFAULT_TITLE;
    const copy = description?.trim() || DEFAULT_DESCRIPTION;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="why-choose-us-title">
            <div className="border-line border-t pt-12 lg:pt-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
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
                                className="text-ink mt-6 text-4xl leading-[1.04] font-medium tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
                            >
                                {heading}
                            </h2>
                        </Reveal>
                    </div>

                    <Reveal delay={140}>
                        <p className="text-ink-soft max-w-md text-base leading-relaxed">{copy}</p>
                    </Reveal>
                </div>

                <dl className="border-line bg-line mt-14 grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];

                        return (
                            <Reveal key={`${feature.title}-${index}`} delay={index * 40} className="h-full">
                                <div className="group bg-canvas hover:bg-ink relative flex h-full flex-col p-7 transition-colors duration-300 sm:p-8">
                                    <span
                                        aria-hidden
                                        className="text-ink-soft/25 group-hover:text-canvas/25 absolute top-6 right-6 text-4xl leading-none font-medium tabular-nums transition-colors sm:top-7 sm:right-7"
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <span
                                        className="border-line text-ink group-hover:border-canvas/25 group-hover:text-canvas inline-flex size-11 shrink-0 items-center justify-center border transition-colors"
                                        aria-hidden
                                    >
                                        <Icon className="size-5" />
                                    </span>

                                    <dt className="text-ink group-hover:text-canvas mt-8 text-xl font-medium tracking-[-0.01em] transition-colors">
                                        {feature.title}
                                    </dt>
                                    {feature.description && (
                                        <dd className="text-ink-soft group-hover:text-canvas/70 mt-3 text-sm leading-relaxed transition-colors">
                                            {feature.description}
                                        </dd>
                                    )}
                                </div>
                            </Reveal>
                        );
                    })}
                </dl>
            </div>
        </section>
    );
}
