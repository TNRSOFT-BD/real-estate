import AppLogoIcon from '@/components/app-logo-icon';
import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface AuthGlassLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthGlassLayout({ children, title, description }: AuthGlassLayoutProps) {
    const { name, company } = usePage<SharedData>().props;
    const logo = mediaUrl(company?.logo ?? null);
    const year = new Date().getFullYear();

    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
            <img src="/images/auth/login-hero.jpeg" alt="" aria-hidden className="absolute inset-0 size-full scale-105 object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/45 to-slate-950/75" />

            <div className="relative z-10 w-full max-w-[26rem]">
                <div className="rounded-2xl border border-white/50 bg-white/90 p-8 shadow-[0_30px_70px_-20px_rgba(2,6,23,0.65)] backdrop-blur-2xl sm:p-10">
                    <Link href={route('home')} className="mb-8 flex items-center justify-center gap-3">
                        {logo ? (
                            <img src={logo} alt={name} className="h-12 w-auto max-w-[220px] object-contain" />
                        ) : (
                            <>
                                <span className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-2xl">
                                    <AppLogoIcon className="size-6 fill-current" />
                                </span>
                                <span className="text-lg font-semibold tracking-tight">{name}</span>
                            </>
                        )}
                    </Link>

                    <header className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        {description && <p className="text-muted-foreground mt-2 text-sm text-balance">{description}</p>}
                    </header>

                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-white/80">
                    &copy; {year} {name}. All rights reserved.
                </p>
            </div>
        </div>
    );
}
