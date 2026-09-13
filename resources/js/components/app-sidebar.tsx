import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Building2,
    HelpCircle,
    Inbox,
    Info,
    Landmark,
    Layers,
    LayoutGrid,
    ListChecks,
    Map,
    MessageCircle,
    Palette,
    Scale,
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

const siteNavItems: NavItem[] = [
    {
        title: 'Appearance',
        url: '/admin/site/appearance',
        icon: Palette,
    },
];

const legalNavItems: NavItem[] = [
    {
        title: 'Legal Pages',
        url: '/admin/legal',
        icon: Scale,
    },
];

const aboutNavItems: NavItem[] = [
    {
        title: 'Page Settings',
        url: '/admin/about/settings',
        icon: Info,
    },
    {
        title: 'Company',
        url: '/admin/about/company',
        icon: Landmark,
    },
    {
        title: 'Content',
        url: '/admin/about/items',
        icon: Layers,
    },
    {
        title: 'Company Info',
        url: '/admin/contact/information',
        icon: Building2,
    },
    {
        title: 'Social Links',
        url: '/admin/contact/social-links',
        icon: Share2,
    },
    {
        title: 'Team',
        url: '/admin/contact/team',
        icon: Users,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader className="h-16 justify-center border-b border-sidebar-border/60 px-3">
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

            <SidebarContent className="pt-2">
                <NavMain label="Platform" items={mainNavItems} collapsible={false} />
                <NavMain label="About Us" items={aboutNavItems} />
                <NavMain label="Website Settings" items={siteNavItems} collapsible={false} />
                <NavMain label="Legal" items={legalNavItems} collapsible={false} />
                <NavMain label="Contact Module" items={contactNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
