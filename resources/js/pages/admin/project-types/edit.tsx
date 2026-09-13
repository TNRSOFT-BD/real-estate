import { type ProjectTypeItem } from '@/types/project-admin';
import ProjectTypeForm from './form';

export default function ProjectTypeEdit({ item }: { item: ProjectTypeItem }) {
    return <ProjectTypeForm key={item.id} item={item} />;
}
