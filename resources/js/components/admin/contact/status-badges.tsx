import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    read: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
    in_progress: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    waiting: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    resolved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    closed: 'bg-neutral-500/15 text-neutral-700 dark:text-neutral-300',
    spam: 'bg-red-500/15 text-red-700 dark:text-red-300',
};

const priorityStyles: Record<string, string> = {
    low: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
    normal: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    high: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
    urgent: 'bg-red-500/15 text-red-700 dark:text-red-300',
};

const labelMap: Record<string, string> = {
    new: 'New',
    read: 'Read',
    in_progress: 'In progress',
    waiting: 'Waiting',
    resolved: 'Resolved',
    closed: 'Closed',
    spam: 'Spam',
    low: 'Low',
    normal: 'Normal',
    high: 'High',
    urgent: 'Urgent',
};

export function StatusBadge({ value }: { value: string }) {
    return (
        <Badge variant="secondary" className={cn('capitalize', statusStyles[value])}>
            {labelMap[value] ?? value.replaceAll('_', ' ')}
        </Badge>
    );
}

export function PriorityBadge({ value }: { value: string }) {
    return (
        <Badge variant="secondary" className={cn('capitalize', priorityStyles[value])}>
            {labelMap[value] ?? value.replaceAll('_', ' ')}
        </Badge>
    );
}