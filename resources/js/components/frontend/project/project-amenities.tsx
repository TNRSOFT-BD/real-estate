import { amenityName } from '@/lib/format';
import { projectIconMap } from '@/lib/project-icons';
import { cn } from '@/lib/utils';
import { type ProjectAmenity, type PublicProject } from '@/types/project';
import { Check } from 'lucide-react';

export default function ProjectAmenities({ project }: { project: PublicProject }) {
    const amenities = (project.amenities ?? [])
        .map((item): ProjectAmenity => (typeof item === 'string' ? { name: item } : item))
        .filter((item) => item.name.trim() !== '');

    if (amenities.length === 0) {
        return null;
    }

    return (
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity, index) => {
                const Icon = amenity.icon ? projectIconMap[amenity.icon] : undefined;
                const name = amenityName(amenity);

                return (
                    <li key={`${name}-${index}`} className="flex items-center gap-3">
                        <span className={cn('border-line text-ink inline-flex size-8 shrink-0 items-center justify-center rounded-md border')} aria-hidden>
                            {Icon ? <Icon className="size-4" /> : <Check className="size-4" />}
                        </span>
                        <span className="text-ink text-sm sm:text-base">{name}</span>
                    </li>
                );
            })}
        </ul>
    );
}
