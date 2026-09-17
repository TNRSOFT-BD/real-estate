import { formatArea, formatMoney, formatNumber, statusLabel } from '@/lib/format';
import { type CurrencyConfig, type ProjectPricingPlan } from '@/types/project';
import { Star } from 'lucide-react';
import ProjectSectionHeading from './project-section-heading';

interface PricingRowProps {
    label: string;
    value: string;
    emphasis?: boolean;
}

function PricingRow({ label, value, emphasis = false }: PricingRowProps) {
    return (
        <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-3 text-sm last:border-b-0">
            <dt className="text-ink-soft">{label}</dt>
            <dd className={emphasis ? 'text-ink text-right font-semibold' : 'text-ink-soft text-right'}>{value}</dd>
        </div>
    );
}

export default function ProjectPricing({ plans, currency }: { plans: ProjectPricingPlan[]; currency: CurrencyConfig }) {
    const validPlans = (plans ?? []).filter((plan) => plan.unit_type.trim() !== '');

    if (validPlans.length === 0) {
        return null;
    }

    return (
        <div>
            <ProjectSectionHeading id="project-pricing-title">Units and Availability</ProjectSectionHeading>

            {/* Small & medium devices: stacked cards (no horizontal scroll). */}
            <div className="space-y-4 lg:hidden">
                {validPlans.map((plan) => (
                    <article key={plan.id} className="border-line bg-glass/30 overflow-hidden border">
                        <header className="border-line flex items-start justify-between gap-3 border-b px-5 py-4">
                            <div>
                                <p className="text-ink inline-flex items-center gap-2 text-base font-medium">
                                    {plan.unit_type}
                                    {plan.is_featured && <Star className="text-ink size-4 fill-current" aria-label="Featured unit" />}
                                </p>
                                {plan.installment_plan && <p className="text-ink-soft mt-1 text-xs">Installment: {plan.installment_plan}</p>}
                            </div>

                            <span className="border-line text-ink-soft inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase">
                                {statusLabel(plan.status)}
                            </span>
                        </header>

                        <dl>
                            <PricingRow label="Size" value={formatArea(plan.size_sqft) ?? '—'} />
                            <PricingRow label="Price / sqft" value={formatMoney(plan.price_per_sqft, currency.symbol) ?? '—'} />
                            <PricingRow label="Total price" value={formatMoney(plan.total_price, currency.symbol) ?? '—'} emphasis />
                            <PricingRow label="Booking" value={formatMoney(plan.booking_money, currency.symbol) ?? '—'} />
                            <PricingRow
                                label="Down payment"
                                value={plan.down_payment_percentage ? `${formatNumber(plan.down_payment_percentage)}%` : '—'}
                            />
                        </dl>
                    </article>
                ))}
            </div>

            {/* Large devices: table. */}
            <div className="border-line hidden overflow-x-auto rounded-2xl border lg:block">
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
