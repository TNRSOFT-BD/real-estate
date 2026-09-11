import ContactReveal from '@/components/frontend/contact/contact-reveal';
import ContactSectionLabel from '@/components/frontend/contact/contact-section-label';
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
        <section id="faq" aria-labelledby="faq-title" className="border-b">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <ContactReveal className="lg:col-span-4">
                        <div className="lg:sticky lg:top-28">
                            <ContactSectionLabel>{hero.faq_badge ?? 'Questions'}</ContactSectionLabel>
                            <h2 id="faq-title" className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                {hero.faq_title ?? 'Frequently asked questions'}
                            </h2>
                            {hero.faq_description && (
                                <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed">{hero.faq_description}</p>
                            )}
                        </div>
                    </ContactReveal>

                    <ContactReveal delay={120} className="lg:col-span-8">
                        <ul className="border-border border-t">
                            {faqs.map((faq, index) => {
                                const isOpen = openId === faq.id;
                                const panelId = `faq-panel-${faq.id}`;
                                const buttonId = `faq-trigger-${faq.id}`;

                                return (
                                    <li key={faq.id} className="border-border border-b">
                                        <h3>
                                            <button
                                                type="button"
                                                id={buttonId}
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                onClick={() => setOpenId(isOpen ? null : faq.id)}
                                                className="group hover:text-primary flex w-full items-start gap-6 py-6 text-left transition-colors sm:gap-8 sm:py-7"
                                            >
                                                <span
                                                    aria-hidden
                                                    className="text-muted-foreground mt-1 text-[11px] font-medium tracking-[0.2em] tabular-nums"
                                                >
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>

                                                <span className="flex-1 text-base font-medium text-balance sm:text-lg">{faq.question}</span>

                                                <span
                                                    aria-hidden
                                                    className="text-muted-foreground group-hover:text-primary relative mt-2.5 size-4 shrink-0 transition-colors"
                                                >
                                                    <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
                                                    <span
                                                        className={cn(
                                                            'absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 motion-reduce:transition-none',
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
                                                <p className="text-muted-foreground pr-8 pb-7 pl-11 text-sm leading-relaxed sm:pl-14 sm:text-base">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </ContactReveal>
                </div>
            </div>
        </section>
    );
}
