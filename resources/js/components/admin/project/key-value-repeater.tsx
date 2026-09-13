import { Field } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import IconSelect from './icon-select';

interface Row {
    key: string;
    value: string;
    icon?: string | null;
}

interface KeyValueRepeaterProps {
    label: string;
    value: Row[];
    onChange: (value: Row[]) => void;
    error?: string;
    hint?: string;
    keyLabel?: string;
    valueLabel?: string;
    withIcon?: boolean;
}

export default function KeyValueRepeater({
    label,
    value,
    onChange,
    error,
    hint,
    keyLabel = 'Key',
    valueLabel = 'Value',
    withIcon = false,
}: KeyValueRepeaterProps) {
    const update = (index: number, field: keyof Row, fieldValue: string) => {
        onChange(value.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: fieldValue } : row)));
    };

    const remove = (index: number) => onChange(value.filter((_, rowIndex) => rowIndex !== index));

    return (
        <Field label={label} error={error} hint={hint}>
            <div className="space-y-2">
                {value.map((row, index) => (
                    <div key={index} className="flex flex-wrap items-end gap-2">
                        {withIcon && (
                            <div className="w-48">
                                <IconSelect value={row.icon ?? ''} onChange={(icon) => update(index, 'icon', icon)} />
                            </div>
                        )}
                        <div className="min-w-40 flex-1">
                            <Input value={row.key} onChange={(event) => update(index, 'key', event.target.value)} placeholder={keyLabel} />
                        </div>
                        <div className="min-w-40 flex-1">
                            <Input value={row.value} onChange={(event) => update(index, 'value', event.target.value)} placeholder={valueLabel} />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove row">
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}

                <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, { key: '', value: '', icon: '' }])}>
                    <Plus className="size-4" />
                    Add row
                </Button>
            </div>
        </Field>
    );
}
