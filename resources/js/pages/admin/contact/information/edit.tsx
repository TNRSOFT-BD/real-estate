import InformationForm from './form';

interface Props {
    item: Record<string, unknown>;
}

export default function InformationEdit({ item }: Props) {
    return <InformationForm item={item} />;
}