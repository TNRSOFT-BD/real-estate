import FaqForm from './form';

interface Props {
    item: Record<string, unknown>;
}

export default function FaqEdit({ item }: Props) {
    return <FaqForm item={item} />;
}