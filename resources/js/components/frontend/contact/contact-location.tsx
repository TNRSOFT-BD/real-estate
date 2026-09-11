import ContactMap from '@/components/frontend/contact/contact-map';
import ContactReveal from '@/components/frontend/contact/contact-reveal';
import ContactSectionLabel from '@/components/frontend/contact/contact-section-label';
import { type ContactHero, type ContactLocation } from '@/types/contact';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

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

export default function ContactLocation({ locations, hero }: ContactLocationProps) {
    const primary = locations.find((location) => location.is_primary) ?? locations[0];

    if (!primary) {
        return null;
    }

    const others = locations.filter((location) => location.id !== primary.id);

    return (
        <section id="locations" aria-labelledby="locations-title" className="border-b">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <ContactReveal className="max-w-2xl">
                    <ContactSectionLabel>{hero.location_badge ?? 'Visit us'}</ContactSectionLabel>
                    <h2 id="locations-title" className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        {hero.location_title ?? 'Find us'}
                    </h2>
                    {hero.location_description && (
                        <p className="text-muted-foreground mt-5 max-w-xl text-sm leading-relaxed">{hero.location_description}</p>
                    )}
                </ContactReveal>

                <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <ContactReveal className="lg:col-span-5">
                        <div className="border-border border-t pt-7">
                            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{primary.name}</h3>

                            <address className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed not-italic">
                                {primary.address}
                                {primary.city && <span className="block">{primary.city}</span>}
                            </address>

                            {(primary.phone || primary.email || primary.google_maps_url) && (
                                <div className="mt-7 flex flex-col gap-3 text-sm">
                                    {primary.phone && (
                                        <a
                                            href={`tel:${primary.phone}`}
                                            className="text-muted-foreground hover:text-primary inline-flex items-center gap-3 transition-colors"
                                        >
                                            <Phone className="size-4 shrink-0" aria-hidden />
                                            {primary.phone}
                                        </a>
                                    )}
                                    {primary.email && (
                                        <a
                                            href={`mailto:${primary.email}`}
                                            className="text-muted-foreground hover:text-primary inline-flex items-center gap-3 break-all transition-colors"
                                        >
                                            <Mail className="size-4 shrink-0" aria-hidden />
                                            {primary.email}
                                        </a>
                                    )}
                                    {primary.google_maps_url && (
                                        <a
                                            href={primary.google_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary inline-flex items-center gap-3 transition-colors"
                                        >
                                            <MapPin className="size-4 shrink-0" aria-hidden />
                                            Get directions
                                        </a>
                                    )}
                                </div>
                            )}

                            {parseHours(primary.business_hours).length > 0 && (
                                <div className="border-border mt-8 border-t pt-6">
                                    <p className="text-muted-foreground flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] uppercase">
                                        <Clock className="size-4 shrink-0" aria-hidden />
                                        Business hours
                                    </p>
                                    <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                                        {parseHours(primary.business_hours).map((line) => (
                                            <li key={line}>{line}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {others.length > 0 && (
                            <div className="mt-12">
                                <p className="text-muted-foreground text-[11px] font-medium tracking-[0.28em] uppercase">Other offices</p>
                                <ul className="border-border mt-5 border-t">
                                    {others.map((location) => (
                                        <li key={location.id} className="border-border border-b py-5">
                                            <h4 className="font-medium">{location.name}</h4>
                                            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{location.address}</p>
                                            {(location.phone || location.email) && (
                                                <div className="mt-2 flex flex-col gap-1 text-sm">
                                                    {location.phone && (
                                                        <a
                                                            href={`tel:${location.phone}`}
                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            {location.phone}
                                                        </a>
                                                    )}
                                                    {location.email && (
                                                        <a
                                                            href={`mailto:${location.email}`}
                                                            className="text-muted-foreground hover:text-primary break-all transition-colors"
                                                        >
                                                            {location.email}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </ContactReveal>

                    <ContactReveal delay={120} className="lg:col-span-7">
                        <ContactMap location={primary} />
                    </ContactReveal>
                </div>
            </div>
        </section>
    );
}
