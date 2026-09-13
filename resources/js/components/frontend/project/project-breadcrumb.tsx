import { type PublicProject } from '@/types/project';
import { Link } from '@inertiajs/react';

export default function ProjectBreadcrumb({ project }: { project: PublicProject }) {
    return (
        <nav aria-label="Breadcrumb" className="border-line border-b">
            <div className="text-ink-soft mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-4 text-xs lg:px-8">
                <Link href="/" className="hover:text-ink transition-colors">
                    Home
                </Link>
                <span aria-hidden>/</span>
                <span>Projects</span>
                <span aria-hidden>/</span>
                <span className="text-ink truncate" aria-current="page">
                    {project.title}
                </span>
            </div>
        </nav>
    );
}
