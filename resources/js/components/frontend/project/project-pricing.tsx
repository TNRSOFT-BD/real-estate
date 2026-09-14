import { formatArea, formatMoney, formatNumber, statusLabel } from '@/lib/format';
import { type CurrencyConfig, type ProjectPricingPlan } from '@/types/project';
import { Star } from 'lucide-react';
import ProjectSectionHeading from './project-section-heading';

export default function ProjectPricing({ plans, currency }: { plans: ProjectPricingPlan[]; currency: CurrencyConfig }) {
    const validPlans = (plans ?? []).filter((plan) => plan.unit_type.trim() !== '');

    if (validPlans.length === 0) {
        return null;
    }

    return (
        <div>
            <ProjectSectionHeading id="project-pricing-title">Units and Availability</ProjectSectionHeading>

            <div className="border-line overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                    <thead className="bg-glass/60 text-ink-soft border-line border-b text-left text-[11px] tracking-[0.14em] uppercase">
                        <tr>
                            <th className="px-5 py-4 font-medium">Unit type</th>
                            <th className="px-5 py-4 font-medium">Size</th>
                            <th className="px-5 py-4 font-medium">Price / sqft</th>
                            <th className="px-5 py-4 font-medium">Total price</th>
                            <th className="px-5 py-4 font-medium">Booking</th>
                            <th className="px-5 py-4 font-medium">Down payment</th>
                            <th className="px-5 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validPlans.map((plan) => (
                            <tr key={plan.id} className="border-line hover:bg-glass/40 border-b last:border-0">
                                <td className="px-5 py-4">
                                    <span className="text-ink inline-flex items-center gap-2 font-medium">
                                        {plan.unit_type}
                                        {plan.is_featured && <Star className="text-ink size-3.5 fill-current" aria-label="Featured unit" />}
                                    </span>
                                    {plan.installment_plan && <p className="text-ink-soft mt-1 text-xs">Installment: {plan.installment_plan}</p>}
                                </td>
                                <td className="text-ink-soft px-5 py-4">{formatArea(plan.size_sqft) ?? '—'}</td>
                                <td className="text-ink-soft px-5 py-4">{formatMoney(plan.price_per_sqft, currency.symbol) ?? '—'}</td>
                                <td className="text-ink px-5 py-4 font-medium">{formatMoney(plan.total_price, currency.symbol) ?? '—'}</td>
                                <td className="text-ink-soft px-5 py-4">{formatMoney(plan.booking_money, currency.symbol) ?? '—'}</td>
                                <td className="text-ink-soft px-5 py-4">
                                    {plan.down_payment_percentage ? `${formatNumber(plan.down_payment_percentage)}%` : '—'}
                                </td>
                                <td className="px-5 py-4">
                                    <span className="border-line text-ink-soft inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase">
                                        {statusLabel(plan.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
