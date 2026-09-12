import ContactReveal from '@/components/frontend/contact/contact-reveal';
import ContactSectionLabel from '@/components/frontend/contact/contact-section-label';
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
        <section id="team" aria-labelledby="team-title" className="border-b">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12 lg:px-8 lg:py-14">
                <ContactReveal className="max-w-2xl">
                    <ContactSectionLabel>{hero.team_badge ?? 'Our people'}</ContactSectionLabel>
                    <h2 id="team-title" className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        {hero.team_title ?? 'The people behind the projects.'}
                    </h2>
                    {hero.team_description && <p className="text-muted-foreground mt-5 max-w-xl text-sm leading-relaxed">{hero.team_description}</p>}
                </ContactReveal>

                <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {members.map((member, index) => {
                        const avatar = mediaUrl(member.avatar);

                        return (
                            <ContactReveal key={member.id} delay={index > 0 ? 80 : 0} className="h-full">
                                <article className="group flex h-full flex-col overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
                                    <div className="bg-muted relative aspect-square w-full overflow-hidden">
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt={member.name}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center">
                                                <span className="text-muted-foreground text-2xl font-medium tracking-[0.2em]">
                                                    {initials(member.name)}
                                                </span>
                                            </div>
                                        )}
                                        {member.role && (
                                            <span className="bg-primary text-primary-foreground absolute top-2 left-2 px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] uppercase">
                                                {member.role}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col items-start gap-3 p-4">
                                        <div>
                                            <h3 className="text-sm font-semibold tracking-tight">{member.name}</h3>
                                            {member.department && (
                                                <p className="text-muted-foreground mt-0.5 text-[11px]">{member.department}</p>
                                            )}
                                        </div>

                                        {member.bio && <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>}

                                        {(member.email || member.phone || member.availability) && (
                                            <div className="border-border mt-auto flex w-full flex-col items-start gap-1.5 border-t pt-3 text-xs">
                                                {member.email && (
                                                    <a
                                                        href={`mailto:${member.email}`}
                                                        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 break-all transition-colors"
                                                    >
                                                        <Mail className="size-3.5 shrink-0" aria-hidden />
                                                        {member.email}
                                                    </a>
                                                )}
                                                {member.phone && (
                                                    <a
                                                        href={`tel:${member.phone}`}
                                                        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <Phone className="size-3.5 shrink-0" aria-hidden />
                                                        {member.phone}
                                                    </a>
                                                )}
                                                {member.availability && (
                                                    <span className="text-muted-foreground text-[9px] tracking-[0.18em] uppercase">
                                                        {member.availability}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            </ContactReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
