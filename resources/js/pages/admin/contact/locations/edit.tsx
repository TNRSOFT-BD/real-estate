import LocationForm from './form';

interface Props {
    item: Record<string, unknown>;
}

export default function LocationEdit({ item }: Props) {
    return <LocationForm item={item} />;
}