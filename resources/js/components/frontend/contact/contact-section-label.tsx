import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ContactSectionLabelProps {
    children: ReactNode;
    className?: string;
}

export default function ContactSectionLabel({ children, className }: ContactSectionLabelProps) {
    return (
        <span className={cn('text-muted-foreground inline-flex items-center gap-3 text-xs font-medium tracking-[0.28em] uppercase', className)}>
            <span aria-hidden className="bg-border h-px w-8 shrink-0" />
            {children}
        </span>
    );
}
