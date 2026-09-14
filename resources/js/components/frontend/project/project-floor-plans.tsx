import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type ProjectFloorPlan } from '@/types/project';
import { useState } from 'react';

interface ProjectFloorPlansProps {
    plans: ProjectFloorPlan[];
}

export default function ProjectFloorPlans({ plans }: ProjectFloorPlansProps) {
    const validPlans = plans.filter((plan) => Boolean(plan.image_path));
    const [activeId, setActiveId] = useState(validPlans[0]?.id ?? 0);

    if (validPlans.length === 0) {
        return null;
    }

    const active = validPlans.find((plan) => plan.id === activeId) ?? validPlans[0];

    const details: Array<{ label: string; value: string }> = (
        [
            { label: 'Total Area', value: active.total_area },
            { label: 'Bedroom', value: active.bedrooms },
            { label: 'Bathrooms', value: active.bathrooms },
            { label: 'Balcony', value: active.balcony },
            { label: 'Lounge', value: active.lounge },
        ] as Array<{ label: string; value?: string | null }>
    ).filter((detail): detail is { label: string; value: string } => Boolean(detail.value));

    return (
        <div>
            {validPlans.length > 1 && (
                <div className="border-line mb-8 flex flex-wrap gap-2 border-b" role="tablist" aria-label="Floor plans">
                    {validPlans.map((plan) => (
                        <button
                            key={plan.id}
                            type="button"
                            role="tab"
                            aria-selected={plan.id === active.id}
                            onClick={() => setActiveId(plan.id)}
                            className={cn(
                                'border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                                plan.id === active.id ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink',
                            )}
                        >
                            {plan.title}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                    <div className="border-line overflow-hidden rounded-2xl border">
                        <img src={mediaUrl(active.image_path) ?? ''} alt={active.title} className="aspect-4/3 w-full object-cover" loading="lazy" />
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <h3 className="text-ink text-2xl font-medium tracking-tight">{active.title}</h3>
                    {active.description && <p className="text-ink-soft mt-4 text-sm leading-relaxed">{active.description}</p>}

                    {details.length > 0 && (
                        <dl className="border-line bg-glass/40 mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border p-6">
                            {details.map((detail) => (
                                <div key={detail.label}>
                                    <dt className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">{detail.label}</dt>
                                    <dd className="text-ink mt-1 text-base font-medium">{detail.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </div>
        </div>
    );
}
