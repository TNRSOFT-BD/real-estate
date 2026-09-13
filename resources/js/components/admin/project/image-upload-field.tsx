import { Field } from '@/components/admin/contact/form-fields';
import { Input } from '@/components/ui/input';
import { mediaUrl } from '@/lib/media';

interface ImageUploadFieldProps {
    label: string;
    currentSrc?: string | null;
    file: File | null;
    error?: string;
    hint?: string;
    removeFlag?: boolean;
    onToggleRemove?: () => void;
    onChange: (file: File | null) => void;
}

export default function ImageUploadField({
    label,
    currentSrc,
    file,
    error,
    hint,
    removeFlag = false,
    onToggleRemove,
    onChange,
}: ImageUploadFieldProps) {
    const preview = file ? URL.createObjectURL(file) : removeFlag ? null : mediaUrl(currentSrc ?? null);

    return (
        <Field label={label} error={error} hint={hint}>
            <div className="flex items-center gap-3">
                {preview ? (
                    <img src={preview} alt="" className="h-16 w-16 shrink-0 rounded-md border object-cover" />
                ) : (
                    <div className="bg-muted h-16 w-16 shrink-0 rounded-md border" />
                )}

                <div className="flex flex-col gap-1">
                    <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />
                    {onToggleRemove && currentSrc && (
                        <button type="button" onClick={onToggleRemove} className="text-muted-foreground hover:text-destructive self-start text-xs underline">
                            {removeFlag ? 'Keep existing image' : 'Remove image'}
                        </button>
                    )}
                </div>
            </div>
        </Field>
    );
}
