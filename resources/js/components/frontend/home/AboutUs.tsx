import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type HomeAboutData } from '@/types/home-about';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_HEADING = "We know every block because we've walked it.";
const DEFAULT_DESCRIPTION =
    'For over eighteen years, our agents have matched families, first-time buyers, and investors with homes across the city — not by algorithm, but by knowing the neighborhoods, the schools, and often the sellers themselves. Real estate is personal, and we treat every closing that way.';
const DEFAULT_BADGE_FIGURE = '98%';
const DEFAULT_BADGE_COPY = 'of clients refer us to someone they trust';
const DEFAULT_MAIN_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop';
const DEFAULT_ACCENT_IMAGE = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop';
const DEFAULT_STATS: Array<{ figure: string; label: string }> = [
    { figure: '18', label: 'Years serving the city' },
    { figure: '1,240+', label: 'Homes placed with families' },
    { figure: '4.9', label: 'Average client rating' },
];

interface AboutUsProps {
    about: HomeAboutData;
}

export default function AboutUs({ about }: AboutUsProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    const heading = about.heading?.trim() || DEFAULT_HEADING;
    const description = about.description?.trim() || '';
    const badgeFigure = about.badge_figure?.trim() || DEFAULT_BADGE_FIGURE;
    const badgeCopy = about.badge_copy?.trim() || DEFAULT_BADGE_COPY;
    const mainImage = mediaUrl(about.main_image) ?? DEFAULT_MAIN_IMAGE;
    const mainImageAlt = about.main_image_alt?.trim() || 'Modern home exterior at dusk with warm interior lighting';
    const accentImage = mediaUrl(about.accent_image) ?? DEFAULT_ACCENT_IMAGE;
    const accentImageAlt = about.accent_image_alt?.trim() || 'Real estate agent handing over house keys to new owners';
    const stats = about.stats.length > 0 ? about.stats : DEFAULT_STATS;

    useEffect(() => {
        const node = sectionRef.current;

        if (!node || typeof IntersectionObserver === 'undefined') {
            setVisible(true);

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <section className="au-section" ref={sectionRef} aria-labelledby="au-heading">
            <style>{`
        .au-section {
          --au-ink: var(--ink);
          --au-ink-soft: var(--ink-soft);
          --au-panel: var(--ink);
          --au-panel-text: var(--canvas);
          --au-line: var(--line);

          padding: 3rem 0;
          overflow: hidden;
        }

        .au-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          padding-inline: 1rem;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .au-container.au-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .au-visual {
          position: relative;
          margin-bottom: 3rem;
        }

        .au-frame {
          overflow: hidden;
          border-radius: 6px;
          background: #ddd8c9;
        }

        .au-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .au-frame--main {
          aspect-ratio: 4 / 5;
          box-shadow: 0 24px 48px -24px rgba(35, 34, 30, 0.35);
        }

        /* Accent starts flush with the main image on narrow screens so it can
           never be clipped by the section edge. */
        .au-frame--accent {
          position: absolute;
          width: 44%;
          aspect-ratio: 1 / 1;
          left: 0;
          bottom: -8%;
          border: 5px solid var(--canvas);
          box-shadow: 0 18px 32px -16px rgba(35, 34, 30, 0.4);
        }

        .au-badge {
          position: absolute;
          top: -4%;
          right: 0;
          max-width: 168px;
          background: var(--au-panel);
          color: var(--au-panel-text);
          padding: 1.1rem 1.2rem;
          border-radius: 4px;
          box-shadow: 0 20px 32px -18px rgba(20, 26, 21, 0.55);
        }

        .au-badge-figure {
          display: block;
          font-family: var(--font-sans);
          font-size: 1.75rem;
          font-weight: 500;
          line-height: 1;
        }

        .au-badge-copy {
          display: block;
          margin-top: 0.5rem;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          line-height: 1.45;
          color: var(--au-panel-text);
          opacity: 0.8;
        }

        .au-heading {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(2rem, 3.4vw + 1rem, 2.75rem);
          line-height: 1.16;
          color: var(--au-ink);
          margin: 0 0 1.4rem;
        }

        .au-copy {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--au-ink-soft);
          text-align: justify;
          margin: 0;
        }

        .au-copy > *:first-child { margin-top: 0; }
        .au-copy > *:last-child { margin-bottom: 0; }
        .au-copy p { margin: 0 0 1rem; }
        .au-copy a { color: var(--au-ink); text-decoration: underline; }
        .au-copy strong { color: var(--au-ink); }

        /* Two-column stat grid on phones so figures never squeeze. */
        .au-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem 1.25rem;
          margin: 2.5rem 0 0;
          padding: 1.75rem 0;
          border-top: 1px solid var(--au-line);
          border-bottom: 1px solid var(--au-line);
        }

        .au-stat {
          padding: 0;
          margin: 0;
          border: 0;
        }

        .au-stat-figure {
          font-family: var(--font-sans);
          font-size: 1.75rem;
          font-weight: 500;
          color: var(--au-ink);
          margin: 0;
          line-height: 1;
        }

        .au-stat-label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          color: var(--au-ink-soft);
          margin: 0.5rem 0 0;
          line-height: 1.4;
        }

        /* Breakpoint 1 — large phones */
        @media (min-width: 480px) {
          .au-container { gap: 4rem; padding-inline: 1.25rem; }
          .au-frame--accent { width: 42%; bottom: -9%; }
          .au-badge { top: -5%; max-width: 180px; }
        }

        /* Breakpoint 2 — small tablets */
        @media (min-width: 640px) {
          .au-container { padding-inline: 1.5rem; }
          .au-visual { margin-bottom: 3.25rem; }
          .au-frame--accent { width: 40%; bottom: -10%; border-width: 6px; }
          .au-badge { top: -6%; right: -2%; max-width: 200px; }

          .au-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 1.75rem 0;
          }

          .au-stat {
            padding-right: 1.75rem;
            margin-right: 1.75rem;
            border-right: 1px solid var(--au-line);
          }

          .au-stat:last-child {
            border-right: none;
            margin-right: 0;
            padding-right: 0;
          }
        }

        /* Breakpoint 3 — desktop: two columns */
        @media (min-width: 900px) {
          .au-section { padding: 4rem 0; }
          .au-container {
            grid-template-columns: 0.95fr 1fr;
            align-items: center;
            gap: 4.5rem;
            padding-inline: 2rem;
          }
          .au-visual { margin-bottom: 0; }
          .au-frame--accent { width: 46%; left: -4%; bottom: -12%; }
          .au-badge { top: -6%; right: -4%; }
        }

        /* Breakpoint 4 — large desktop */
        @media (min-width: 1200px) {
          .au-container { gap: 5.5rem; }
          .au-frame--accent { left: -5%; }
        }

        @media (max-width: 639px) {
          .au-heading { font-size: 1.5rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .au-container {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

            <div className={cn('au-container mx-auto w-full max-w-7xl', visible && 'au-visible')}>
                <div className="au-visual">
                    <div className="au-frame au-frame--main">
                        <img src={mainImage} alt={mainImageAlt} />
                    </div>
                    <div className="au-frame au-frame--accent">
                        <img src={accentImage} alt={accentImageAlt} />
                    </div>
                    <div className="au-badge">
                        <span className="au-badge-figure">{badgeFigure}</span>
                        <span className="au-badge-copy">{badgeCopy}</span>
                    </div>
                </div>

                <div className="au-content">
                    <h2 id="au-heading" className="au-heading">
                        {heading}
                    </h2>

                    {description ? (
                        <div className="au-copy" dangerouslySetInnerHTML={{ __html: description }} />
                    ) : (
                        <p className="au-copy">{DEFAULT_DESCRIPTION}</p>
                    )}

                    <dl className="au-stats">
                        {stats.map((stat) => (
                            <div key={stat.label} className="au-stat">
                                <dt className="au-stat-figure">{stat.figure}</dt>
                                <dd className="au-stat-label">{stat.label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
