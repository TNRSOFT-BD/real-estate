import ContactReveal from '@/components/frontend/contact/contact-reveal';
import { Button } from '@/components/ui/button';
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
        <section className="bg-primary text-primary-foreground relative overflow-hidden" aria-labelledby="contact-closing-title">
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px]"
            />
            <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:py-24 lg:px-8 lg:py-32">
                <ContactReveal className="max-w-4xl">
                    <span className="text-primary-foreground/60 text-[11px] font-medium tracking-[0.28em] uppercase">
                        {hero.closing_badge ?? 'Ready to start'}
                    </span>

                    <h2
                        id="contact-closing-title"
                        className="mt-8 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                    >
                        {hero.closing_title ?? 'Let us create something worth remembering.'}
                    </h2>

                    {hero.closing_description && (
                        <p className="text-primary-foreground/70 mt-7 max-w-xl text-base leading-relaxed sm:text-lg">{hero.closing_description}</p>
                    )}

                    <div className="mt-12">
                        <Button asChild size="lg" className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-none px-7 shadow-sm hover:shadow-md">
                            <Link href="#contact-form">
                                Contact our team
                                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </ContactReveal>
            </div>
        </section>
    );
}
