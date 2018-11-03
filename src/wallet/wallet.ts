import { Snowflake } from "discord.js";

export type WalletAddress = (string);

export type Wallet = ({
  address: WalletAddress;
  owner: Snowflake;
});
