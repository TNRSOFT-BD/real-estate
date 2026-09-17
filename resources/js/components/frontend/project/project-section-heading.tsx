import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ProjectSectionHeadingProps {
    children: ReactNode;
    id?: string;
    className?: string;
    as?: 'h2' | 'h3';
}

export default function ProjectSectionHeading({ children, id, className, as: Tag = 'h2' }: ProjectSectionHeadingProps) {
    return (
        <Tag
            id={id}
            className={cn(
                'border-line text-ink relative mb-6 border-b pb-3 text-xl font-semibold tracking-tight max-sm:text-lg sm:text-2xl',
                className,
            )}
        >
            {children}
            <span aria-hidden className="bg-ink absolute -bottom-px left-0 h-0.5 w-14" />
        </Tag>
    );
}
