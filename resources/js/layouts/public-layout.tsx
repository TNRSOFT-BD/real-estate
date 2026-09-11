import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { title: 'Home', href: '/' },
    { title: 'Contact', href: '/contact' },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onRouteChange = () => setMobileOpen(false);
        window.addEventListener('popstate', onRouteChange);
        return () => window.removeEventListener('popstate', onRouteChange);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo />
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        {auth.user ? (
                            <Button asChild size="sm">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </Button>
                </div>

                <div className={cn('border-t md:hidden', mobileOpen ? 'block' : 'hidden')}>
                    <nav className="container flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                {item.title}
                            </Link>
                        ))}
                        <div className="mt-2 flex items-center gap-2 border-t pt-3">
                            {auth.user ? (
                                <Button asChild size="sm" className="w-full">
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                        <Link href="/login">Log in</Link>
                                    </Button>
                                    <Button asChild size="sm" className="flex-1">
                                        <Link href="/register">Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t bg-muted/40">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm text-muted-foreground md:flex-row md:px-6 md:text-left">
                    <p>&copy; {new Date().getFullYear()} Real Estate. All rights reserved.</p>
                    <p>
                        <Link href="/contact" className="underline-offset-4 hover:underline">
                            Contact us
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}