import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface SectionLabelProps {
    children: ReactNode;
    className?: string;
    withLine?: boolean;
}

export default function SectionLabel({ children, className, withLine = true }: SectionLabelProps) {
    return (
        <span className={cn('text-ink-soft inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] uppercase', className)}>
            {withLine && <span aria-hidden className="bg-ink/30 h-px w-8 shrink-0" />}
            {children}
        </span>
    );
}
