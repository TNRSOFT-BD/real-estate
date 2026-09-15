import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
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
    ShieldCheck,
    Sparkles,
    Users,
    LogOut,
    User,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Administrators',
        url: '/admin/admins',
        icon: ShieldCheck,
    },
];

const projectNavItems: NavItem[] = [
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
    {
        title: 'Why Choose Us',
        url: '/admin/why-choose-us',
        icon: Sparkles,
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
    const { auth } = usePage<SharedData>().props;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader className="border-sidebar-border/60 h-16 justify-center border-b px-4">
                <Link href="/dashboard" prefetch className="flex items-center">
                    <AppLogo showName={false} className="h-11 w-auto" />
                </Link>
            </SidebarHeader>

            <SidebarContent className="pt-2">
                <NavMain label="Platform" items={mainNavItems} collapsible={false} />
                <NavMain label="Homepage" items={homepageNavItems} />
                <NavMain label="About" items={aboutNavItems} />
                <NavMain label="Projects" items={projectNavItems} />
                <NavMain label="Contact Module" items={contactNavItems} />
                <NavMain label="Legal" items={legalNavItems} collapsible={false} />
                <NavMain label="Website Config" items={siteNavItems} collapsible={false} />
                <NavMain label="Access Control" items={adminNavItems} collapsible={false} />
            </SidebarContent>

            <SidebarFooter className="border-sidebar-border/60 border-t p-3">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="bg-sidebar-accent flex size-9 items-center justify-center rounded-full">
                        <User className="size-5 text-sidebar-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sidebar-foreground truncate text-sm font-medium">{auth.user?.name}</p>
                        <p className="text-sidebar-foreground/60 truncate text-xs">{auth.user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors"
                >
                    <LogOut className="size-4" />
                    Log out
                </button>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
