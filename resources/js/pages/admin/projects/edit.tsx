import { type AdminProjectItem, type CurrencyConfig, type MediaLimits, type SelectOption } from '@/types/project-admin';
import ProjectForm from './form';

export default function ProjectEdit({
    project,
    types,
    statuses,
    currency,
    mediaLimits,
}: {
    project: AdminProjectItem;
    types: SelectOption[];
    statuses: SelectOption[];
    currency: CurrencyConfig;
    mediaLimits: MediaLimits;
}) {
    return <ProjectForm key={project.id} project={project} types={types} statuses={statuses} currency={currency} mediaLimits={mediaLimits} />;
}
