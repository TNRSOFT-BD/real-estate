import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type ContactHero, type ContactTeamMember } from '@/types/contact';
import { Mail, Phone } from 'lucide-react';

interface ContactTeamProps {
    members: ContactTeamMember[];
    hero: ContactHero;
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('');
}

export default function ContactTeam({ members, hero }: ContactTeamProps) {
    if (members.length === 0) {
        return null;
    }

    return (
        <section id="team" aria-labelledby="team-title" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 lg:px-8 lg:py-16">
            <Reveal className="max-w-2xl">
                <SectionLabel>{hero.team_badge ?? 'Our people'}</SectionLabel>
                <h2 id="team-title" className="text-ink mt-7 text-3xl leading-tight font-medium tracking-[-0.02em] text-balance sm:text-4xl">
                    {hero.team_title ?? 'The people behind the projects.'}
                </h2>
                {hero.team_description && <p className="text-ink-soft mt-5 max-w-xl text-sm leading-relaxed">{hero.team_description}</p>}
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {members.map((member, index) => {
                    const avatar = mediaUrl(member.avatar);

                    return (
                        <Reveal key={member.id} delay={index > 0 ? 80 : 0} className="h-full">
                            <GlassPanel className="group flex h-full flex-col overflow-hidden">
                                <div className="bg-glass-strong border-glass-border relative aspect-square w-full overflow-hidden border-b">
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt={member.name}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <span className="text-ink/25 text-2xl font-medium tracking-[0.2em]">{initials(member.name)}</span>
                                        </div>
                                    )}

                                    {member.role && (
                                        <span className="bg-ink text-canvas absolute top-2 left-2 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase">
                                            {member.role}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col items-start gap-2.5 p-4">
                                    <div>
                                        <h3 className="text-ink text-sm font-medium tracking-tight">{member.name}</h3>
                                        {member.department && <p className="text-ink-soft mt-0.5 text-[11px]">{member.department}</p>}
                                    </div>

                                    {member.bio && <p className="text-ink-soft text-xs leading-relaxed">{member.bio}</p>}

                                    {(member.email || member.phone || member.availability) && (
                                        <div className="border-line mt-auto flex w-full flex-col items-start gap-1.5 border-t pt-3 text-xs">
                                            {member.email && (
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="text-ink-soft hover:text-ink inline-flex items-center gap-1.5 break-all transition-colors"
                                                >
                                                    <Mail className="size-3.5 shrink-0" aria-hidden />
                                                    {member.email}
                                                </a>
                                            )}
                                            {member.phone && (
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className="text-ink-soft hover:text-ink inline-flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Phone className="size-3.5 shrink-0" aria-hidden />
                                                    {member.phone}
                                                </a>
                                            )}
                                            {member.availability && (
                                                <span className="text-ink-soft text-[9px] tracking-[0.18em] uppercase">{member.availability}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </GlassPanel>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
