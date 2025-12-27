"use client";

import { useAccount, useConnect, useReadContract, useWriteContract } from "wagmi";
import { parseAbi } from "viem";
import { useEffect, useState } from "react";

const CONTRACT = "0x094b52e91509Aa4247D056AD0e655D2C57dec901" as const; 

const ABI = parseAbi([
  "function click() external",
  "function getClicks(address) external view returns (uint256)",
]);

export default function MainContent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const [clicks, setClicks] = useState<bigint>(BigInt(0));
  const [spamming, setSpamming] = useState(false);

  const { data: clicksData } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "getClicks",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    chainId: 8453, // Base Mainnet
    query: { enabled: !!address },
  });

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (clicksData) setClicks(clicksData);
  }, [clicksData]);

  const handleClick = () => {
    if (!isConnected || spamming) return;
    setSpamming(true);
    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "click",
      chainId: 8453,
    });
    setClicks(prev => prev + BigInt(1));
    setTimeout(() => setSpamming(false), 500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      {!isConnected ? (
        <div className="flex flex-col gap-6">
          {connectors
            .filter(c => c.ready)
            .filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i)
            .map(connector => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-6 text-3xl font-bold shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isPending ? "Connecting..." : connector.name}
              </button>
            ))}
        </div>
      ) : (
        <>
          <p className="mb-8 text-5xl font-bold">Clicks</p>
          <p className="mb-20 text-9xl font-black tabular-nums">{clicks.toString()}</p>

          <button
            onClick={handleClick}
            disabled={spamming}
            className="relative h-80 w-80 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-7xl font-bold shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {spamming ? "⏳" : "CLICK"}
            <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></span>
          </button>

          <p className="mt-16 text-sm opacity-60">
            Каждая транзакция — ~0.000001 ETH на Base
          </p>
        </>
      )}
    </main>
  );
}