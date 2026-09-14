import { Link } from '@inertiajs/react';
import { SearchX } from 'lucide-react';

export default function ProjectsEmptyState({ filtered }: { filtered: boolean }) {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-8" aria-label="No projects">
            <div className="border-line flex min-h-[320px] flex-col items-center justify-center gap-4 border px-6 py-16 text-center">
                <SearchX className="text-ink-soft size-8" aria-hidden />
                <h2 className="text-ink text-xl font-semibold">No projects found</h2>
                <p className="text-ink-soft max-w-md text-sm leading-relaxed">
                    {filtered ? 'Try another project type or status.' : 'New developments will be published here soon.'}
                </p>
                {filtered && (
                    <Link
                        href="/projects"
                        className="bg-ink text-canvas hover:opacity-90 mt-2 inline-flex items-center px-5 py-2.5 text-sm font-medium transition-opacity"
                    >
                        Reset filters
                    </Link>
                )}
            </div>
        </section>
    );
}
