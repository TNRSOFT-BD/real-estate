import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, TriangleAlert } from 'lucide-react';
import { type ReactNode } from 'react';
import { type FlashAlert } from '@/types/contact-admin';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    flash?: FlashAlert;
}

export default function AdminPageHeader({ title, description, actions, flash }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>

            {flash?.success && (
                <Alert className="border-green-600/40 bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300">
                    <CheckCircle2 className="size-4" />
                    <AlertTitle>Done</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}

            {flash?.error && (
                <Alert variant="destructive">
                    <TriangleAlert className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}