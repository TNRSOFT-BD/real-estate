import { cn } from '@/lib/utils';
import { type PublicProjectCard } from '@/types/project';
import ProjectCard from './project-card';

interface ProjectsGridProps {
    projects: PublicProjectCard[];
    size?: 'default' | 'large';
}

export default function ProjectsGrid({ projects, size = 'default' }: ProjectsGridProps) {
    return (
        <div
            className={cn(
                'grid gap-6 sm:gap-8',
                size === 'large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            )}
        >
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} priority={index < 4} />
            ))}
        </div>
    );
}
