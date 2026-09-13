import { type LegalTypeOption } from '@/types/legal';
import LegalPageForm from './form';

export default function LegalPageCreate({ types }: { types: LegalTypeOption[] }) {
    return <LegalPageForm types={types} />;
}
