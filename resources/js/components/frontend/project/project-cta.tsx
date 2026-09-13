import Reveal from '@/components/frontend/glass/reveal';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function ProjectCta() {
    const { name } = usePage<SharedData>().props;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:pb-20 lg:px-8 lg:pb-24" aria-labelledby="project-cta-title">
            <Reveal>
                <div className="bg-ink text-canvas rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20">
                    <span className="text-canvas/60 inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] uppercase">
                        <span aria-hidden className="bg-canvas/30 h-px w-8" />
                        Ready to discover
                    </span>

                    <h2
                        id="project-cta-title"
                        className="text-canvas mx-auto mt-6 max-w-3xl text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-4xl lg:text-5xl"
                    >
                        Your next address awaits
                    </h2>

                    <p className="text-canvas/70 mx-auto mt-5 max-w-xl text-base leading-relaxed">
                        Explore the project in detail or speak with the {name} team for a private consultation.
                    </p>

                    <Link
                        href="/contact"
                        className="bg-canvas text-ink group mt-9 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium transition-opacity hover:opacity-90"
                    >
                        Request a Consultation
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </Reveal>
        </section>
    );
}
