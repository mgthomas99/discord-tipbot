# discord-tipbot

Abstract Discord tip bot for sending and receiving digital currency.

## Features

* **In-memory transactions** - Transactions are stored in memory and sent to the
  RPC in batches, reducing workload and bandwidth.
* **On-demand wallet creation** - Users that do not have wallets are immediately
  assigned an address as soon as they try depositing or receiving funds.

```
!tip 5 <username | snowflake | wallet_address>
```

## License

See the `LICENSE` file for license information.
