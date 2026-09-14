import { cn } from '@/lib/utils';
import { type ProjectPaginator, type PublicProjectCard } from '@/types/project';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const baseClass = 'inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-medium transition-colors';

export default function ProjectsPagination({ paginator }: { paginator: ProjectPaginator<PublicProjectCard> }) {
    if (paginator.last_page <= 1) {
        return null;
    }

    const pages = paginator.links.filter((link) => /^\d+$/.test(link.label));

    return (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            {paginator.prev_page_url ? (
                <Link
                    href={paginator.prev_page_url}
                    preserveScroll
                    aria-label="Previous page"
                    className={cn(baseClass, 'border-line text-ink-soft hover:border-ink/40 hover:text-ink')}
                >
                    <ChevronLeft className="size-4" aria-hidden />
                </Link>
            ) : (
                <span className={cn(baseClass, 'border-line text-ink-soft/40 cursor-not-allowed')} aria-disabled="true" aria-label="Previous page">
                    <ChevronLeft className="size-4" aria-hidden />
                </span>
            )}

            {pages.map((page) =>
                page.active ? (
                    <span key={page.label} className={cn(baseClass, 'border-ink bg-ink text-canvas')} aria-current="page">
                        {page.label}
                    </span>
                ) : page.url ? (
                    <Link key={page.label} href={page.url} preserveScroll className={cn(baseClass, 'border-line text-ink-soft hover:border-ink/40 hover:text-ink')}>
                        {page.label}
                    </Link>
                ) : (
                    <span key={page.label} className={cn(baseClass, 'border-line text-ink-soft/40')}>
                        {page.label}
                    </span>
                ),
            )}

            {paginator.next_page_url ? (
                <Link
                    href={paginator.next_page_url}
                    preserveScroll
                    aria-label="Next page"
                    className={cn(baseClass, 'border-line text-ink-soft hover:border-ink/40 hover:text-ink')}
                >
                    <ChevronRight className="size-4" aria-hidden />
                </Link>
            ) : (
                <span className={cn(baseClass, 'border-line text-ink-soft/40 cursor-not-allowed')} aria-disabled="true" aria-label="Next page">
                    <ChevronRight className="size-4" aria-hidden />
                </span>
            )}
        </nav>
    );
}
