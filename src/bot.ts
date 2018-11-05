import * as discord from "discord.js";

import { StrictEventEmitter } from "../typings/initiative-strict-event-emitter";
import { Exchange } from "./wallet/exchange";
import { Wallet } from "./wallet/wallet";
import { RPC } from "./rpc/rpc";

type Command = ({
  command: string;
  args: string[];
});

/**
 * Utility class for quickly creating a bot for your Discord server.
 */
export class TipBot
extends discord.Client {

  public readonly events: StrictEventEmitter<{
    "user.created": (wallet: Wallet) => void;
  }>;
  public exchange: Exchange;
  public commandPrefix: string;

  public constructor(ex: Exchange, opts?: discord.ClientOptions) {
    super(opts);

    this.on("message", this.onMessage);
    this.commandPrefix = "!";
    this.exchange = ex;
  }

  public async save(rpc: RPC)
  : (Promise<void>) {
    for (const tx of this.exchange.wallets) {

    }
  }

  public isCommand(content: string)
  : (boolean) {
    const prefix = this.commandPrefix;
    return content.startsWith(prefix);
  }

  public parseCommand(content: string)
  : (Command) {
    const [command, ...args] = content
        .substring(this.commandPrefix.length)
        .split(" ");
    return ({
      command,
      args
    });
  }

  private onMessage(msg: discord.Message)
  : (void) {
    const channel = msg.channel;

    if (msg.author.bot) return;
    if (this.isCommand(msg.content)) {
      const cmd = this.parseCommand(msg.content);

      if (cmd.command === "tip") {
        const a = this.exchange.wallets.find(x => x.owner === msg.author.id);
        const b = this.exchange.wallets.find(x => x.owner === cmd.args[1]);
        const amount = Number.parseFloat(cmd.args[0]);

        if (typeof a === "undefined") {
          const user = ({
            owner: msg.author.id,
            address: "",
            balance: 0
          });
          this.exchange.wallets.push(user);
          this.events.emit("user.created", user);
        }
        if (typeof b === "undefined") {
          channel.sendMessage("Recipient doesn't exist on this server");
          return;
        }

        this.exchange.process({
          from: a.address,
          to: b.address,
          amount
        });
        console.log(`${a} tipped ${b} $${amount}`);
      } else {
        console.log("unknown command");
      }
    }
  }

}
