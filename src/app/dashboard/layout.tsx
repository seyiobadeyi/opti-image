import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <Header />
            <main className="main-content" style={{ minHeight: '80vh', padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
