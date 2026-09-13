import { cn } from '@/lib/utils';
import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    showName?: boolean;
    className?: string;
}

export default function AppLogo({ showName = true, className = 'size-8' }: AppLogoProps) {
    const { company } = usePage<SharedData>().props;
    const name = company?.name ?? 'Laravel';
    const logo = mediaUrl(company?.logo ?? null);

    return (
        <>
            {logo ? (
                <img src={logo} alt={name} className={cn('shrink-0 rounded-md object-contain', className)} />
            ) : (
                <div
                    className={cn(
                        'bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square shrink-0 items-center justify-center rounded-md',
                        className,
                    )}
                >
                    <AppLogoIcon className="size-1/2 fill-current" />
                </div>
            )}
            {showName && (
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-none font-semibold">{name}</span>
                </div>
            )}
        </>
    );
}
