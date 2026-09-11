import AdminPagination from '@/components/admin/contact/admin-pagination';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { type Paginator } from '@/types/contact-admin';

interface TableFrameProps<T> {
    toolbar?: ReactNode;
    children: ReactNode;
    paginator: Pick<Paginator<T>, 'current_page' | 'last_page' | 'total' | 'to' | 'from' | 'data'> & Partial<Paginator<T>>;
    preserve?: Record<string, unknown>;
    emptyMessage?: string;
}

export function TableFrame<T>({ toolbar, children, paginator, preserve, emptyMessage = 'Nothing found.' }: TableFrameProps<T>) {
    return (
        <div className="overflow-hidden rounded-xl border">
            {toolbar && <div className="border-b bg-muted/40 p-4">{toolbar}</div>}
            <div className="overflow-x-auto">
                {Array.isArray(paginator.data) && paginator.data.length > 0 ? (
                    children
                ) : (
                    <div className="flex min-h-40 items-center justify-center p-8 text-sm text-muted-foreground">{emptyMessage}</div>
                )}
            </div>
            <AdminPagination paginator={paginator} preserve={preserve} />
        </div>
    );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
    return (
        <th className={cn('px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase', className)}>{children}</th>
    );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
    return <td className={cn('px-4 py-3 align-middle text-sm', className)}>{children}</td>;
}