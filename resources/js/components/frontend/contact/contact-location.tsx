import ContactMap from '@/components/frontend/contact/contact-map';
import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { type ContactHero, type ContactLocation } from '@/types/contact';
import { ArrowUpRight, Clock, Mail, Phone } from 'lucide-react';

interface ContactLocationProps {
    locations: ContactLocation[];
    hero: ContactHero;
}

function parseHours(hours: string[] | string | null | undefined): string[] {
    if (!hours) {
        return [];
    }

    return Array.isArray(hours) ? hours : [hours];
}

function isLinkText(value: string | null | undefined): boolean {
    return value ? /^https?:\/\//i.test(value) : false;
}

export default function ContactLocation({ locations, hero }: ContactLocationProps) {
    const primary = locations.find((location) => location.is_primary) ?? locations[0];

    if (!primary) {
        return null;
    }

    const others = locations.filter((location) => location.id !== primary.id);

    return (
        <section id="locations" aria-labelledby="locations-title" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 lg:px-8 lg:py-16">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.location_badge ?? 'Visit us'}</SectionLabel>
                <h2
                    id="locations-title"
                    className="text-ink mt-7 text-3xl leading-tight font-medium tracking-[-0.02em] text-balance max-sm:text-2xl sm:text-4xl"
                >
                    {hero.location_title ?? 'Find us'}
                </h2>
                {hero.location_description && <p className="text-ink-soft mt-5 max-w-xl text-sm leading-relaxed">{hero.location_description}</p>}
            </Reveal>

            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
                <Reveal className="lg:col-span-5">
                    <div className="flex flex-col gap-5">
                        <GlassPanel strong className="p-7 sm:p-8">
                            <h3 className="text-ink text-xl font-medium tracking-[-0.01em] max-sm:text-lg sm:text-2xl">
                                {primary.google_maps_url ? (
                                    <a
                                        href={primary.google_maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 transition-colors hover:opacity-70"
                                    >
                                        {primary.name}
                                        <ArrowUpRight className="text-ink-soft size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                ) : (
                                    primary.name
                                )}
                            </h3>

                            {!isLinkText(primary.address) && (
                                <address className="text-ink-soft mt-3 max-w-sm text-sm leading-relaxed not-italic">
                                    {primary.address}
                                    {primary.city && <span className="block">{primary.city}</span>}
                                </address>
                            )}

                            {primary.description && <p className="text-ink-soft mt-3 max-w-sm text-sm leading-relaxed">{primary.description}</p>}

                            {(primary.phone || primary.email) && (
                                <div className="mt-7 flex flex-col gap-3 text-sm">
                                    {primary.phone && (
                                        <a
                                            href={`tel:${primary.phone}`}
                                            className="text-ink-soft hover:text-ink inline-flex items-center gap-3 transition-colors"
                                        >
                                            <Phone className="size-4 shrink-0" aria-hidden />
                                            {primary.phone}
                                        </a>
                                    )}
                                    {primary.email && (
                                        <a
                                            href={`mailto:${primary.email}`}
                                            className="text-ink-soft hover:text-ink inline-flex items-center gap-3 break-all transition-colors"
                                        >
                                            <Mail className="size-4 shrink-0" aria-hidden />
                                            {primary.email}
                                        </a>
                                    )}
                                </div>
                            )}

                            {parseHours(primary.business_hours).length > 0 && (
                                <div className="border-line mt-8 border-t pt-6">
                                    <p className="text-ink-soft flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] uppercase">
                                        <Clock className="size-4 shrink-0" aria-hidden />
                                        Business hours
                                    </p>
                                    <ul className="text-ink-soft mt-4 space-y-2 text-sm">
                                        {parseHours(primary.business_hours).map((line) => (
                                            <li key={line}>{line}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </GlassPanel>

                        {others.length > 0 && (
                            <GlassPanel className="p-7 sm:p-8">
                                <p className="text-ink-soft text-[11px] font-medium tracking-[0.28em] uppercase">Other offices</p>
                                <ul className="border-line mt-5 border-t">
                                    {others.map((location) => (
                                        <li key={location.id} className="border-line border-b py-5 last:border-b-0">
                                            <h4 className="text-ink font-medium">{location.name}</h4>
                                            {!isLinkText(location.address) && (
                                                <p className="text-ink-soft mt-1 text-sm leading-relaxed">{location.address}</p>
                                            )}
                                            {location.description && (
                                                <p className="text-ink-soft mt-1 text-sm leading-relaxed">{location.description}</p>
                                            )}
                                            {(location.phone || location.email) && (
                                                <div className="mt-2 flex flex-col gap-1 text-sm">
                                                    {location.phone && (
                                                        <a href={`tel:${location.phone}`} className="text-ink-soft hover:text-ink transition-colors">
                                                            {location.phone}
                                                        </a>
                                                    )}
                                                    {location.email && (
                                                        <a
                                                            href={`mailto:${location.email}`}
                                                            className="text-ink-soft hover:text-ink break-all transition-colors"
                                                        >
                                                            {location.email}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </GlassPanel>
                        )}
                    </div>
                </Reveal>

                <Reveal delay={120} className="lg:col-span-7">
                    <ContactMap location={primary} />
                </Reveal>
            </div>
        </section>
    );
}
