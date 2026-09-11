import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    HelpCircle,
    Inbox,
    LayoutGrid,
    ListChecks,
    Map,
    MessageCircle,
    Settings,
    Share2,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const contactNavItems: NavItem[] = [
    {
        title: 'Page Settings',
        url: '/admin/contact/settings',
        icon: Settings,
    },
    {
        title: 'Information',
        url: '/admin/contact/information',
        icon: ListChecks,
    },
    {
        title: 'Form Fields',
        url: '/admin/contact/form-fields',
        icon: ListChecks,
    },
    {
        title: 'Submissions',
        url: '/admin/contact/submissions',
        icon: Inbox,
    },
    {
        title: 'FAQs',
        url: '/admin/contact/faqs',
        icon: HelpCircle,
    },
    {
        title: 'Team',
        url: '/admin/contact/team',
        icon: Users,
    },
    {
        title: 'Locations',
        url: '/admin/contact/locations',
        icon: Map,
    },
    {
        title: 'Social Links',
        url: '/admin/contact/social-links',
        icon: Share2,
    },
    {
        title: 'Live Chat',
        url: '/admin/contact/live-chat',
        icon: MessageCircle,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Contact Module</SidebarGroupLabel>
                    <SidebarMenu>
                        {contactNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={page.url === item.url || page.url.startsWith(`${item.url}/`)}>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
