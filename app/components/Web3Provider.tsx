import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { lens } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    chains: [lens],
    transports: {
      [lens.id]: http("https://rpc.lens.xyz"),
    },
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    appName: "EverQuiz",
    appDescription: "EverQuiz: The social quiz and party game platform.",
    appUrl: "https://your-everquiz-url.com",
    appIcon: "https://your-everquiz-url.com/icon.png",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
); 