import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type AdminItem } from '@/types/admin';
import { router } from '@inertiajs/react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

interface DeleteAdminDialogProps {
    admin: AdminItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteAdminDialog({ admin, open, onOpenChange }: DeleteAdminDialogProps) {
    const [processing, setProcessing] = useState(false);

    const confirm = () => {
        if (!admin) {
            return;
        }

        router.delete(route('admin.admins.destroy', { admin: admin.id }), {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TriangleAlert className="text-destructive size-5" />
                        Delete administrator?
                    </DialogTitle>
                    <DialogDescription>
                        {admin && (
                            <>
                                Are you sure you want to delete <span className="font-medium">{admin.name}</span> ({admin.email})? This action cannot
                                be undone.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" disabled={processing} onClick={confirm}>
                        {processing && <Loader2 className="animate-spin" />}
                        Delete administrator
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
