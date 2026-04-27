import { LocationSearch } from "@/components";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="z-1 flex items-center justify-between p-4 select-none">
        <div className="py-2 px-4 border rounded-full border-white/20 bg-white/10 backdrop-blur-md">
          Weather Info
        </div>
        <LocationSearch />
      </header>
      {children}
    </>
  );
}
