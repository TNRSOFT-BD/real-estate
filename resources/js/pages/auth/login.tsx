import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthGlassLayout from '@/layouts/auth/auth-glass-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { type FormEventHandler, useState } from 'react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthGlassLayout title="Welcome back" description="Sign in to your account to continue to the admin console.">
            <Head title="Log in" />

            {status && (
                <div className="mb-6 flex items-start gap-2 rounded-xl border border-green-600/30 bg-green-50/90 p-3 text-sm text-green-800">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    <span>{status}</span>
                </div>
            )}

            <form className="grid gap-5" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                        <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="email@example.com"
                            className="pl-9"
                            aria-invalid={Boolean(errors.email)}
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="••••••••"
                            className="pr-10 pl-9"
                            aria-invalid={Boolean(errors.password)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', checked === true)}
                        tabIndex={3}
                    />
                    <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                        Remember me
                    </Label>
                </div>

                <Button type="submit" size="lg" className="mt-2 w-full" tabIndex={4} disabled={processing}>
                    {processing ? <LoaderCircle className="animate-spin" /> : null}
                    {processing ? 'Signing in…' : 'Sign in'}
                    {!processing && <ArrowRight />}
                </Button>
            </form>
        </AuthGlassLayout>
    );
}
