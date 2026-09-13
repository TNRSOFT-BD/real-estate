import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealState = 'idle' | 'hidden' | 'shown';

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Fades content up the first time it enters the viewport.
 *
 * Content renders visible by default so it is never hidden when JavaScript is
 * unavailable; the transition is only armed for elements that start below the
 * fold. Motion is disabled for users who prefer reduced motion.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<RevealState>('idle');

    useEffect(() => {
        const element = ref.current;

        if (!element || typeof IntersectionObserver === 'undefined') {
            return;
        }

        if (element.getBoundingClientRect().top < window.innerHeight * 0.85) {
            return;
        }

        setState('hidden');

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    observer.disconnect();
                    setState('shown');
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                state !== 'idle' && 'transition-all duration-700 ease-out motion-reduce:transition-none',
                state === 'hidden' && 'translate-y-6 opacity-0',
                className,
            )}
            style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
