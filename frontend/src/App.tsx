import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/dashboard/side-bar";
import { Header } from "./components/dashboard/header";
import Overview from "./pages/overview";
import UserManagement from "./pages/user-management";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SimulationProvider } from "./context/simulation-context-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimulationProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/user-management" element={<UserManagement />} />
            </Routes>
          </div>
        </div>
      </SimulationProvider>
    </QueryClientProvider>
  );
}

export default App;
