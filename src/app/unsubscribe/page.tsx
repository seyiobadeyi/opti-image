import type { Metadata } from 'next';
import UnsubscribeClient from './UnsubscribeClient';

export const metadata: Metadata = {
    title: 'Unsubscribe — Optimage',
    robots: { index: false, follow: false },
};

interface Props {
    searchParams: Promise<{ email?: string }>;
}

export default async function UnsubscribePage({ searchParams }: Props) {
    const { email } = await searchParams;
    return <UnsubscribeClient email={email ?? ''} />;
}
