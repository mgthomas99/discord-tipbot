import { Transaction } from "../wallet/transaction";
import { WalletAddress, Wallet } from "../wallet/wallet";

/**
 * RPC is responsible for saving, loading, and actually transferring funds
 * between accounts (outside of memory).
 */
export interface RPC {

  /**
   * @param   {Transaction} tx
   *          The transaction.
   * @return  {void}
   */
  process(tx: Transaction)
  : (Promise<void>);

  /**
   * @param   {Wallet}  wallet
   *          The wallet.
   * @return  {void}
   */
  saveWallet(wallet: Wallet)
  : (Promise<void>);

  /**
   * @return  {Wallet[]}
   *          All wallets saved by this RPC.
   */
  loadWallets()
  : (Promise<Wallet[]>);

  /**
   * @param   {WalletAddress} address
   *          The wallet address.
   * @return  {number}
   *          The wallet with the specified address.
   */
  loadWallet(address: WalletAddress)
  : (Promise<Wallet>);

}
