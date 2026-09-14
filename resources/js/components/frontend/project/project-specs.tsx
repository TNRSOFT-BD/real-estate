import { formatDate, formatMoney, formatNumber } from '@/lib/format';
import { type CurrencyConfig, type ProjectPricingPlan, type PublicProject } from '@/types/project';

interface Spec {
    label: string;
    value: string;
    dot?: string | null;
}

interface ProjectSpecsProps {
    project: PublicProject;
    plans: ProjectPricingPlan[];
    currency: CurrencyConfig;
}

export function priceRange(plans: ProjectPricingPlan[], currency: CurrencyConfig): string | null {
    const prices = plans
        .map((plan) => (plan.total_price != null && plan.total_price !== '' ? Number(plan.total_price) : null))
        .filter((value): value is number => value !== null && Number.isFinite(value));

    if (prices.length === 0) {
        return null;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const minLabel = formatMoney(min, currency.symbol);

    if (min === max || minLabel === null) {
        return minLabel;
    }

    const maxLabel = formatMoney(max, currency.symbol);

    return `${minLabel} – ${maxLabel}`;
}

export default function ProjectSpecs({ project, plans, currency }: ProjectSpecsProps) {
    const location = [project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');
    const range = priceRange(plans, currency);

    const specs: Spec[] = [
        project.project_code ? { label: 'Property ID', value: project.project_code } : null,
        project.type?.name ? { label: 'Property type', value: project.type.name } : null,
        project.status?.name ? { label: 'Property status', value: project.status.name, dot: project.status.color ?? null } : null,
        project.total_land_area ? { label: 'Land area', value: formatNumber(project.total_land_area) ?? String(project.total_land_area) } : null,
        project.total_units != null ? { label: 'Total units', value: String(project.total_units) } : null,
        project.number_of_floors != null ? { label: 'Floors', value: String(project.number_of_floors) } : null,
        project.number_of_buildings != null ? { label: 'Buildings', value: String(project.number_of_buildings) } : null,
        project.units_per_floor != null ? { label: 'Units per floor', value: String(project.units_per_floor) } : null,
        plans.length > 0 ? { label: 'Unit types', value: String(plans.length) } : null,
        project.handover_date ? { label: 'Handover', value: formatDate(project.handover_date) ?? '' } : null,
        location ? { label: 'Location', value: location } : null,
        range ? { label: `Price range (${currency.code})`, value: range } : null,
    ].filter((spec): spec is Spec => spec !== null);

    if (specs.length === 0) {
        return null;
    }

    return (
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {specs.map((spec) => (
                <div key={spec.label} className="border-line flex items-baseline justify-between gap-4 border-b pb-3">
                    <dt className="text-ink-soft flex items-center gap-2 text-sm">
                        {spec.dot && <span className="size-2 rounded-full" style={{ backgroundColor: spec.dot }} aria-hidden />}
                        {spec.label}
                    </dt>
                    <dd className="text-ink text-right text-sm font-medium">{spec.value}</dd>
                </div>
            ))}
        </dl>
    );
}
