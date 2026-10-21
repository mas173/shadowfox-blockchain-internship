import { WalletProvider } from "./context/WalletProvider";
import HeaderNavbar from "./components/HeaderNavbar";
import ProposalDashboard from "./components/ProposalDashboard";

export default function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <HeaderNavbar />
        <ProposalDashboard />
      </div>
    </WalletProvider>
  );
}
