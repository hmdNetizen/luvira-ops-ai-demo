import { useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { GrowthCampaignsChart } from "../components/dashboard/growth-campaigns-chart";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  dateJoined: string;
  generatedCards: number;
  subscription: string;
  avatar: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Philip Light",
    email: "philigt@gmail.com",
    username: "@phi_lit12",
    dateJoined: "May. 12th, 2025",
    generatedCards: 200,
    subscription: "Basic plan",
    avatar: "bg-purple-500",
  },
  {
    id: 2,
    name: "Freeman John",
    email: "freemanjohn@gmail.com",
    username: "@freemanjohn88",
    dateJoined: "May. 13th, 2025",
    generatedCards: 500,
    subscription: "Enterprise plan",
    avatar: "bg-blue-500",
  },
  {
    id: 3,
    name: "Vivian Brown",
    email: "vivianbrown11@gmail.com",
    username: "@vivibrown",
    dateJoined: "May. 13th, 2025",
    generatedCards: 25,
    subscription: "Premium plan",
    avatar: "bg-pink-500",
  },
  {
    id: 4,
    name: "Tony Light",
    email: "ttlight@gmail.com",
    username: "@ttlight",
    dateJoined: "May. 13th, 2025",
    generatedCards: 0,
    subscription: "Enterprise plan",
    avatar: "bg-teal-500",
  },
  {
    id: 5,
    name: "Philip May",
    email: "philigt@gmail.com",
    username: "@phi_lit12",
    dateJoined: "May. 14th, 2025",
    generatedCards: 0,
    subscription: "Basic plan",
    avatar: "bg-orange-500",
  },
  {
    id: 6,
    name: "Luke Man",
    email: "lukeman23@gmail.com",
    username: "@luki23",
    dateJoined: "May. 15th, 2025",
    generatedCards: 0,
    subscription: "Premium plan",
    avatar: "bg-green-500",
  },
  {
    id: 7,
    name: "Pauline Stie",
    email: "paulinestike@gmail.com",
    username: "@paulinestike",
    dateJoined: "May. 15th, 2025",
    generatedCards: 0,
    subscription: "Basic plan",
    avatar: "bg-red-500",
  },
  {
    id: 8,
    name: "Ekene Orji",
    email: "ekeneorji@gmail.com",
    username: "@ekene3339",
    dateJoined: "May. 16th, 2025",
    generatedCards: 0,
    subscription: "Basic plan",
    avatar: "bg-indigo-500",
  },
  {
    id: 9,
    name: "Eugene Mark",
    email: "eugenemark32@gmail.com",
    username: "@eugenemark45",
    dateJoined: "May. 17th, 2025",
    generatedCards: 0,
    subscription: "Premium plan",
    avatar: "bg-yellow-500",
  },
  {
    id: 10,
    name: "Luke Man",
    email: "lukeman23@gmail.com",
    username: "@luki23",
    dateJoined: "May. 19th, 2025",
    generatedCards: 0,
    subscription: "Enterprise plan",
    avatar: "bg-cyan-500",
  },
];

const columns = [
  "Names",
  "Email Address",
  "Username",
  "Date Joined",
  "Generated Cards",
  "Subscription",
];

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">User Management</h2>

      {/* Filters */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1c1d1f] border-2 border-gray-100/10 rounded-lg px-3 py-2 w-72">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by username, email address"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>

          <Button
            variant="outline"
            className="gap-2 bg-[#1c1d1f] border-2 border-gray-100/10 text-foreground"
          >
            All Subscription
            <ChevronDown className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-[#1c1d1f] border-2 border-gray-100/10 text-foreground"
          >
            <Calendar className="size-4" />
            Select Dates
            <ChevronDown className="size-4" />
          </Button>

          <Button
            variant="outline"
            className="gap-2 bg-[#1c1d1f] border-2 border-gray-100/10 text-foreground"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1c1d1f] rounded-md border-2 border-gray-100/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100/10 bg-gray-50/5">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left text-xs font-medium text-muted-foreground px-4 py-3"
                >
                  {col}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border last:border-b-0 hover:bg-white/2 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full ${user.avatar} flex items-center justify-center text-white text-xs font-medium shrink-0`}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {user.username}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {user.dateJoined}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {user.generatedCards}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {user.subscription}
                </td>
                <td className="px-4 py-3">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-transparent border-border text-muted-foreground text-xs"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-3" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`size-8 rounded-md text-xs font-medium transition-colors ${
                  currentPage === page
                    ? "bg-brand text-primary-foreground"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-muted-foreground text-xs px-1">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`size-8 rounded-md text-xs font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-brand text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              {totalPages}
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-transparent border-border text-muted-foreground text-xs"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-3" />
          </Button>
        </div>
      </div>

      {/* Bottom section: Date selector + Growth chart */}
      <div className="flex gap-5">
        <div className="flex-1">
          <Button
            variant="outline"
            className="gap-2 bg-[#1c1d1f] border-border text-foreground"
          >
            <Calendar className="size-4" />
            Select Dates
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-5">
        <GrowthCampaignsChart />
      </div>
    </main>
  );
}
