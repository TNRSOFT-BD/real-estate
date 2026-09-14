import { humanizeLabel } from '@/lib/format';
import { projectIconMap } from '@/lib/project-icons';
import { type PublicProject } from '@/types/project';
import ProjectSectionHeading from './project-section-heading';

export default function ProjectHighlights({ project }: { project: PublicProject }) {
    const features = (project.property_features ?? []).filter((feature) => feature.key.trim() !== '');

    if (features.length === 0) {
        return null;
    }

    return (
        <div>
            <ProjectSectionHeading id="project-highlights-title">Facts and Features</ProjectSectionHeading>

            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                    const Icon = feature.icon ? projectIconMap[feature.icon] : undefined;

                    return (
                        <div key={`${feature.key}-${index}`} className="flex items-start gap-3">
                            {Icon && (
                                <span className="border-line text-ink inline-flex size-10 shrink-0 items-center justify-center rounded-full border" aria-hidden>
                                    <Icon className="size-4.5" />
                                </span>
                            )}
                            <div>
                                <dt className="text-ink-soft text-[10px] font-medium tracking-[0.2em] uppercase">{humanizeLabel(feature.key)}</dt>
                                <dd className="text-ink mt-1 text-base font-medium">{feature.value || '—'}</dd>
                            </div>
                        </div>
                    );
                })}
            </dl>
        </div>
    );
}
