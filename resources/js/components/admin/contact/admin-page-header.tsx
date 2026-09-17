import { toast } from '@/components/ui/toast';
import { type FlashAlert } from '@/types/contact-admin';
import { useEffect, type ReactNode } from 'react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    flash?: FlashAlert;
}

export default function AdminPageHeader({ title, description, actions, flash }: AdminPageHeaderProps) {
    useEffect(() => {
        if (flash?.success) {
            toast(flash.success, 'success');
        }

        if (flash?.error) {
            toast(flash.error, 'error');
        }
    }, [flash]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}