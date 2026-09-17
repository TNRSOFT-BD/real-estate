import GlassPanel from '@/components/frontend/glass/glass-panel';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type ContactInformation as ContactInformationItem } from '@/types/contact';
import { Building2, Clock, Handshake, LifeBuoy, Mail, MapPin, MessageCircle, Phone, PhoneCall } from 'lucide-react';
import { type ComponentType } from 'react';

interface ContactInformationProps {
    items: ContactInformationItem[];
}

const typeIcons: Record<string, ComponentType<{ className?: string }>> = {
    hotline: PhoneCall,
    phone: Phone,
    email: Mail,
    address: MapPin,
    business_hours: Clock,
    support: LifeBuoy,
    sales: Handshake,
    whatsapp: MessageCircle,
    other: Building2,
};

export default function ContactInformation({ items }: ContactInformationProps) {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 lg:px-8 lg:py-16" aria-label="Contact information">
            <Reveal className="max-w-2xl">
                <SectionLabel>Get in touch</SectionLabel>
                <h2 className="text-ink mt-7 text-3xl leading-tight font-medium tracking-[-0.02em] text-balance max-sm:text-2xl sm:text-4xl">
                    We would love to hear from you.
                </h2>
                <p className="text-ink-soft mt-5 max-w-xl text-sm leading-relaxed">
                    Reach the team directly through any of the channels below. We respond to every enquiry personally.
                </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => {
                    const IconComponent = typeIcons[item.type] ?? typeIcons.other;
                    const icon = mediaUrl(item.icon);

                    return (
                        <Reveal key={item.id} delay={index > 0 ? 60 : 0} className="h-full">
                            <GlassPanel className="flex h-full flex-col gap-4 p-6 sm:p-7">
                                <span className="border-glass-border bg-glass-strong flex size-11 shrink-0 items-center justify-center rounded-xl border">
                                    {icon ? (
                                        <img src={icon} alt="" aria-hidden className="size-5 shrink-0" />
                                    ) : (
                                        <IconComponent className="text-ink size-5 shrink-0" />
                                    )}
                                </span>

                                <div>
                                    <h3 className="text-ink-soft text-[11px] font-medium tracking-[0.24em] uppercase">{item.title}</h3>

                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            className="text-ink hover:text-ink-soft mt-2 block text-lg font-medium break-words underline-offset-4 transition-colors hover:underline"
                                            {...(item.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-ink mt-2 text-lg font-medium break-words">{item.value}</p>
                                    )}

                                    {item.secondary_value && <p className="text-ink-soft mt-1 text-sm">{item.secondary_value}</p>}

                                    {item.description && <p className="text-ink-soft mt-2 text-sm leading-relaxed">{item.description}</p>}
                                </div>
                            </GlassPanel>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
