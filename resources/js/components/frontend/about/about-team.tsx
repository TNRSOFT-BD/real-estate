import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type AboutHero as AboutHeroData } from '@/types/about';
import { type ContactTeamMember } from '@/types/contact';

interface AboutTeamProps {
    members: ContactTeamMember[];
    hero: AboutHeroData;
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('');
}

export default function AboutTeam({ members, hero }: AboutTeamProps) {
    if (members.length === 0) {
        return null;
    }

    return (
        <section id="team" className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-labelledby="about-team-title">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.team_badge ?? 'Our people'}</SectionLabel>
                <h2
                    id="about-team-title"
                    className="text-ink mt-7 text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance max-sm:text-2xl sm:text-4xl"
                >
                    {hero.team_title ?? 'The people behind the projects.'}
                </h2>
                {hero.team_description && <p className="text-ink-soft mt-5 max-w-xl text-sm leading-relaxed">{hero.team_description}</p>}
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
                {members.map((member, index) => {
                    const avatar = mediaUrl(member.avatar);

                    return (
                        <Reveal key={member.id} delay={index > 0 ? 80 : 0}>
                            <article className="group">
                                <GlassPanel className="overflow-hidden">
                                    <div className="bg-glass-strong border-glass-border relative aspect-3/4 w-full overflow-hidden border-b">
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt={member.name}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center">
                                                <span className="text-ink/25 text-3xl font-medium tracking-[0.2em]">{initials(member.name)}</span>
                                            </div>
                                        )}
                                    </div>
                                </GlassPanel>

                                <div className="pt-4">
                                    <h3 className="text-ink text-base font-medium tracking-[-0.01em]">{member.name}</h3>
                                    {member.role && <p className="text-ink-soft mt-1 text-[11px] tracking-[0.2em] uppercase">{member.role}</p>}
                                    {member.bio && <p className="text-ink-soft mt-3 text-sm leading-relaxed">{member.bio}</p>}
                                </div>
                            </article>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
