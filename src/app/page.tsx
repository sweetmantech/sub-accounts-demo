"use client";

import getCreateContractData from "@/lib/getCreateContractData";
import { Address, parseEther, parseEventLogs } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useTransactionReceipt,
} from "wagmi";
import styles from "./page.module.css";
import { zoraCreator1155FactoryImplABI as factoryAbi } from "@zoralabs/protocol-deployments";

function App() {
  const account = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransactionAsync, data } = useSendTransaction();
  const result = useTransactionReceipt({
    hash: data,
  });
  const topics =
    result?.data?.logs &&
    parseEventLogs({
      abi: factoryAbi,
      logs: result?.data?.logs,
      eventName: "SetupNewContract",
    });

  const newArtCollection = topics?.[0]?.args?.newContract;
  const isConnected = account.status === "connected";

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <h2 className={styles.heading}>Sub Accounts on Base</h2>
        <div className={styles.info}>
          <div>
            <span className={styles.label}>Status:</span> {account.status}
          </div>
          <div>
            <span className={styles.label}>Sub Account Address:</span>{" "}
            <span className={styles.addressList}>
              {JSON.stringify(account.addresses)}
            </span>
          </div>
          <div>
            <span className={styles.label}>ChainId:</span> {account.chainId}
          </div>
        </div>
        {isConnected && (
          <button
            className={styles.button}
            type="button"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        )}
      </section>

      <section className={styles.card}>
        <h2 className={styles.heading}>
          {isConnected ? "Create Art on In Process" : "Connect"}
        </h2>
        {!isConnected && (
          <div className={styles.connectors}>
            {connectors
              .filter((connector) => connector.name === "Coinbase Wallet")
              .map((connector) => (
                <button
                  className={styles.button}
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                >
                  Sign in with Smart Wallet
                </button>
              ))}
          </div>
        )}
        {error?.message && <div className={styles.error}>{error?.message}</div>}
        {isConnected && (
          <div className={styles.txSection}>
            <div className={styles.txLabel}>Send Transaction</div>
            <button
              className={styles.button}
              type="button"
              onClick={async () =>
                sendTransactionAsync({
                  to: "0x6832A997D8616707C7b68721D6E9332E77da7F6C",
                  value: parseEther("0"),
                  data: getCreateContractData(
                    account.addresses?.[0] as Address
                  ),
                })
              }
            >
              Create Art Collection
            </button>
            <div className={styles.success}>
              {data && "Art collection created successfully! 🎉"}
            </div>
            <div className={styles.data}>{data}</div>
            {data && newArtCollection && (
              <a
                className={styles.button}
                href={`https://testnet.zora.co/collect/bsep:${newArtCollection}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textAlign: "center",
                  display: "inline-block",
                  marginTop: "0.5rem",
                }}
              >
                View on Zora
              </a>
            )}
            {data && newArtCollection && (
              <a
                className={styles.button}
                href={`https://inprocess.fun/collect/bsep:${newArtCollection}/1`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textAlign: "center",
                  display: "inline-block",
                  marginTop: "0.5rem",
                }}
              >
                View on In Process
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
