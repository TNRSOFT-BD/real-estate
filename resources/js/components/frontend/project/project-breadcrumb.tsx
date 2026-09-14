import { mediaUrl } from '@/lib/media';
import { type PublicProject } from '@/types/project';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

export default function ProjectBreadcrumb({ project }: { project: PublicProject }) {
    const image = mediaUrl(project.hero_banner);

    return (
        <section className="relative overflow-hidden" aria-label="Breadcrumb">
            {image ? (
                <img src={image} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
            ) : (
                <div aria-hidden className="bg-ink absolute inset-0" />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Property details</h1>
                <nav aria-label="Breadcrumb" className="mt-3">
                    <ol className="flex flex-wrap items-center gap-2 text-xs text-white/75 sm:text-sm">
                        <li>
                            <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                                <Home className="size-3.5" aria-hidden />
                                Home
                            </Link>
                        </li>
                        <li aria-hidden>
                            <ChevronRight className="size-3.5" />
                        </li>
                        <li>Projects</li>
                        <li aria-hidden>
                            <ChevronRight className="size-3.5" />
                        </li>
                        <li className="max-w-[60vw] truncate text-white" aria-current="page">
                            {project.title}
                        </li>
                    </ol>
                </nav>
            </div>
        </section>
    );
}
