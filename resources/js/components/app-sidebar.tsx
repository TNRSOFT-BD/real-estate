import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    Building2,
    HelpCircle,
    Home,
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

const realEstateNavItems: NavItem[] = [
    {
        title: 'Projects',
        url: '/admin/projects',
        icon: Building2,
    },
    {
        title: 'Project Types',
        url: '/admin/project-types',
        icon: Layers,
    },
    {
        title: 'Project Statuses',
        url: '/admin/project-statuses',
        icon: Activity,
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

const homepageNavItems: NavItem[] = [
    {
        title: 'Hero Section',
        url: '/admin/site/homepage',
        icon: Home,
    },
    {
        title: 'About Section',
        url: '/admin/home-about',
        icon: Info,
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
            <SidebarHeader className="border-sidebar-border/60 h-16 justify-center border-b px-4">
                <Link href="/dashboard" prefetch className="flex items-center">
                    <AppLogo showName={false} className="h-11 w-auto" />
                </Link>
            </SidebarHeader>

            <SidebarContent className="pt-2">
                <NavMain label="Platform" items={mainNavItems} collapsible={false} />
                <NavMain label="Real Estate" items={realEstateNavItems} />
                <NavMain label="Homepage" items={homepageNavItems} collapsible={false} />
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
