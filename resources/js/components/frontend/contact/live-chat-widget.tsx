import { cn } from '@/lib/utils';
import { type LiveChatConfig } from '@/types/contact';
import { MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LiveChatWidgetProps {
    config: LiveChatConfig;
}

export default function LiveChatWidget({ config }: LiveChatWidgetProps) {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const positionClass = 'left-4 sm:left-6';

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    useEffect(() => {
        if (open) {
            panelRef.current?.focus();
        }
    }, [open]);

    return (
        <div className={cn('fixed bottom-4 z-50 sm:bottom-6', positionClass)}>
            {open && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-label="Live chat"
                    tabIndex={-1}
                    className="border-glass-border bg-glass-strong mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_30px_-22px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                >
                    <div className="border-glass-border flex items-center justify-between gap-3 border-b p-4">
                        <div>
                            <h2 className="text-ink font-medium">{config.button_text ?? 'Live chat'}</h2>
                            {config.availability_text && <p className="text-ink-soft text-xs">{config.availability_text}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                            className="text-ink-soft hover:text-ink hover:bg-glass rounded-full p-1 transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                    <div className="p-4">
                        <p className="text-ink-soft text-sm">We usually reply within a few minutes.</p>
                        <a
                            href={config.script_url ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-ink text-canvas hover:opacity-90 mt-4 block w-full rounded-full px-4 py-2.5 text-center text-sm font-medium transition-opacity"
                        >
                            Start conversation
                        </a>
                    </div>
                </div>
            )}

            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? 'Close live chat' : 'Open live chat'}
                aria-expanded={open}
                className="bg-ink text-canvas inline-flex size-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
            >
                {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
            </button>
        </div>
    );
}
