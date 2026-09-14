import { type PublicProject } from '@/types/project';
import ProjectSectionHeading from './project-section-heading';

export default function ProjectOverview({ project }: { project: PublicProject }) {
    if (!project.overview) {
        return null;
    }

    return (
        <div>
            <ProjectSectionHeading id="project-overview-title">Description</ProjectSectionHeading>

            <div
                className="prose prose-neutral text-ink-soft prose-headings:text-ink prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-p:leading-[1.8] prose-p:text-ink-soft prose-a:text-ink prose-a:underline prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-line prose-blockquote:font-normal prose-blockquote:text-ink-soft prose-hr:border-line prose-li:text-ink-soft max-w-none"
                dangerouslySetInnerHTML={{ __html: project.overview }}
            />
        </div>
    );
}
