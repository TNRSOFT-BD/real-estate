import { Field } from '@/components/admin/contact/form-fields';
import { Input } from '@/components/ui/input';
import { mediaUrl } from '@/lib/media';

interface FileUploadFieldProps {
    label: string;
    currentSrc?: string | null;
    file: File | null;
    error?: string;
    hint?: string;
    removeFlag?: boolean;
    onToggleRemove?: () => void;
    onChange: (file: File | null) => void;
}

export default function FileUploadField({
    label,
    currentSrc,
    error,
    hint,
    removeFlag = false,
    onToggleRemove,
    onChange,
}: FileUploadFieldProps) {
    const current = !removeFlag ? mediaUrl(currentSrc ?? null) : null;

    return (
        <Field label={label} error={error} hint={hint}>
            <div className="flex flex-col gap-2">
                <Input type="file" accept="application/pdf" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />
                {current && (
                    <a href={current} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs underline">
                        View current document
                    </a>
                )}
                {onToggleRemove && currentSrc && (
                    <button type="button" onClick={onToggleRemove} className="text-muted-foreground hover:text-destructive self-start text-xs underline">
                        {removeFlag ? 'Keep existing document' : 'Remove document'}
                    </button>
                )}
            </div>
        </Field>
    );
}
