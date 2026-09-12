import ContactReveal from '@/components/frontend/contact/contact-reveal';
import ContactSectionLabel from '@/components/frontend/contact/contact-section-label';
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
        <section className="border-b" aria-label="Contact information">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12 lg:px-8 lg:py-14">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <ContactReveal className="lg:col-span-4">
                        <ContactSectionLabel>Get in touch</ContactSectionLabel>
                        <h2 className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">We would love to hear from you.</h2>
                        <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed">
                            Reach the team directly through any of the channels below. We respond to every enquiry personally.
                        </p>
                    </ContactReveal>

                    <ContactReveal delay={120} className="lg:col-span-8">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {items.map((item) => {
                                const IconComponent = typeIcons[item.type] ?? typeIcons.other;
                                const icon = mediaUrl(item.icon);

                                return (
                                    <article
                                        key={item.id}
                                        className="bg-card flex flex-col gap-3 border p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
                                    >
                                        <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-none">
                                            {icon ? (
                                                <img src={icon} alt="" aria-hidden className="size-5 shrink-0 text-primary" />
                                            ) : (
                                                <IconComponent className="text-primary size-5 shrink-0" />
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-muted-foreground text-[11px] font-medium tracking-[0.24em] uppercase">{item.title}</h3>

                                            {item.link ? (
                                                <a
                                                    href={item.link}
                                                    className="text-foreground hover:text-primary mt-1.5 block text-lg font-medium break-words underline-offset-4 transition-colors hover:underline sm:text-xl"
                                                    {...(item.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-foreground mt-1.5 text-lg font-medium break-words sm:text-xl">{item.value}</p>
                                            )}

                                            {item.secondary_value && <p className="text-muted-foreground mt-1 text-sm">{item.secondary_value}</p>}

                                            {item.description && (
                                                <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">{item.description}</p>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </ContactReveal>
                </div>
            </div>
        </section>
    );
}
