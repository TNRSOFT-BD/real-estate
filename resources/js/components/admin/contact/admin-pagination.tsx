import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import { type Paginator } from '@/types/contact-admin';

interface AdminPaginationProps<T> {
    paginator: Pick<Paginator<T>, 'current_page' | 'last_page' | 'total' | 'to' | 'from' | 'data'> & Partial<Paginator<T>>;
    preserve?: Record<string, unknown>;
}

export default function AdminPagination<T>({ paginator, preserve = {} }: AdminPaginationProps<T>) {
    const total = paginator.total ?? 0;

    if (total === 0) {
        return null;
    }

    const goToPage = (page: number) => {
        router.get(
            window.location.pathname + window.location.search,
            { ...preserve, page },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
                Showing {paginator.from ?? 0}–{paginator.to ?? 0} of {total}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={paginator.current_page <= 1}
                    onClick={() => goToPage(paginator.current_page - 1)}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {paginator.current_page} of {paginator.last_page}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={paginator.current_page >= paginator.last_page}
                    onClick={() => goToPage(paginator.current_page + 1)}
                >
                    Next
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}