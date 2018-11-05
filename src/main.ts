import { Exchange } from "./wallet/exchange";
import { TipBot } from "./bot";

// Sample implementation test.

const exchange = new Exchange();
const bot = new TipBot(exchange);

exchange.events.on("tx.processed", function (tx) {
  console.log(`${tx.amount} sent from ${tx.from} to ${tx.to}`);
});

bot.on("ready", function () {
  console.log("Online!");
});

bot.login(process.env.API_KEY);
