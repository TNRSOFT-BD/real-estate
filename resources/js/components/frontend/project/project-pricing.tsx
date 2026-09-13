import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { formatArea, formatMoney, formatNumber, statusLabel } from '@/lib/format';
import { type CurrencyConfig, type ProjectPricingPlan } from '@/types/project';
import { Star } from 'lucide-react';

export default function ProjectPricing({ plans, currency }: { plans: ProjectPricingPlan[]; currency: CurrencyConfig }) {
    const validPlans = (plans ?? []).filter((plan) => plan.unit_type.trim() !== '');

    if (validPlans.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="project-pricing-title">
            <Reveal>
                <SectionLabel>Pricing &amp; availability</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
                <h2 id="project-pricing-title" className="text-ink mt-6 max-w-2xl text-3xl leading-[1.08] font-medium tracking-[-0.02em] sm:text-4xl">
                    Units and investment
                </h2>
            </Reveal>

            <div className="mt-12 space-y-4">
                {validPlans.map((plan, index) => {
                    const specs: Array<{ label: string; value: string | null }> = [
                        { label: 'Size', value: formatArea(plan.size_sqft) },
                        { label: `Price / sqft (${currency.code})`, value: formatMoney(plan.price_per_sqft, currency.symbol) },
                        { label: `Total price (${currency.code})`, value: formatMoney(plan.total_price, currency.symbol) },
                        { label: `Booking money (${currency.code})`, value: formatMoney(plan.booking_money, currency.symbol) },
                        { label: 'Down payment', value: plan.down_payment_percentage ? `${formatNumber(plan.down_payment_percentage)}%` : null },
                    ].filter((spec) => spec.value !== null);

                    return (
                        <Reveal key={plan.id} delay={index * 50}>
                            <article
                                className="border-line flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-start lg:justify-between"
                                aria-label={plan.unit_type}
                            >
                                <div className="lg:w-1/4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-ink text-xl font-medium tracking-[-0.01em]">{plan.unit_type}</h3>
                                        {plan.is_featured && <Star className="text-ink size-4 fill-current" aria-label="Featured unit" />}
                                    </div>
                                    <span className="border-line text-ink-soft mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.16em] uppercase">
                                        {statusLabel(plan.status)}
                                    </span>
                                </div>

                                <dl className="grid flex-1 grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
                                    {specs.map((spec) => (
                                        <div key={spec.label}>
                                            <dt className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">{spec.label}</dt>
                                            <dd className="text-ink mt-1.5 text-base font-medium">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </article>

                            {plan.installment_plan && <p className="text-ink-soft -mt-4 text-sm leading-relaxed">Installment: {plan.installment_plan}</p>}
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
