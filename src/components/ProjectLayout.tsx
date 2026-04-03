export default function ProjectLayout({
    sidebar,
    children,
  }: {
    sidebar: React.ReactNode;
    children: React.ReactNode;
  }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[minmax(250px,1fr)_4.5fr]">
        {/* Sidebar – full height, sticky, but scrolls away when footer appears */}
        <aside className="bg-[#090909] text-white pr-6 pl-6 pt-14 md:pt-0 h-fit md:sticky md:top-12 md:h-screen">
  <div className="md:h-[calc(100vh-49px)]">{sidebar}</div>
</aside>



  
        {/* Main content */}
        <main className="bg-white w-full">
          <div className="">{children}</div>
        </main>
      </div>
    );
  }
  