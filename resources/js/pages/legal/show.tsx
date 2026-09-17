import PublicLayout from '@/layouts/public-layout';
import { type SharedData } from '@/types';
import { type LegalShowProps } from '@/types/legal';
import { Head, usePage } from '@inertiajs/react';

export default function LegalShow({ page }: LegalShowProps) {
    const { name } = usePage<SharedData>().props;

    const updated = page.updated_at
        ? new Date(page.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <PublicLayout>
            <Head>
                <title>{`${page.title} | ${name}`}</title>
            </Head>

            <article className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 lg:px-8">
                <div className="text-center">
                    <p className="text-ink-soft text-[11px] font-medium tracking-[0.28em] uppercase">Legal</p>
                    <h1 className="text-ink mt-5 text-4xl leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
                        {page.title}
                    </h1>
                    {updated && <p className="text-ink-soft mt-5 text-sm">Last updated: {updated}</p>}
                </div>

                <div
                    className="prose prose-neutral text-ink-soft prose-headings:text-ink prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-p:text-ink-soft prose-a:text-ink prose-a:underline prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-line prose-blockquote:text-ink-soft prose-hr:border-line prose-li:text-ink-soft mt-12 max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </article>
        </PublicLayout>
    );
}
