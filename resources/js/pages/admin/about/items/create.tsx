import { type AboutItemType } from '@/types/about-admin';
import AboutItemForm from './form';

interface AboutItemCreateProps {
    types: AboutItemType[];
    selectedType: AboutItemType;
}

export default function AboutItemCreate({ types, selectedType }: AboutItemCreateProps) {
    return <AboutItemForm types={types} selectedType={selectedType ?? types[0]} />;
}
