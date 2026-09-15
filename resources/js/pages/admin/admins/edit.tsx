import { type AdminItem } from '@/types/admin';
import AdminForm from './form';

interface AdminEditProps {
    item: AdminItem;
}

export default function AdminEdit({ item }: AdminEditProps) {
    return <AdminForm item={item} />;
}
