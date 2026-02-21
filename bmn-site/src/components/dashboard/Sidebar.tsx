import DashboardNav from './DashboardNav';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-bmn-border hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto z-10">
      <DashboardNav />
    </aside>
  );
}
