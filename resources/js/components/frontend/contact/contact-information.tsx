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
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <ContactReveal className="lg:col-span-4">
                        <ContactSectionLabel>Get in touch</ContactSectionLabel>
                        <h2 className="mt-7 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">We would love to hear from you.</h2>
                        <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed">
                            Reach the team directly through any of the channels below. We respond to every enquiry personally.
                        </p>
                    </ContactReveal>

                    <ContactReveal delay={120} className="lg:col-span-8">
                        <dl className="border-border border-t">
                            {items.map((item) => {
                                const IconComponent = typeIcons[item.type] ?? typeIcons.other;
                                const icon = mediaUrl(item.icon);

                                return (
                                    <div key={item.id} className="border-border grid gap-3 border-b py-7 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-8">
                                        <dt className="text-muted-foreground flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] uppercase">
                                            {icon ? (
                                                <img src={icon} alt="" aria-hidden className="size-4 shrink-0" />
                                            ) : (
                                                <IconComponent className="size-4 shrink-0" />
                                            )}
                                            {item.title}
                                        </dt>

                                        <dd className="space-y-2">
                                            {item.link ? (
                                                <a
                                                    href={item.link}
                                                    className="text-foreground hover:text-primary text-lg font-medium break-words underline-offset-4 transition-colors hover:underline sm:text-xl"
                                                    {...(item.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-foreground text-lg font-medium break-words sm:text-xl">{item.value}</p>
                                            )}

                                            {item.secondary_value && <p className="text-muted-foreground text-sm">{item.secondary_value}</p>}

                                            {item.description && (
                                                <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">{item.description}</p>
                                            )}
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </ContactReveal>
                </div>
            </div>
        </section>
    );
}
