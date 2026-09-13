import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { formatArea } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import { type ProjectGalleryImage, type ProjectPricingPlan } from '@/types/project';
import { Expand } from 'lucide-react';

interface FloorPlan {
    key: string;
    unitType: string;
    size?: string | null;
    image: string;
}

export default function ProjectFloorPlans({ plans, gallery }: { plans: ProjectPricingPlan[]; gallery: ProjectGalleryImage[] }) {
    const fromPlans: FloorPlan[] = (plans ?? [])
        .filter((plan) => Boolean(plan.floor_plan_image))
        .map((plan) => ({
            key: `plan-${plan.id}`,
            unitType: plan.unit_type,
            size: formatArea(plan.size_sqft),
            image: plan.floor_plan_image as string,
        }));

    const fromGallery: FloorPlan[] = (gallery ?? [])
        .filter((image) => image.type === 'floor_plan' && Boolean(image.image_path))
        .map((image) => ({
            key: `gallery-${image.id}`,
            unitType: image.caption || image.alt_text || 'Floor plan',
            size: null,
            image: image.image_path,
        }));

    const floorPlans = [...fromPlans, ...fromGallery];

    if (floorPlans.length === 0) {
        return null;
    }

    return (
        <section className="border-line border-y" aria-labelledby="project-floor-plans-title">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
                <Reveal>
                    <SectionLabel>Floor plans</SectionLabel>
                </Reveal>
                <Reveal delay={80}>
                    <h2 id="project-floor-plans-title" className="text-ink mt-6 max-w-2xl text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl">
                        Plan your space
                    </h2>
                </Reveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {floorPlans.map((plan, index) => (
                        <Reveal key={plan.key} delay={index * 60}>
                            <figure className="border-line bg-glass/40 group overflow-hidden rounded-2xl border">
                                <a href={mediaUrl(plan.image) ?? '#'} target="_blank" rel="noopener noreferrer" className="relative block aspect-4/3 overflow-hidden">
                                    <img
                                        src={mediaUrl(plan.image) ?? ''}
                                        alt={`${plan.unitType} floor plan`}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                    />
                                    <span className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                        <Expand className="size-4" />
                                    </span>
                                </a>
                                <figcaption className="flex items-center justify-between gap-4 p-5">
                                    <span className="text-ink text-sm font-medium">{plan.unitType}</span>
                                    {plan.size && <span className="text-ink-soft text-sm">{plan.size}</span>}
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
