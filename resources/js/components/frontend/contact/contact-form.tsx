import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type ContactFormField, type ContactPageProps } from '@/types/contact';
import { useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ContactFormProps {
    fields: ContactFormField[];
    successMessage?: string | null;
}

type FormValues = Record<string, string | boolean | string[]>;

function renderOptions(options?: ContactFormField['options']): Array<{ label: string; value: string }> {
    if (!options) {
        return [];
    }

    return options.map((option) => (typeof option === 'string' ? { label: option, value: option } : { label: option.label, value: option.value }));
}

const fieldClass = (hasError: boolean) =>
    cn(
        'border-input text-foreground placeholder:text-muted-foreground/70 focus-visible:border-foreground h-12 rounded-none border-0 border-b bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base',
        hasError && 'border-destructive focus-visible:border-destructive',
    );

const textareaClass = (hasError: boolean) =>
    cn(
        'border-input text-foreground placeholder:text-muted-foreground/70 focus-visible:border-foreground min-h-36 rounded-none border-0 border-b bg-transparent px-0 py-3 text-base leading-relaxed shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base',
        hasError && 'border-destructive focus-visible:border-destructive',
    );

export default function ContactForm({ fields, successMessage }: ContactFormProps) {
    const { flash } = usePage<ContactPageProps>().props;
    const [submitted, setSubmitted] = useState(false);

    const initialValues = fields.reduce<FormValues>((acc, field) => {
        acc[field.name] = field.type === 'checkbox' ? false : '';
        return acc;
    }, {});

    const { data, setData, post, processing, errors, reset } = useForm<FormValues>({
        ...initialValues,
        website: '',
    });

    if (fields.length === 0) {
        return (
            <div className="text-muted-foreground border border-dashed p-8 text-sm leading-relaxed sm:p-10">
                The contact form is not configured yet. Please reach out another way.
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="bg-background border p-8 sm:p-10">
                <CheckCircle2 className="text-primary size-6" aria-hidden />
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">Message sent</h3>
                <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
                    {flash?.success ?? successMessage ?? 'Thank you. Your message has been received and we will get back to you shortly.'}
                </p>
                <Button
                    variant="outline"
                    className="mt-8 rounded-sm"
                    onClick={() => {
                        reset();
                        setSubmitted(false);
                    }}
                >
                    Send another message
                </Button>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(false);

        post(route('contact.store'), {
            onSuccess: () => {
                setSubmitted(true);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="bg-background border p-6 sm:p-8 lg:p-10">
            {flash?.success && !submitted && (
                <div className="border-primary bg-muted/50 text-foreground mb-8 flex items-start gap-3 border-l-2 p-4 text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{flash.success}</span>
                </div>
            )}

            {flash?.error && (
                <div className="border-destructive bg-destructive/5 text-destructive mb-8 flex items-start gap-3 border-l-2 p-4 text-sm">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{flash.error}</span>
                </div>
            )}

            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {fields.map((field) => {
                    const error = errors[field.name];
                    const isWide = field.type === 'textarea' || field.type === 'radio' || field.type === 'checkbox';
                    const commonProps = {
                        id: `field-${field.name}`,
                        name: field.name,
                        required: field.is_required,
                        'aria-required': field.is_required,
                        'aria-describedby': field.help_text ? `help-${field.name}` : undefined,
                        'aria-invalid': Boolean(error),
                        'aria-label': `${field.label}${field.is_required ? ' (required)' : ''}`,
                    };

                    return (
                        <div key={field.id} className={cn('space-y-3', isWide && 'sm:col-span-2')}>
                            <Label htmlFor={`field-${field.name}`} className="text-foreground text-sm font-medium tracking-wide">
                                {field.label}
                                {field.is_required && (
                                    <span className="text-primary ml-1" aria-hidden>
                                        *
                                    </span>
                                )}
                            </Label>

                            {field.type === 'textarea' && (
                                <textarea
                                    {...commonProps}
                                    value={String(data[field.name] ?? '')}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    rows={5}
                                    placeholder={field.placeholder ?? undefined}
                                    className={textareaClass(Boolean(error))}
                                />
                            )}

                            {field.type === 'select' && (
                                <select
                                    {...commonProps}
                                    value={String(data[field.name] ?? '')}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    className={fieldClass(Boolean(error))}
                                >
                                    <option value="">{field.placeholder ?? 'Select an option'}</option>
                                    {renderOptions(field.options).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {(field.type === 'radio' || field.type === 'checkbox') && (
                                <fieldset className="space-y-3 pt-1">
                                    <legend className="sr-only">{field.label}</legend>
                                    {renderOptions(field.options).map((option) => {
                                        const raw = data[field.name];
                                        const currentArray: string[] = Array.isArray(raw) ? raw : [];
                                        const isChecked = field.type === 'checkbox' ? currentArray.includes(option.value) : raw === option.value;

                                        return (
                                            <div key={`${field.name}-${option.value}`} className="flex items-center gap-3">
                                                <input
                                                    id={`field-${field.name}-${option.value}`}
                                                    type={field.type}
                                                    name={field.name}
                                                    value={option.value}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (field.type === 'checkbox') {
                                                            const next = e.target.checked
                                                                ? [...currentArray, option.value]
                                                                : currentArray.filter((v) => v !== option.value);
                                                            setData(field.name, next);
                                                        } else {
                                                            setData(field.name, option.value);
                                                        }
                                                    }}
                                                    className="accent-primary size-4"
                                                />
                                                <Label htmlFor={`field-${field.name}-${option.value}`} className="text-muted-foreground font-normal">
                                                    {option.label}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </fieldset>
                            )}

                            {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                                <Input
                                    {...commonProps}
                                    type={field.type}
                                    value={String(data[field.name] ?? '')}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    placeholder={field.placeholder ?? undefined}
                                    className={fieldClass(Boolean(error))}
                                />
                            )}

                            {field.help_text && (
                                <p id={`help-${field.name}`} className="text-muted-foreground text-xs leading-relaxed">
                                    {field.help_text}
                                </p>
                            )}

                            {error && <InputError message={error} />}
                        </div>
                    );
                })}

                <div className="hidden" aria-hidden>
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        type="text"
                        value={String(data.website ?? '')}
                        onChange={(e) => setData('website', e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>
            </div>

            <div className="border-border mt-10 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">Fields marked * are required</p>

                <Button type="submit" size="lg" className="group rounded-sm px-7" disabled={processing}>
                    {processing ? (
                        <>
                            <Loader2 className="animate-spin" aria-hidden />
                            Sending…
                        </>
                    ) : (
                        <>
                            Send inquiry
                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
