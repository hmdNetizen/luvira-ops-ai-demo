import {
  LayoutGrid,
  Users,
  Megaphone,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: Users, label: "User Management" },
  { icon: Megaphone, label: "Campaign & Automation" },
  { icon: CreditCard, label: "Payment & Subscription" },
  { icon: Shield, label: "Account & Security" },
  { icon: HelpCircle, label: "Support" },
  { icon: LogOut, label: "Logout" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      <div className="p-5 flex items-center gap-2">
        <img
          src="/assets/luvira-logo.png"
          alt="Luvira"
          className="h-10 w-auto"
        />
      </div>

      <nav className="flex-1 px-3 py-2">
        <p className="px-3 py-4 text-sm font-semibold text-white tracking-wider">
          General
        </p>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-gray-600/30 text-white font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
