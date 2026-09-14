import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type ProjectReview, type ProjectReviewSummary } from '@/types/project';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, Loader2, Star } from 'lucide-react';
import { useState } from 'react';

const fieldClass =
    'text-ink placeholder:text-ink-soft/50 bg-field border-line hover:border-ink/35 focus-visible:border-ink h-11 w-full rounded-xl border px-4 text-sm shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-ink/10 focus-visible:outline-hidden';

function Stars({ rating, className }: { rating: number; className?: string }) {
    return (
        <div className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={cn('size-4', index < rating ? 'text-amber-500 fill-current' : 'text-ink-soft/30')} aria-hidden />
            ))}
        </div>
    );
}

interface ProjectReviewsProps {
    slug: string;
    reviews: ProjectReview[];
    summary: ProjectReviewSummary;
}

export default function ProjectReviews({ slug, reviews, summary }: ProjectReviewsProps) {
    const [submitted, setSubmitted] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        rating: 5,
        comment: '',
        website: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post(route('projects.reviews.store', { slug }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmitted(true);
            },
        });
    };

    return (
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-4">
                    <Stars rating={Math.round(summary.average)} />
                    <span className="text-ink text-sm font-medium">
                        {summary.average || '0'} / 5
                        <span className="text-ink-soft ml-2 font-normal">({summary.count} {summary.count === 1 ? 'review' : 'reviews'})</span>
                    </span>
                </div>

                {reviews.length > 0 ? (
                    <ul className="mt-8 space-y-6">
                        {reviews.map((review) => (
                            <li key={review.id} className="border-line border-b pb-6 last:border-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-ink text-canvas flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium uppercase">
                                            {review.name.charAt(0)}
                                        </span>
                                        <div>
                                            <p className="text-ink text-sm font-medium">{review.name}</p>
                                            <Stars rating={review.rating} className="mt-0.5" />
                                        </div>
                                    </div>
                                    <time className="text-ink-soft text-xs" dateTime={review.created_at}>
                                        {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </time>
                                </div>
                                <p className="text-ink-soft mt-4 text-sm leading-relaxed">{review.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-ink-soft border-line mt-8 rounded-2xl border p-6 text-sm">No reviews yet. Be the first to share your experience.</p>
                )}
            </div>

            <div className="lg:col-span-5">
                <div className="border-line bg-glass/40 rounded-2xl border p-6 sm:p-8">
                    <h3 className="text-ink text-lg font-semibold">Add a Review</h3>

                    {submitted ? (
                        <div className="mt-5">
                            <CheckCircle2 className="text-ink size-6" aria-hidden />
                            <p className="text-ink-soft mt-3 text-sm leading-relaxed">
                                Thank you. Your review has been submitted and will appear once approved.
                            </p>
                            <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSubmitted(false)}>
                                Write another review
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="mt-5 space-y-5" noValidate>
                            <div className="space-y-2">
                                <Label className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">Your rating</Label>
                                <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                                    {Array.from({ length: 5 }).map((_, index) => {
                                        const value = index + 1;
                                        const filled = value <= (hoverRating || data.rating);

                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setData('rating', value)}
                                                onMouseEnter={() => setHoverRating(value)}
                                                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                                            >
                                                <Star className={cn('size-6 transition-colors', filled ? 'text-amber-500 fill-current' : 'text-ink-soft/30')} />
                                            </button>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.rating} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-name" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                    Name
                                </Label>
                                <Input id="review-name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={fieldClass} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-email" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                    Email
                                </Label>
                                <Input id="review-email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={fieldClass} />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-comment" className="text-ink-soft text-[11px] font-medium tracking-[0.18em] uppercase">
                                    Comment
                                </Label>
                                <textarea
                                    id="review-comment"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    rows={4}
                                    className={cn(fieldClass, 'h-auto py-3 leading-relaxed')}
                                />
                                <InputError message={errors.comment} />
                            </div>

                            <div className="hidden" aria-hidden>
                                <Label htmlFor="review-website">Website</Label>
                                <Input id="review-website" value={data.website} onChange={(e) => setData('website', e.target.value)} tabIndex={-1} autoComplete="off" />
                            </div>

                            <Button type="submit" className="bg-ink text-canvas hover:opacity-90 rounded-full px-6" disabled={processing}>
                                {processing ? <Loader2 className="animate-spin" aria-hidden /> : null}
                                Submit review
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
