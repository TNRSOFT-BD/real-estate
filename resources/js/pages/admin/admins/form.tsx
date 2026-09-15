import { TextField } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AdminItem } from '@/types/admin';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface AdminFormProps {
    item?: AdminItem;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Administrators', href: '/admin/admins' },
];

export default function AdminForm({ item }: AdminFormProps) {
    const isEdit = Boolean(item);

    const { data, setData, post, put, processing, errors } = useForm({
        name: item?.name ?? '',
        email: item?.email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit) {
            put(route('admin.admins.update', { admin: item?.id as number }));
        } else {
            post(route('admin.admins.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: isEdit ? 'Edit' : 'Create', href: '#' }]}>
            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit' : 'Add'} administrator</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isEdit ? 'Update the account details for this administrator.' : 'Create a new account with admin panel access.'}
                        </p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.visit(route('admin.admins.index'))}>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account details</CardTitle>
                            <CardDescription>
                                {isEdit
                                    ? 'Passwords are managed separately from the change password action.'
                                    : 'The new administrator will be able to log in with the email and password below.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <TextField label="Name" value={data.name} onChange={(value) => setData('name', value)} error={errors.name} required />
                            <TextField
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                error={errors.email}
                                required
                            />

                            {!isEdit && (
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={data.password}
                                        onChange={(value) => setData('password', value)}
                                        error={errors.password}
                                        required
                                    />
                                    <TextField
                                        label="Confirm password"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(value) => setData('password_confirmation', value)}
                                        required
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="sticky bottom-4 flex w-full max-w-3xl items-center justify-end gap-3 rounded-lg border bg-card p-3 shadow-lg">
                    <Button type="submit" size="lg" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                        {processing ? 'Saving…' : isEdit ? 'Save changes' : 'Create administrator'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
