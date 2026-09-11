import TeamMemberForm from './form';

interface Props {
    item: Record<string, unknown>;
}

export default function TeamEdit({ item }: Props) {
    return <TeamMemberForm item={item} />;
}