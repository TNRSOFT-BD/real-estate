import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type AdminItem } from '@/types/admin';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { type FormEventHandler } from 'react';

interface ChangePasswordDialogProps {
    admin: AdminItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordDialog({ admin, open, onOpenChange }: ChangePasswordDialogProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset();
            clearErrors();
        }

        onOpenChange(nextOpen);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (!admin) {
            return;
        }

        put(route('admin.admins.password.update', { admin: admin.id }), {
            preserveScroll: true,
            onSuccess: () => handleOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                        {admin && (
                            <>
                                Set a new password for <span className="font-medium">{admin.name}</span> ({admin.email}).
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form className="grid gap-4" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="admin-new-password">
                            New password
                            <span className="text-destructive ml-0.5" aria-hidden>
                                *
                            </span>
                        </Label>
                        <Input
                            id="admin-new-password"
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            aria-invalid={Boolean(errors.password)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin-new-password-confirmation">
                            Confirm new password
                            <span className="text-destructive ml-0.5" aria-hidden>
                                *
                            </span>
                        </Label>
                        <Input
                            id="admin-new-password-confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="animate-spin" />}
                            Change password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
