import SocialLinkForm from './form';

interface Props {
    item: Record<string, unknown>;
}

export default function SocialLinkEdit({ item }: Props) {
    return <SocialLinkForm item={item} />;
}