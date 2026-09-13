import { type CurrencyConfig, type MediaLimits, type SelectOption } from '@/types/project-admin';
import ProjectForm from './form';

export default function ProjectCreate({
    types,
    statuses,
    currency,
    mediaLimits,
}: {
    types: SelectOption[];
    statuses: SelectOption[];
    currency: CurrencyConfig;
    mediaLimits: MediaLimits;
}) {
    return <ProjectForm types={types} statuses={statuses} currency={currency} mediaLimits={mediaLimits} />;
}
