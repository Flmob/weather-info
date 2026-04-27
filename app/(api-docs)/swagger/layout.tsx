export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="swagger-wrapper flex align-middle justify-center p-2">
      {children}
    </section>
  );
}
