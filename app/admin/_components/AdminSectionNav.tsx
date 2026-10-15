type Section = "overview" | "products" | "categories" | "collections" | "analytics" | "settings";

const items: { label: string; href: string; key: Section }[] = [
  { label: "Overview", href: "/admin", key: "overview" },
  { label: "Products", href: "/admin/products", key: "products" },
  { label: "Categories", href: "/admin/categories", key: "categories" },
  { label: "Collections", href: "/admin/collections", key: "collections" },
  { label: "Analytics", href: "/admin/analytics", key: "analytics" },
  { label: "Settings", href: "/admin/settings", key: "settings" },
];

export default function AdminSectionNav({ current }: { current: Section }) {
  return (
    <nav aria-label="Admin navigation" className="border-b border-[#E6E8E2] bg-[#FFFDF9]">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-8 lg:px-10">
        {items.map((item) => {
          const active = item.key === current;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${active ? "bg-[#176B6B] font-semibold text-white" : "text-[#687572] hover:bg-white hover:text-[#176B6B]"}`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
