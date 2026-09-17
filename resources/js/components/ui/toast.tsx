import { cn } from '@/lib/utils';
import { CheckCircle2, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error';

export interface ToastItem {
    id: number;
    message: string;
    variant: ToastVariant;
}

let counter = 0;
let toasts: ToastItem[] = [];
const listeners = new Set<(items: ToastItem[]) => void>();

function emit(): void {
    listeners.forEach((listener) => listener(toasts));
}

export function dismissToast(id: number): void {
    toasts = toasts.filter((item) => item.id !== id);
    emit();
}

export function toast(message: string, variant: ToastVariant = 'success'): void {
    const id = ++counter;
    toasts = [...toasts, { id, message, variant }];
    emit();
    window.setTimeout(() => dismissToast(id), 4500);
}

export function Toaster() {
    const [items, setItems] = useState<ToastItem[]>(toasts);

    useEffect(() => {
        listeners.add(setItems);
        return () => {
            listeners.delete(setItems);
        };
    }, []);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
            {items.map((item) => (
                <div
                    key={item.id}
                    role="status"
                    className={cn(
                        'animate-in slide-in-from-top-2 fade-in pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg duration-300',
                        item.variant === 'success'
                            ? 'border-green-600/40 bg-green-50/95 text-green-800 dark:bg-green-950/80 dark:text-green-300'
                            : 'border-destructive/50 text-destructive bg-red-50/95 dark:bg-red-950/80',
                    )}
                >
                    {item.variant === 'success' ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                    ) : (
                        <TriangleAlert className="mt-0.5 size-5 shrink-0" />
                    )}
                    <p className="flex-1 text-sm leading-relaxed font-medium">{item.message}</p>
                    <button
                        type="button"
                        onClick={() => dismissToast(item.id)}
                        aria-label="Dismiss notification"
                        className="rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
