import { type PublicProject } from '@/types/project';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Overlay shown on top of the project image slider. It has no solid panel of
 * its own — a black gradient plus a soft blur fade out towards the bottom, so
 * the "Property details" title and breadcrumb sit directly on the image.
 */
export default function ProjectBreadcrumb({ project }: { project: PublicProject }) {
    return (
        <div aria-label="Breadcrumb" className="pointer-events-none absolute inset-x-0 top-0 z-20">
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-transparent" />
            <div
                aria-hidden
                className="absolute inset-0 backdrop-blur-sm [-webkit-mask-image:linear-gradient(to_bottom,black,black_35%,transparent)] [mask-image:linear-gradient(to_bottom,black,black_35%,transparent)]"
            />

            <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:py-10 lg:px-8">
                <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl">Property details</h1>

                <nav aria-label="Breadcrumb" className="mt-3">
                    <ol className="pointer-events-auto flex flex-wrap items-center gap-2 text-xs text-white/90 sm:text-sm">
                        <li>
                            <Link href="/" className="inline-flex items-center gap-1.5 drop-shadow-md transition-colors hover:text-white">
                                <Home className="size-3.5" aria-hidden />
                                Home
                            </Link>
                        </li>
                        <li aria-hidden>
                            <ChevronRight className="size-3.5" />
                        </li>
                        <li className="drop-shadow-md">Projects</li>
                        <li aria-hidden>
                            <ChevronRight className="size-3.5" />
                        </li>
                        <li className="max-w-[60vw] truncate text-white drop-shadow-md" aria-current="page">
                            {project.title}
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    );
}
