import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogLayout({ children }) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
