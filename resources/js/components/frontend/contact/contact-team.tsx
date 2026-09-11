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
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <ContactReveal className="max-w-2xl">
                    <ContactSectionLabel>{hero.team_badge ?? 'Our people'}</ContactSectionLabel>
                    <h2 id="team-title" className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        {hero.team_title ?? 'The people behind the projects.'}
                    </h2>
                    {hero.team_description && <p className="text-muted-foreground mt-5 max-w-xl text-sm leading-relaxed">{hero.team_description}</p>}
                </ContactReveal>

                <div className="border-border mt-14 border-t">
                    {members.map((member, index) => {
                        const avatar = mediaUrl(member.avatar);

                        return (
                            <ContactReveal key={member.id} delay={index > 0 ? 80 : 0}>
                                <article className="border-border grid gap-6 border-b py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                                    <div className="sm:col-span-4 lg:col-span-3">
                                        <div className="bg-muted relative aspect-4/5 w-full overflow-hidden border">
                                            {avatar ? (
                                                <img
                                                    src={avatar}
                                                    alt={member.name}
                                                    loading="lazy"
                                                    className="size-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="flex size-full items-center justify-center">
                                                    <span className="text-muted-foreground text-2xl font-medium tracking-[0.2em]">
                                                        {initials(member.name)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between gap-8 sm:col-span-8">
                                        <div>
                                            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{member.name}</h3>
                                            <p className="text-primary mt-2 text-[11px] font-medium tracking-[0.24em] uppercase">{member.role}</p>
                                            {member.department && <p className="text-muted-foreground mt-1 text-xs">{member.department}</p>}
                                            {member.bio && (
                                                <p className="text-muted-foreground mt-5 max-w-2xl text-sm leading-relaxed">{member.bio}</p>
                                            )}
                                        </div>

                                        {(member.email || member.phone || member.availability) && (
                                            <div className="border-border flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-5 text-sm">
                                                {member.email && (
                                                    <a
                                                        href={`mailto:${member.email}`}
                                                        className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 break-all transition-colors"
                                                    >
                                                        <Mail className="size-4 shrink-0" aria-hidden />
                                                        {member.email}
                                                    </a>
                                                )}
                                                {member.phone && (
                                                    <a
                                                        href={`tel:${member.phone}`}
                                                        className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
                                                    >
                                                        <Phone className="size-4 shrink-0" aria-hidden />
                                                        {member.phone}
                                                    </a>
                                                )}
                                                {member.availability && (
                                                    <span className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
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
