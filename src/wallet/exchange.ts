import { EventEmitter } from "events";

import { StrictEventEmitter } from "../../typings/initiative-strict-event-emitter";
import { Transaction } from "./transaction";
import { Wallet } from "./wallet";

export class Exchange {

  public readonly events: StrictEventEmitter<{
    "tx.queued": (tx: Transaction) => any;
    "tx.processed": (tx: Transaction) => any;
  }>;

  public queue: Array<Transaction>;
  public users: Array<Wallet>;

  public constructor() {
    this.events = new EventEmitter();

    this.users = [];
    this.queue = [];
  }

  public processAll()
  : (void) {
    while (this.queue.length > 0) {
      this.processNext();
    }
  }

  public processNext()
  : (void) {
    if (this.queue.length === 0) return;
    const tx = this.queue[0];
    return this.process(tx);
  }

  public process(tx: Transaction)
  : (void) {
    const alice = this.users.find(x => x.address === tx.from);
    const bob = this.users.find(x => x.address === tx.to);

    if (typeof alice === "undefined")
      throw new Error("Sender does not exist");
    if (typeof bob === "undefined")
      throw new Error("Receiver does not exist");

    alice.balance -= tx.amount;
    bob.balance += tx.amount;
  }

  public send(a: Wallet | string, b: Wallet | string, amount: number)
  : (void) {
    if (typeof a === "string") {
      const a_wallet = this.users.find(x => x.address === a);
      return this.send(a_wallet, b, amount);
    }
    if (typeof b === "string") {
      const b_wallet = this.users.find(x => x.address === b);
      return this.send(a, b_wallet, amount);
    }
    if (a === b) return;

    const tx = ({
      from: a.address,
      to: b.address,
      amount
    });

    this.queue.push(tx);
    this.events.emit("tx.queued", tx);
  }

}
