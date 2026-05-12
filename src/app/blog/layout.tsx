import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
