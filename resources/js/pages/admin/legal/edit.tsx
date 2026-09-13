import { type AdminLegalItem, type LegalTypeOption } from '@/types/legal';
import LegalPageForm from './form';

export default function LegalPageEdit({ page, types }: { page: AdminLegalItem; types: LegalTypeOption[] }) {
    return <LegalPageForm key={page.id} page={page} types={types} />;
}
