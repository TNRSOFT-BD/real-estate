import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { cn } from '@/lib/utils';
import { type ContactFaq, type ContactHero } from '@/types/contact';
import { useState } from 'react';

interface ContactFaqProps {
    faqs: ContactFaq[];
    hero: ContactHero;
}

export default function ContactFaq({ faqs, hero }: ContactFaqProps) {
    const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

    return (
        <section id="faq" aria-labelledby="faq-title" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 lg:px-8 lg:py-16">
            <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <SectionLabel withLine={false}>{hero.faq_badge ?? 'Questions'}</SectionLabel>
                <h2
                    id="faq-title"
                    className="text-ink mt-6 text-3xl leading-tight font-medium tracking-[-0.02em] text-balance max-sm:text-2xl sm:text-4xl"
                >
                    {hero.faq_title ?? 'Frequently asked questions'}
                </h2>
                {hero.faq_description && <p className="text-ink-soft mt-4 max-w-xl text-sm leading-relaxed">{hero.faq_description}</p>}
            </Reveal>

            <Reveal delay={120} className="mx-auto mt-10 max-w-4xl">
                <ul className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openId === faq.id;
                        const panelId = `faq-panel-${faq.id}`;
                        const buttonId = `faq-trigger-${faq.id}`;

                        return (
                            <li key={faq.id}>
                                <GlassPanel strong={isOpen} className="overflow-hidden">
                                    <h3>
                                        <button
                                            type="button"
                                            id={buttonId}
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            onClick={() => setOpenId(isOpen ? null : faq.id)}
                                            className="group text-ink hover:text-ink flex w-full items-start gap-5 p-5 text-left transition-colors sm:gap-7 sm:p-6"
                                        >
                                            <span className="text-ink-soft mt-1 text-[11px] font-medium tracking-[0.2em] tabular-nums">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>

                                            <span className="flex-1 text-base font-medium text-balance sm:text-lg">{faq.question}</span>

                                            <span
                                                aria-hidden
                                                className={cn(
                                                    'relative flex size-8 shrink-0 items-center justify-center rounded-full transition-colors',
                                                    isOpen ? 'bg-ink text-canvas' : 'bg-glass-strong text-ink',
                                                )}
                                            >
                                                <span className="absolute top-1/2 left-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                                                <span
                                                    className={cn(
                                                        'absolute top-1/2 left-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300 motion-reduce:transition-none',
                                                        isOpen && 'scale-y-0',
                                                    )}
                                                />
                                            </span>
                                        </button>
                                    </h3>

                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={buttonId}
                                        className={cn(
                                            'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-ink-soft px-5 pb-6 pl-11 text-sm leading-relaxed sm:px-6 sm:pl-14 sm:text-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </li>
                        );
                    })}
                </ul>
            </Reveal>
        </section>
    );
}
