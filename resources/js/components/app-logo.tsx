import { mediaUrl } from '@/lib/media';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { company } = usePage<SharedData>().props;
    const name = company?.name ?? 'Laravel';
    const logo = mediaUrl(company?.logo ?? null);

    return (
        <>
            {logo ? (
                <img src={logo} alt={name} className="size-8 shrink-0 rounded-md object-contain" />
            ) : (
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-md">
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                </div>
            )}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{name}</span>
            </div>
        </>
    );
}
