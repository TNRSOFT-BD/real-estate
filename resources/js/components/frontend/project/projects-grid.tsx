import { type PublicProjectCard } from '@/types/project';
import ProjectCard from './project-card';

export default function ProjectsGrid({ projects }: { projects: PublicProjectCard[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} priority={index < 4} />
            ))}
        </div>
    );
}
