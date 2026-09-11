import FormFieldForm from './form';

interface Props {
    item: Record<string, unknown>;
}

export default function FormFieldEdit({ item }: Props) {
    return <FormFieldForm item={item} />;
}