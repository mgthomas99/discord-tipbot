import { EventEmitter } from "events";

import { StrictEventEmitter } from "../../typings/initiative-strict-event-emitter";
import { Transaction } from "./transaction";
import { Wallet } from "./wallet";
import { RPC } from "../rpc/rpc";

export class Exchange {

  public readonly events: StrictEventEmitter<{
    "tx.failed.circular": (tx: Transaction) => void;
    "tx.failed.insufficientfunds": (tx: Transaction) => void;
    "tx.failed.noreceiver": (tx: Transaction) => void;
    "tx.failed.nosender": (tx: Transaction) => void;
    "tx.processed": (tx: Transaction) => void;
  }>;

  public wallets: Array<Wallet>;

  public constructor() {
    this.events = new EventEmitter();
    this.wallets = [];
  }

  public async save(rpc: RPC)
  : (Promise<void>) {
    for (const wallet of this.wallets) {
      await rpc.saveWallet(wallet);
    }
  }

  public async load(rpc: RPC)
  : (Promise<void>) {
    const wallets = await rpc.loadWallets();
    this.wallets = wallets;
  }

  /**
   * Apply the specified transaction to this exchange's accounts.
   *
   * @param   {Transaction} tx
   *          The transaction.
   */
  public process(tx: Transaction)
  : (void) {
    const alice = this.wallets.find(x => x.address === tx.from);
    const bob = this.wallets.find(x => x.address === tx.to);

    if (typeof alice === "undefined") {
      this.events.emit("tx.failed.nosender", tx);
      throw new Error("Sender does not exist");
    } else if (typeof bob === "undefined") {
      this.events.emit("tx.failed.noreceiver", tx);
      throw new Error("Receiver does not exist");
    } else if (alice === bob) {
      this.events.emit("tx.failed.circular", tx);
      return;
    }

    if (alice.balance < tx.amount) {
      this.events.emit("tx.failed.insufficientfunds", tx);
      throw new Error("Sender has insufficient funds");
    }

    alice.balance -= tx.amount;
    bob.balance += tx.amount;
    this.events.emit("tx.processed", tx);
  }

  /**
   *
   * @param   {Wallet | string} alice
   *          The sender.
   * @param   {Wallet | string} bob
   *          The receiver.
   * @param   {number}  amount
   *          The amount to send.
   */
  public send(alice: Wallet | string, bob: Wallet | string, amount: number)
  : (void) {
    if (typeof alice === "string") {
      const a_wallet = this.wallets.find(x => x.address === alice);
      return this.send(a_wallet, bob, amount);
    } else if (typeof bob === "string") {
      const b_wallet = this.wallets.find(x => x.address === bob);
      return this.send(alice, b_wallet, amount);
    } else if (alice === bob) {
      return;
    }

    this.process({
      from: alice.address,
      to: bob.address,
      amount
    });
  }

}
