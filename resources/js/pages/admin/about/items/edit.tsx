import { type AboutItemType, type AdminAboutItem } from '@/types/about-admin';
import AboutItemForm from './form';

interface AboutItemEditProps {
    item: AdminAboutItem;
    types: AboutItemType[];
}

export default function AboutItemEdit({ item, types }: AboutItemEditProps) {
    return <AboutItemForm key={item.id} item={item} types={types} selectedType={item.type} />;
}
