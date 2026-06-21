import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DashboardPage(): never {
    redirect('/dashboard/optimize');
}
