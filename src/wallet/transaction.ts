import { WalletAddress } from "./wallet";

export type TransactionID = (number);

export type Transaction = ({
  from: WalletAddress;
  to: WalletAddress;
  amount: number;
});
