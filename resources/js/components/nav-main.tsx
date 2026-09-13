import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavMainProps {
    label: string;
    items: NavItem[];
    collapsible?: boolean;
}

export function NavMain({ label, items = [], collapsible = true }: NavMainProps) {
    const page = usePage();
    const isActive = (url: string) => page.url === url || page.url.startsWith(`${url}/`);
    const hasActive = items.some((item) => isActive(item.url));

    const [open, setOpen] = useState(hasActive);

    useEffect(() => {
        if (hasActive) {
            setOpen(true);
        }
    }, [hasActive]);

    const menu = (
        <SidebarMenu className={cn(collapsible && 'pt-1')}>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );

    if (!collapsible) {
        return (
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>{label}</SidebarGroupLabel>
                {menu}
            </SidebarGroup>
        );
    }

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md transition-colors hover:text-sidebar-foreground">
                        <span>{label}</span>
                        <ChevronDown className={cn('transition-transform duration-200', open && 'rotate-180')} />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    {menu}
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}
