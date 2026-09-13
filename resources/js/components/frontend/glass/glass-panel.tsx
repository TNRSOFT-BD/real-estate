import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    strong?: boolean;
}

export default function GlassPanel({ children, className, strong = false }: GlassPanelProps) {
    return (
        <div
            className={cn(
                'border-ink/15 relative rounded-2xl border backdrop-blur-xl',
                strong ? 'bg-glass-strong' : 'bg-glass',
                'shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_30px_-22px_rgba(0,0,0,0.16)]',
                className,
            )}
        >
            {children}
        </div>
    );
}
