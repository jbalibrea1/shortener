import Footer from '@/components/footer';
import Header from '@/components/header';

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="container max-w-screen-md mx-auto w-full h-full flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}
