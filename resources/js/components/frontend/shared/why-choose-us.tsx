import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { whyChooseUsIconMap } from '@/lib/why-choose-us-icons';
import { Building2, CreditCard, Headset, MapPin, ShieldCheck, Star, type LucideIcon } from 'lucide-react';

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

export default function WhyChooseUs({ eyebrow, title, description, features }: WhyChooseUsProps) {
    if (features.length === 0) {
        return null;
    }

    const heading = title?.trim() || DEFAULT_TITLE;
    const copy = description?.trim() || DEFAULT_DESCRIPTION;
    const count = String(features.length).padStart(2, '0');

    return (
        <section
            className="mx-auto w-full max-w-7xl px-4 pt-12 pb-4 min-[900px]:pt-16 min-[900px]:pb-6 lg:px-8"
            aria-labelledby="why-choose-us-title"
        >
            <div className="border-ink/80 flex items-center justify-between gap-4 border-t-2 pt-4">
                <SectionLabel withLine={false}>{eyebrow?.trim() || 'Why Choose Us'}</SectionLabel>
                <span className="text-ink-soft text-[11px] font-medium tracking-[0.28em] uppercase tabular-nums">{count} Reasons</span>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                    <Reveal>
                        <h2
                            id="why-choose-us-title"
                            className="text-ink text-[clamp(2.1rem,3.9vw+1rem,3.5rem)] leading-[1.06] font-medium tracking-[-0.02em] text-balance max-sm:text-2xl"
                        >
                            {heading}
                        </h2>
                    </Reveal>
                </div>

                <div className="lg:col-span-5 lg:pt-3">
                    <Reveal delay={120}>
                        <p className="text-ink-soft max-w-md text-justify text-[1.05rem] leading-[1.75] lg:ml-auto">{copy}</p>
                    </Reveal>
                </div>
            </div>

            <ol className="mt-14 grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                    const Icon = (feature.icon ? whyChooseUsIconMap[feature.icon] : undefined) ?? FEATURE_ICONS[index % FEATURE_ICONS.length];

                    return (
                        <li key={`${feature.title}-${index}`} className="border-line group border-t">
                            <Reveal delay={index * 70}>
                                <div className="py-9">
                                    <div className="flex items-start justify-between gap-4">
                                        <span
                                            aria-hidden
                                            className="text-ink/15 group-hover:text-ink text-5xl leading-none font-medium tabular-nums transition-colors duration-300 motion-reduce:transition-none"
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <span className="border-line text-ink group-hover:bg-ink group-hover:text-canvas inline-flex size-10 shrink-0 items-center justify-center border transition-colors duration-300 motion-reduce:transition-none">
                                            <Icon className="size-4" />
                                        </span>
                                    </div>

                                    <h3 className="text-ink mt-8 text-xl font-medium tracking-[-0.01em] max-sm:text-lg">{feature.title}</h3>

                                    {feature.description && (
                                        <p className="text-ink-soft mt-3 max-w-sm text-justify text-sm leading-relaxed">{feature.description}</p>
                                    )}
                                </div>
                            </Reveal>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
