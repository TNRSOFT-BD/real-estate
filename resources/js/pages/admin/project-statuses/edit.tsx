import { type ProjectStatusItem } from '@/types/project-admin';
import ProjectStatusForm from './form';

export default function ProjectStatusEdit({ item }: { item: ProjectStatusItem }) {
    return <ProjectStatusForm key={item.id} item={item} />;
}
