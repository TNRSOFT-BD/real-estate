import Reveal from '@/components/frontend/glass/reveal';
import { mediaUrl } from '@/lib/media';
import { type AboutHero as AboutHeroData, type AboutPartner } from '@/types/about';

interface AboutPartnersProps {
    hero: AboutHeroData;
}

function PartnerTile({ partner, duplicate = false }: { partner: AboutPartner; duplicate?: boolean }) {
    const image = mediaUrl(partner.image);

    const tileClass =
        'group/tile mr-5 flex h-40 w-56 shrink-0 flex-col items-center justify-center gap-3 p-6 text-center transition-transform duration-300 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:outline-none sm:h-44 sm:w-64 sm:p-7 lg:mr-6';

    const body = image ? (
        <>
            <span className="flex h-16 w-full items-center justify-center sm:h-20">
                <img
                    src={image}
                    alt={partner.image_alt || partner.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover/tile:scale-[1.06]"
                />
            </span>
            <span className="text-ink-soft text-[10px] font-medium tracking-[0.18em] uppercase">{partner.name}</span>
        </>
    ) : (
        <span className="text-ink text-lg font-medium tracking-[-0.01em] sm:text-xl">{partner.name}</span>
    );

    if (partner.url) {
        return (
            <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={duplicate ? -1 : undefined}
                className={tileClass}
            >
                {body}
            </a>
        );
    }

    return <div className={tileClass}>{body}</div>;
}

export default function AboutPartners({ hero }: AboutPartnersProps) {
    if (!hero.partners || hero.partners.length === 0) {
        return null;
    }

    // Repeat the list enough times that one half of the track always fills the
    // viewport, so the -50% loop has no visible gap on wide screens.
    const partners = hero.partners;
    const repeats = 3;
    const loopPartners = Array.from({ length: repeats }, () => partners).flat();

    return (
        <section className="w-full py-7 sm:py-9 lg:py-12" aria-label="Trusted partners">
            <Reveal>
                <h2 className="text-ink-soft mx-auto w-full max-w-7xl px-3 text-center text-[11px] font-medium tracking-[0.28em] uppercase lg:px-6">
                    {hero.partners_title ?? 'Trusted by'}
                </h2>
            </Reveal>

            <Reveal delay={80}>
                <div className="group/marquee relative mt-10 w-full overflow-hidden">
                    <div className="animate-marquee flex w-max group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
                        <ul className="flex">
                            {loopPartners.map((partner, index) => (
                                <li key={`a-${partner.name}-${index}`}>
                                    <PartnerTile partner={partner} />
                                </li>
                            ))}
                        </ul>

                        <ul className="flex" aria-hidden="true">
                            {loopPartners.map((partner, index) => (
                                <li key={`b-${partner.name}-${index}`}>
                                    <PartnerTile partner={partner} duplicate />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
