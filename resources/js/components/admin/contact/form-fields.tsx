import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    labelClassName?: string;
    children: React.ReactNode;
}

export function Field({ label, error, hint, required, labelClassName, children }: BaseFieldProps) {
    return (
        <div className="space-y-2">
            <Label className={cn(labelClassName)}>
                {label}
                {required && (
                    <span className="text-destructive ml-0.5" aria-hidden>
                        *
                    </span>
                )}
            </Label>
            {children}
            {hint && !error && <p className="text-muted-foreground text-xs">{hint}</p>}
            {error && <InputError message={error} />}
        </div>
    );
}

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    required?: boolean;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    step?: string | number;
}

export function TextField({ label, value, onChange, error, hint, required, type = 'text', placeholder, disabled, step }: TextFieldProps) {
    return (
        <Field label={label} error={error} hint={hint} required={required}>
            <Input
                type={type}
                step={step}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-required={required}
                className={cn(error && 'border-destructive focus-visible:ring-destructive')}
            />
        </Field>
    );
}

interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    required?: boolean;
    rows?: number;
    placeholder?: string;
}

export function TextAreaField({ label, value, onChange, error, hint, required, rows = 5, placeholder }: TextAreaFieldProps) {
    return (
        <Field label={label} error={error} hint={hint} required={required}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                aria-invalid={Boolean(error)}
                aria-required={required}
                className={cn(
                    'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    error && 'border-destructive focus-visible:ring-destructive',
                )}
            />
        </Field>
    );
}

interface CheckboxFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    hint?: string;
    disabled?: boolean;
}

export function CheckboxField({ label, checked, onChange, error, hint, disabled }: CheckboxFieldProps) {
    return (
        <div className="space-y-2">
            <label className={cn('flex items-center gap-3 text-sm font-medium', disabled && 'cursor-not-allowed opacity-60')}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    className="accent-primary size-4"
                />
                <span>{label}</span>
            </label>
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
            {error && <InputError message={error} />}
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
}

export function SelectField({ label, value, onChange, options, error, hint, required, disabled }: SelectFieldProps) {
    return (
        <Field label={label} error={error} hint={hint} required={required}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                aria-required={required}
                className={cn(
                    'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    error && 'border-destructive focus-visible:ring-destructive',
                )}
            >
                <option value="">Select…</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}
