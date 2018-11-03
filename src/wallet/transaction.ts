import { WalletAddress } from "./wallet";

export type Transaction = ({
  from: WalletAddress;
  to: WalletAddress;
  amount: number;
});
