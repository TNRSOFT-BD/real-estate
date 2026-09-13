import { Field } from '@/components/admin/contact/form-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type AmenityItem } from '@/types/project-admin';
import { Plus, Trash2 } from 'lucide-react';
import IconSelect from './icon-select';

interface AmenityRepeaterProps {
    label: string;
    value: AmenityItem[];
    onChange: (value: AmenityItem[]) => void;
    error?: string;
    hint?: string;
}

export default function AmenityRepeater({ label, value, onChange, error, hint }: AmenityRepeaterProps) {
    const update = (index: number, field: keyof AmenityItem, fieldValue: string) => {
        onChange(value.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: fieldValue } : row)));
    };

    const remove = (index: number) => onChange(value.filter((_, rowIndex) => rowIndex !== index));

    return (
        <Field label={label} error={error} hint={hint}>
            <div className="space-y-2">
                {value.map((row, index) => (
                    <div key={index} className="flex flex-wrap items-end gap-2">
                        <div className="w-48">
                            <IconSelect value={row.icon ?? ''} onChange={(icon) => update(index, 'icon', icon)} />
                        </div>
                        <div className="min-w-40 flex-1">
                            <Input value={row.name} onChange={(event) => update(index, 'name', event.target.value)} placeholder="e.g. Swimming Pool" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove amenity">
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}

                <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, { name: '', icon: '' }])}>
                    <Plus className="size-4" />
                    Add amenity
                </Button>
            </div>
        </Field>
    );
}
