import * as request from "supertest";
import { setTimeout } from "timers/promises";

import { environment } from "../../../../src/config";
import { localConfig } from "../../../../src/config";
import { Buffer, Token, Wallets } from "../../../../src/entities";
import { Helper } from "../../../../src/helper";

describe("Address", () => {
  jest.setTimeout(localConfig.standardTimeout);

  const helper = new Helper();
  const bufferFile = "src/playbook/";
  let token: string;
  let contract: string;
  let txHash: string;

  describe("/address/{address}", () => {
    //@id1457
    it("Verify deployed to L2 NFT via /address/{address}", async () => {
      token = await helper.getStringFromFile(bufferFile + Buffer.NFTtoL2);

      await setTimeout(localConfig.extendedPause);
      const apiRoute = `/address/${token}`;

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              type: "contract",
              address: token,
              balances: {
                [`${token}`]: {
                  balance: "1",
                  token: null,
                },
              },
            })
          )
        );
    });

    //@id1464
    it("Verify the deployed Root contract via /address/{address}", async () => {
      await setTimeout(localConfig.standardPause); //works unstable without timeout
      contract = await helper.getStringFromFile(bufferFile + Buffer.addressMultiCallRoot);
      txHash = await helper.getStringFromFile(bufferFile + Buffer.txMultiCallRoot);

      const apiRoute = `/address/${contract}`;

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ type: "contract" })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ address: contract })))
        .expect((res) =>
          expect(res.body).toStrictEqual(expect.objectContaining({ creatorAddress: Wallets.richWalletAddress }))
        )
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ creatorTxHash: txHash })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ balances: {} })));
    });

    //@id1465
    it("Verify the deployed Middle contract via /address/{address}", async () => {
      await setTimeout(localConfig.standardPause); //works unstable without timeout
      contract = await helper.getStringFromFile(bufferFile + Buffer.addressMultiCallMiddle);
      txHash = await helper.getStringFromFile(bufferFile + Buffer.txMultiCallMiddle);

      const apiRoute = `/address/${contract}`;

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ type: "contract" })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ address: contract })))
        .expect((res) =>
          expect(res.body).toStrictEqual(expect.objectContaining({ creatorAddress: Wallets.richWalletAddress }))
        )
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ creatorTxHash: txHash })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ balances: {} })));
    });

    //@id1466
    it("Verify the deployed Caller contract via /address/{address}", async () => {
      await setTimeout(localConfig.standardPause); //works unstable without timeout
      contract = await helper.getStringFromFile(bufferFile + Buffer.addressMultiCallCaller);
      txHash = await helper.getStringFromFile(bufferFile + Buffer.txMultiCallCaller);

      const apiRoute = `/address/${contract}`;

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ type: "contract" })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ address: contract })))
        .expect((res) =>
          expect(res.body).toStrictEqual(expect.objectContaining({ creatorAddress: Wallets.richWalletAddress }))
        )
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ creatorTxHash: txHash })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ balances: {} })));
    });

    //@id1476
    it("Verify the deployed multitransfer contract via /address/{address}", async () => {
      await setTimeout(localConfig.standardPause); //works unstable without timeout

      const apiRoute = `/address/${contract}`;

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ address: contract })))
        .expect((res) =>
          expect(res.body).toStrictEqual(expect.objectContaining({ creatorAddress: Wallets.richWalletAddress }))
        );
    });

    //@id1449
    it("Verify the deployed Greeter contract via /address/{address}", async () => {
      const apiRoute = `/address/${contract}`;

      await setTimeout(localConfig.standardPause); //works unstable without timeout

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ address: contract })))
        .expect((res) => expect(res.body).toStrictEqual(expect.objectContaining({ balances: {} })));
    });
  });

  describe("/address/{address}/logs", () => {
    //@id1510
    it("Verify the transaction via /address/{address}/logs", async () => {
      contract = await helper.getStringFromFile(bufferFile + Buffer.greeterL2);
      txHash = await helper.getStringFromFile(bufferFile + Buffer.executeGreeterTx);

      const apiRoute = `/address/${contract}/logs`;
      const decapitalizedAddress = apiRoute.slice(1).toLowerCase();

      await setTimeout(localConfig.standardPause); //works unstable without timeout

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ address: contract })))
        .expect((res) => expect(Array.isArray(res.body.items[0].topics)).toStrictEqual(true))
        .expect((res) => expect(typeof res.body.items[0].data).toStrictEqual("string"))
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ transactionHash: txHash })))
        .expect((res) => expect(typeof res.body.items[0].transactionIndex).toStrictEqual("number"))
        .expect((res) => expect(typeof res.body.items[0].logIndex).toStrictEqual("number"))
        .expect((res) => expect(typeof res.body.items[0].timestamp).toStrictEqual("string"))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ totalItems: 1 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ itemCount: 1 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ itemsPerPage: 10 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ totalPages: 1 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ currentPage: 1 })))
        .expect((res) =>
          expect(res.body.links).toStrictEqual(expect.objectContaining({ first: `${decapitalizedAddress}?limit=10` }))
        )
        .expect((res) => expect(res.body.links).toStrictEqual(expect.objectContaining({ previous: "" })))
        .expect((res) => expect(res.body.links).toStrictEqual(expect.objectContaining({ next: "" })))
        .expect((res) =>
          expect(res.body.links).toStrictEqual(
            expect.objectContaining({ last: `${decapitalizedAddress}?page=1&limit=10` })
          )
        );
    });
  });

  describe("/address/{address}/logs", () => {
    //@id1509
    it("Verify the transaction via /address/{address}/transfers", async () => {
      contract = await helper.getStringFromFile(bufferFile + Buffer.paymaster);
      const emptyWallet = await helper.getStringFromFile(bufferFile + Buffer.emptyWalletAddress);
      txHash = await helper.getStringFromFile(bufferFile + Buffer.paymasterTx);

      const customTokenAddress = await helper.getStringFromFile(bufferFile + Buffer.customToken);
      const apiRoute = `/address/${contract}/transfers`;
      const decapitalizedAddress = apiRoute.slice(1).toLowerCase();

      await setTimeout(localConfig.standardPause); //works unstable without timeout

      return request(environment.blockExplorerAPI)
        .get(apiRoute)
        .expect(200)
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ from: emptyWallet })))
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ to: contract })))
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ transactionHash: txHash })))
        .expect((res) => expect(typeof res.body.items[0].timestamp).toStrictEqual("string"))
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ amount: "1" })))
        .expect((res) =>
          expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ tokenAddress: customTokenAddress }))
        )
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ type: "transfer" })))
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ fields: null })))
        .expect((res) => expect(res.body.items[0]).toStrictEqual(expect.objectContaining({ fields: null })))
        .expect((res) =>
          expect(res.body.items[0].token).toStrictEqual(expect.objectContaining({ l2Address: customTokenAddress }))
        )
        .expect((res) => expect(res.body.items[0].token).toStrictEqual(expect.objectContaining({ l1Address: null })))
        .expect((res) => expect(res.body.items[0].token).toStrictEqual(expect.objectContaining({ symbol: "MyToken" })))
        .expect((res) => expect(res.body.items[0].token).toStrictEqual(expect.objectContaining({ name: "MyToken" })))
        .expect((res) => expect(res.body.items[0].token).toStrictEqual(expect.objectContaining({ decimals: 18 })))
        .expect((res) =>
          expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ from: Wallets.richWalletAddress }))
        )
        .expect((res) => expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ to: contract })))
        .expect((res) => expect(typeof res.body.items[1].timestamp).toStrictEqual("string"))
        .expect((res) =>
          expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ amount: "30000000000000000" }))
        )
        .expect((res) =>
          expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ tokenAddress: Token.ETHER_ERC20_Address }))
        )
        .expect((res) => expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ type: "transfer" })))
        .expect((res) => expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ fields: null })))
        .expect((res) => expect(res.body.items[1]).toStrictEqual(expect.objectContaining({ fields: null })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ totalItems: 2 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ itemCount: 2 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ itemsPerPage: 10 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ totalPages: 1 })))
        .expect((res) => expect(res.body.meta).toStrictEqual(expect.objectContaining({ currentPage: 1 })))
        .expect((res) =>
          expect(res.body.links).toStrictEqual(expect.objectContaining({ first: `${decapitalizedAddress}?limit=10` }))
        )
        .expect((res) => expect(res.body.links).toStrictEqual(expect.objectContaining({ previous: "" })))
        .expect((res) => expect(res.body.links).toStrictEqual(expect.objectContaining({ next: "" })))
        .expect((res) =>
          expect(res.body.links).toStrictEqual(
            expect.objectContaining({ last: `${decapitalizedAddress}?page=1&limit=10` })
          )
        );
    });
  });
});