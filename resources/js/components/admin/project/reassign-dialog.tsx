import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SelectField } from '@/components/admin/contact/form-fields';
import { type SelectOption } from '@/types/project-admin';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface ReassignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    options: SelectOption[];
    action: string;
}

export default function ReassignDialog({ open, onOpenChange, title, description, options, action }: ReassignDialogProps) {
    const [targetId, setTargetId] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setTargetId(options[0]?.value ?? '');
            setProcessing(false);
        }
    }, [open, options]);

    const submit = () => {
        if (targetId === '') {
            return;
        }

        setProcessing(true);

        router.patch(
            action,
            { target_id: targetId },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onOpenChange(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                {options.length > 0 ? (
                    <SelectField label="Reassign to" value={targetId} onChange={setTargetId} options={options} required />
                ) : (
                    <p className="text-muted-foreground text-sm">There is no other option to reassign to.</p>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" disabled={processing || options.length === 0} onClick={submit}>
                        {processing && <Loader2 className="animate-spin" />}
                        Reassign projects
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
