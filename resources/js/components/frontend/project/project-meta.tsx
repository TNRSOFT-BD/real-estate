import { formatDate } from '@/lib/format';
import { type PublicProject } from '@/types/project';
import { Calendar, MessageSquare } from 'lucide-react';

export default function ProjectMeta({ project, reviewCount = 0 }: { project: PublicProject; reviewCount?: number }) {
    const published = formatDate(project.published_at);

    return (
        <div className="border-line text-ink-soft flex flex-wrap items-center gap-x-5 gap-y-2 border-b pb-5 text-sm">
            {project.is_featured && (
                <span className="bg-ink text-canvas rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase">Featured</span>
            )}

            {project.status && (
                <span
                    className="rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white uppercase"
                    style={{ backgroundColor: project.status.color ?? '#e2572b' }}
                >
                    {project.status.name}
                </span>
            )}

            {project.type && (
                <span className="border-line text-ink-soft rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase">
                    {project.type.name}
                </span>
            )}

            {published && (
                <span className="inline-flex items-center gap-2">
                    <Calendar className="size-3.5" aria-hidden />
                    {published}
                </span>
            )}

            <span className="inline-flex items-center gap-2">
                <MessageSquare className="size-3.5" aria-hidden />
                {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
        </div>
    );
}
