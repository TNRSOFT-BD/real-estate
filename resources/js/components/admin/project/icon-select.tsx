import { SelectField } from '@/components/admin/contact/form-fields';
import { projectIconMap, projectIconOptions } from '@/lib/project-icons';

const options = [{ value: '', label: 'No icon' }, ...projectIconOptions];

interface IconSelectProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export default function IconSelect({ value, onChange, label = 'Icon' }: IconSelectProps) {
    const Icon = value ? projectIconMap[value] : undefined;

    return (
        <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
                <SelectField label={label} value={value} onChange={onChange} options={options} />
            </div>
            {Icon && (
                <span className="mt-5 inline-flex size-9 shrink-0 items-center justify-center rounded-md border" aria-hidden>
                    <Icon className="size-4" />
                </span>
            )}
        </div>
    );
}
