import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate, formatNumber } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { type CurrencyConfig, type ProjectPricingPlan, type PublicProject } from '@/types/project';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Download, Loader2, Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { priceRange } from './project-specs';

interface ProjectSidebarProps {
    project: PublicProject;
    plans: ProjectPricingPlan[];
    currency: CurrencyConfig;
}

const fieldClass =
    'text-ink placeholder:text-ink-soft/50 bg-field border-line hover:border-ink/35 focus-visible:border-ink h-11 w-full rounded-xl border px-4 text-sm shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-ink/10 focus-visible:outline-hidden';

export default function ProjectSidebar({ project, plans, currency }: ProjectSidebarProps) {
    const { name, company, footer } = usePage<SharedData>().props;
    const [submitted, setSubmitted] = useState(false);

    const range = priceRange(plans, currency);
    const location = [project.location_area, project.location_city, project.location_country].filter(Boolean).join(', ');
    const phone = footer?.information?.find((item) => ['hotline', 'phone'].includes(item.type));
    const email = footer?.information?.find((item) => item.type === 'email');

    const facts: Array<{ label: string; value: string }> = (
        [
            range ? { label: `Price range (${currency.code})`, value: range } : null,
            project.status?.name ? { label: 'Status', value: project.status.name } : null,
            project.type?.name ? { label: 'Property type', value: project.type.name } : null,
            project.total_land_area ? { label: 'Land area', value: formatNumber(project.total_land_area) ?? '' } : null,
            project.total_units != null ? { label: 'Total units', value: String(project.total_units) } : null,
            project.number_of_floors != null ? { label: 'Floors', value: String(project.number_of_floors) } : null,
            project.handover_date ? { label: 'Handover', value: formatDate(project.handover_date) ?? '' } : null,
            location ? { label: 'Location', value: location } : null,
        ] as Array<{ label: string; value: string } | null>
    ).filter((fact): fact is { label: string; value: string } => fact !== null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        website: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post(route('projects.enquiry', { slug: project.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmitted(true);
            },
        });
    };

    return (
        <aside className="space-y-6" aria-label="Project sidebar">
            {facts.length > 0 && (
                <div className="border-line bg-glass/40 rounded-2xl border p-6">
                    <h2 className="text-ink text-lg font-semibold">Key details</h2>
                    <dl className="mt-5 space-y-3.5">
                        {facts.map((fact) => (
                            <div key={fact.label} className="border-line flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                                <dt className="text-ink-soft text-xs">{fact.label}</dt>
                                <dd className="text-ink max-w-[60%] text-right text-sm font-medium">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>

                    {project.brochure_pdf && (
                        <a
                            href={mediaUrl(project.brochure_pdf) ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-line text-ink hover:bg-glass-strong mt-6 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
                        >
                            <Download className="size-4" />
                            Download brochure
                        </a>
                    )}
                </div>
            )}

            <div className="border-line bg-glass/40 rounded-2xl border p-6 text-center">
                {company?.logo ? (
                    <img src={mediaUrl(company.logo) ?? undefined} alt={name} className="mx-auto h-12 w-auto max-w-[180px] object-contain" />
                ) : (
                    <span className="bg-ink text-canvas mx-auto flex size-14 items-center justify-center rounded-full">
                        <AppLogoIcon className="size-7 fill-current" />
                    </span>
                )}
                <h2 className="text-ink mt-4 text-lg font-semibold">{name}</h2>
                {company?.tagline && <p className="text-ink-soft mt-1 text-sm">{company.tagline}</p>}

                <div className="text-ink-soft mt-5 space-y-2 text-sm">
                    {phone && (
                        <a href={phone.link ?? `tel:${phone.value}`} className="hover:text-ink inline-flex items-center gap-2 transition-colors">
                            <Phone className="size-3.5" />
                            {phone.value}
                        </a>
                    )}
                    {email && (
                        <a href={email.link ?? `mailto:${email.value}`} className="hover:text-ink flex items-center justify-center gap-2 break-all transition-colors">
                            <Mail className="size-3.5" />
                            {email.value}
                        </a>
                    )}
                </div>

                <Button asChild variant="outline" className="mt-5 w-full rounded-full">
                    <Link href="/contact">Contact our team</Link>
                </Button>
            </div>

            <div className="border-line bg-glass/40 rounded-2xl border p-6">
                <h2 className="text-ink text-lg font-semibold">Enquire about this project</h2>
                <p className="text-ink-soft mt-1 text-sm">Send us a message and our team will be in touch.</p>

                {submitted ? (
                    <div className="mt-5">
                        <CheckCircle2 className="text-ink size-6" aria-hidden />
                        <p className="text-ink-soft mt-3 text-sm leading-relaxed">Thank you. Your enquiry has been sent successfully.</p>
                        <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSubmitted(false)}>
                            Send another enquiry
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
                        <div className="space-y-2">
                            <Label htmlFor="enquiry-name" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                Your name
                            </Label>
                            <Input id="enquiry-name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={fieldClass} />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="enquiry-email" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                Your email
                            </Label>
                            <Input id="enquiry-email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={fieldClass} />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="enquiry-phone" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                Phone (optional)
                            </Label>
                            <Input id="enquiry-phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={fieldClass} />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="enquiry-message" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                Message
                            </Label>
                            <textarea
                                id="enquiry-message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={4}
                                placeholder="I'm interested in this project…"
                                className={cn(fieldClass, 'h-auto py-3 leading-relaxed')}
                            />
                            <InputError message={errors.message} />
                        </div>

                        <div className="hidden" aria-hidden>
                            <Label htmlFor="enquiry-website">Website</Label>
                            <Input id="enquiry-website" value={data.website} onChange={(e) => setData('website', e.target.value)} tabIndex={-1} autoComplete="off" />
                        </div>

                        <Button type="submit" className="bg-ink text-canvas hover:opacity-90 w-full rounded-full" disabled={processing}>
                            {processing ? <Loader2 className="animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
                            Send message
                        </Button>
                    </form>
                )}
            </div>
        </aside>
    );
}
