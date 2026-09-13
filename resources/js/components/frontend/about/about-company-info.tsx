import ContactSocialLinks from '@/components/frontend/contact/contact-social-links';
import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type ContactInformation as ContactInformationItem, type ContactSocialLink } from '@/types/contact';
import { Building2, Clock, Handshake, LifeBuoy, Mail, MapPin, MessageCircle, Phone, PhoneCall } from 'lucide-react';
import { type ComponentType } from 'react';

interface AboutCompanyInfoProps {
    items: ContactInformationItem[];
    socialLinks: ContactSocialLink[];
}

const typeLabels: Record<string, string> = {
    hotline: 'Hotline',
    phone: 'Phone',
    email: 'Email',
    address: 'Head office',
    business_hours: 'Business hours',
    support: 'Support',
    sales: 'Sales',
    whatsapp: 'WhatsApp',
    other: 'Other',
};

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

const typePriority: Record<string, number> = {
    address: 0,
    hotline: 1,
    phone: 2,
    email: 3,
    business_hours: 4,
    whatsapp: 5,
    support: 6,
    sales: 7,
    other: 8,
};

function select(items: ContactInformationItem[], types: string[]): ContactInformationItem[] {
    const present = items.filter((item) => types.includes(item.type));
    return present
        .filter((item, index, self) => self.findIndex((other) => other.type === item.type) === index)
        .sort((a, b) => typePriority[a.type] - typePriority[b.type] || a.sort_order - b.sort_order);
}

export default function AboutCompanyInfo({ items, socialLinks }: AboutCompanyInfoProps) {
    const entries = select(items, ['address', 'hotline', 'phone', 'email', 'whatsapp', 'business_hours']);

    if (entries.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:px-6 lg:py-12" aria-label="Company details">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <Reveal className="max-w-xl">
                    <SectionLabel>Company details</SectionLabel>
                    <h2 className="text-ink mt-7 text-2xl font-medium tracking-[-0.01em] text-balance sm:text-3xl">
                        Visit us, write to us, call us.
                    </h2>
                </Reveal>

                {socialLinks.length > 0 && (
                    <Reveal delay={80}>
                        <ContactSocialLinks items={socialLinks} orientation="horizontal" />
                    </Reveal>
                )}
            </div>

            <dl className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
                {entries.map((item, index) => {
                    const Icon = typeIcons[item.type] ?? typeIcons.other;
                    const icon = mediaUrl(item.icon);

                    return (
                        <Reveal key={item.id} delay={index * 60} className="h-full">
                            <div className="border-line flex h-full flex-col gap-3 border-t py-7 sm:py-8">
                                <dt className="text-ink-soft flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] uppercase">
                                    {icon ? <img src={icon} alt="" aria-hidden className="size-4 shrink-0" /> : <Icon className="size-4 shrink-0" aria-hidden />}
                                    {typeLabels[item.type] ?? item.title}
                                </dt>

                                <dd>
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            className="text-ink hover:text-ink-soft text-xl font-medium break-words underline-offset-4 transition-colors hover:underline"
                                            {...(item.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-ink text-xl font-medium break-words">{item.value}</p>
                                    )}

                                    {item.secondary_value && <p className="text-ink-soft mt-1 text-sm">{item.secondary_value}</p>}
                                    {item.description && <p className="text-ink-soft mt-1 text-sm leading-relaxed">{item.description}</p>}
                                </dd>
                            </div>
                        </Reveal>
                    );
                })}
            </dl>
        </section>
    );
}
