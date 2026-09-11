import { Icon } from '@/components/icon';
import { type ContactSocialLink } from '@/types/contact';
import { Facebook, Globe, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from 'lucide-react';

interface ContactSocialLinksProps {
    items: ContactSocialLink[];
}

const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    whatsapp: MessageCircle,
    twitter: Twitter,
    youtube: Youtube,
} as const;

export default function ContactSocialLinks({ items }: ContactSocialLinksProps) {
    return (
        <div aria-label="Social media">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.28em] uppercase">Follow us</p>

            <ul className="mt-5 flex flex-col gap-3">
                {items.map((link) => {
                    const platform = link.platform.toLowerCase();
                    const IconComponent = platformIcons[platform as keyof typeof platformIcons] ?? Globe;
                    const label = link.label ?? link.platform;

                    return (
                        <li key={link.id}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                                className="group text-foreground/80 hover:text-primary inline-flex items-center gap-3 text-sm font-medium transition-colors"
                            >
                                <Icon iconNode={IconComponent} className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                                <span className="group-hover:border-primary border-b border-transparent pb-0.5 transition-colors">{label}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
