import {
  LayoutGrid,
  Users,
  Megaphone,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: LayoutGrid, label: "Overview", to: "/" },
  { icon: Users, label: "User Management", to: "/user-management" },
  { icon: Megaphone, label: "Campaign & Automation", to: "/campaigns" },
  { icon: CreditCard, label: "Payment & Subscription", to: "/payments" },
  { icon: Shield, label: "Account & Security", to: "/security" },
  { icon: HelpCircle, label: "Support", to: "/support" },
  { icon: LogOut, label: "Logout", to: "/logout" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar flex flex-col border-r-2 border-gray-100/10 shrink-0">
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
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-gray-600/30 text-white font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
