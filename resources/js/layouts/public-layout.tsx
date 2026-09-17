import AppLogoIcon from '@/components/app-logo-icon';
import ContactSocialLinks from '@/components/frontend/contact/contact-social-links';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PublicLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { title: 'Home', href: '/' },
    { title: 'Projects', href: '/projects' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth, name, theme, footer, company } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onRouteChange = () => setMobileOpen(false);
        window.addEventListener('popstate', onRouteChange);
        return () => window.removeEventListener('popstate', onRouteChange);
    }, []);

    const shellStyle = { '--canvas': theme?.background_color ?? '#F4F2ED' } as React.CSSProperties;

    const navLinkClass = 'text-ink-soft hover:text-ink rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-glass-strong';

    const information = footer?.information ?? [];
    const socialLinks = footer?.socialLinks ?? [];
    const legalLinks = footer?.legal ?? [];
    const firstOfType = (types: string[]) => information.find((item) => types.includes(item.type));
    const address = firstOfType(['address']);
    const phone = firstOfType(['hotline', 'phone']);
    const email = firstOfType(['email']);
    const hours = firstOfType(['business_hours']);

    return (
        <div style={shellStyle} className={cn('bg-canvas text-ink flex min-h-screen flex-col', theme?.mode === 'dark' ? 'site-dark' : 'site-light')}>
            <header className="border-glass-border bg-glass sticky top-0 z-40 w-full border-b backdrop-blur-xl">
                <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 lg:h-16">
                    <Link href="/" aria-label={name} className="flex items-center">
                        {company?.logo ? (
                            <img src={mediaUrl(company.logo) ?? undefined} alt={name} className="h-10 w-auto max-w-[200px] object-contain" />
                        ) : (
                            <span className="bg-ink text-canvas flex size-10 items-center justify-center rounded-lg">
                                <AppLogoIcon className="size-6 fill-current" />
                            </span>
                        )}
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={navLinkClass}>
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    {auth.user && (
                        <div className="hidden items-center gap-2 md:flex">
                            <Link
                                href="/dashboard"
                                className="bg-ink text-canvas rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                            >
                                Dashboard
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        className="text-ink hover:bg-glass-strong inline-flex size-9 items-center justify-center rounded-full transition-colors md:hidden"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>

                <div className={cn('border-glass-border md:hidden', mobileOpen ? 'block border-t' : 'hidden')}>
                    <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                                {item.title}
                            </Link>
                        ))}
                        {auth.user && (
                            <div className="border-glass-border mt-2 flex items-center gap-2 border-t pt-3">
                                <Link
                                    href="/dashboard"
                                    className="bg-ink text-canvas flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-opacity hover:opacity-90"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-line mt-16 border-t bg-white">
                <div className="mx-auto w-full max-w-7xl px-4 py-4 lg:px-8 lg:py-6">
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-4">
                            <Link href="/" aria-label={name} className="inline-flex items-center">
                                {company?.logo ? (
                                    <img src={mediaUrl(company.logo) ?? undefined} alt={name} className="h-14 w-auto max-w-[240px] object-contain" />
                                ) : (
                                    <span className="bg-ink text-canvas flex size-14 items-center justify-center">
                                        <AppLogoIcon className="size-7 fill-current" />
                                    </span>
                                )}
                            </Link>

                            <p className="text-ink-soft mt-5 max-w-xs text-sm leading-relaxed">
                                {company?.tagline ?? 'Design-led property development, delivered with clarity and care.'}
                            </p>

                            {socialLinks.length > 0 && (
                                <div className="mt-7 [&_ul]:justify-start">
                                    <ContactSocialLinks items={socialLinks} orientation="horizontal" />
                                </div>
                            )}
                        </div>

                        <nav className="lg:col-span-2" aria-label="Footer">
                            <h2 className="text-ink-soft text-[11px] font-medium tracking-[0.24em] uppercase">Explore</h2>
                            <ul className="mt-5 space-y-3">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link href={item.href} className="text-ink-soft hover:text-ink text-sm font-medium transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="lg:col-span-3">
                            <h2 className="text-ink-soft text-[11px] font-medium tracking-[0.24em] uppercase">Contact</h2>
                            <ul className="text-ink-soft mt-5 space-y-3 text-sm leading-relaxed">
                                {address && (
                                    <li>
                                        {address.value}
                                        {address.secondary_value && <span className="block">{address.secondary_value}</span>}
                                    </li>
                                )}
                                {phone && (
                                    <li>
                                        <a href={phone.link ?? `tel:${phone.value}`} className="hover:text-ink transition-colors">
                                            {phone.value}
                                        </a>
                                    </li>
                                )}
                                {email && (
                                    <li>
                                        <a href={email.link ?? `mailto:${email.value}`} className="hover:text-ink break-all transition-colors">
                                            {email.value}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h2 className="text-ink-soft text-[11px] font-medium tracking-[0.24em] uppercase">Office hours</h2>
                            {hours && <p className="text-ink-soft mt-5 text-sm leading-relaxed">{hours.value}</p>}

                            <Link
                                href="/contact"
                                className="group bg-ink text-canvas mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                            >
                                Contact our team
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="border-line mt-8 flex flex-col items-center justify-between gap-3 border-t pt-5 text-xs sm:flex-row">
                        <p className="text-ink-soft">
                            &copy; {new Date().getFullYear()} {name}. All rights reserved.
                        </p>
                        {legalLinks.length > 0 && (
                            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Legal">
                                {legalLinks.map((page) => (
                                    <Link key={page.slug} href={`/${page.slug}`} className="text-ink-soft hover:text-ink transition-colors">
                                        {page.title}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
