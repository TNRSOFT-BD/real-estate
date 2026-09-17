import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import { type ContactHero } from '@/types/contact';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface ContactClosingProps {
    hero: ContactHero;
}

export default function ContactClosing({ hero }: ContactClosingProps) {
    if (!hero.closing_title && !hero.closing_badge && !hero.closing_description) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:pb-12 lg:px-8 lg:pb-16" aria-labelledby="contact-closing-title">
            <Reveal>
                <GlassPanel strong className="p-8 sm:p-12 lg:p-16">
                    <span className="text-ink-soft text-[11px] font-medium tracking-[0.28em] uppercase">
                        {hero.closing_badge ?? 'Ready to start'}
                    </span>

                    <h2
                        id="contact-closing-title"
                        className="text-ink mt-8 max-w-3xl text-4xl leading-[1.05] font-medium tracking-[-0.02em] text-balance max-sm:text-3xl sm:text-5xl lg:text-6xl"
                    >
                        {hero.closing_title ?? 'Let us create something worth remembering.'}
                    </h2>

                    {hero.closing_description && (
                        <p className="text-ink-soft mt-7 max-w-xl text-base leading-relaxed sm:text-lg">{hero.closing_description}</p>
                    )}

                    <div className="mt-11">
                        <Link
                            href="#contact-form"
                            className="group bg-ink text-canvas inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium transition-opacity hover:opacity-90"
                        >
                            Contact our team
                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </GlassPanel>
            </Reveal>
        </section>
    );
}
