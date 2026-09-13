import { type ContactLocation } from '@/types/contact';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface ContactMapProps {
    location: ContactLocation;
}

export default function ContactMap({ location }: ContactMapProps) {
    const embedUrl = useMemo(() => {
        if (location.latitude && location.longitude) {
            return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`;
        }

        return null;
    }, [location.latitude, location.longitude]);

    const linkUrl = location.google_maps_url ?? embedUrl?.replace('&output=embed', '') ?? null;

    if (!embedUrl) {
        return (
            <div className="border-glass-border bg-glass-strong relative h-80 w-full overflow-hidden rounded-2xl border shadow-sm backdrop-blur-xl sm:h-[420px] lg:h-full lg:min-h-[460px]">
                <div className="flex size-full flex-col items-center justify-center gap-6 p-8 text-center">
                    <MapPin className="text-ink-soft size-5" aria-hidden />

                    <div>
                        <p className="text-ink-soft text-[11px] font-medium tracking-[0.28em] uppercase">{location.name}</p>
                        <p className="text-ink-soft mt-3 max-w-xs text-sm leading-relaxed">{location.address}</p>
                    </div>

                    {linkUrl && (
                        <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group text-ink hover:text-ink-soft inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <span className="border-line group-hover:border-ink border-b pb-0.5 transition-colors">Open in Google Maps</span>
                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="border-glass-border relative h-80 w-full overflow-hidden rounded-2xl border shadow-sm sm:h-[420px] lg:h-full lg:min-h-[460px]">
            <iframe
                src={embedUrl}
                title={`Map of ${location.name}`}
                className="size-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            />
        </div>
    );
}
