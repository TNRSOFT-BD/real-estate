import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, CheckCircle2, ChevronDown, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface RowActionsProps {
    editUrl: string;
    onToggle?: () => void;
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    showMoveControls?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
}

export default function RowActions({
    editUrl,
    onToggle,
    onDelete,
    onMoveUp,
    onMoveDown,
    showMoveControls = false,
    isFirst = false,
    isLast = false,
}: RowActionsProps) {
    const handleDelete = () => {
        if (window.confirm('Delete this item? This cannot be undone.')) {
            onDelete?.();
        }
    };

    return (
        <div className="flex items-center justify-end gap-1">
            {showMoveControls && onMoveUp && (
                <Button variant="ghost" size="icon" onClick={onMoveUp} disabled={isFirst} aria-label="Move up">
                    <ArrowUp className="size-4" />
                </Button>
            )}
            {showMoveControls && onMoveDown && (
                <Button variant="ghost" size="icon" onClick={onMoveDown} disabled={isLast} aria-label="Move down">
                    <ArrowDown className="size-4" />
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={editUrl}>
                            <Pencil />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    {onToggle && (
                        <DropdownMenuItem onClick={onToggle}>
                            <Power />
                            Toggle status
                        </DropdownMenuItem>
                    )}
                    {onDelete && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function PrimaryIcon({ active }: { active: boolean }) {
    return active ? <CheckCircle2 className="size-4 text-emerald-600" /> : <ChevronDown className="size-4 text-muted-foreground" />;
}