"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, coinbaseWallet } from "wagmi/connectors";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [0x2105],
  connectors: [
    injected({ target: "metaMask" }),
    coinbaseWallet({
      appName: "Base Clicker",
      preference: { options: "all" }, // Лучше всего для Base — без газа на создание аккаунта
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
