import { type AdminLegalItem } from '@/types/legal';
import LegalPageForm from './form';

export default function LegalPageEdit({ page }: { page: AdminLegalItem }) {
    return <LegalPageForm key={page.id} page={page} />;
}
