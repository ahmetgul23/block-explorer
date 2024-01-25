import { execSync } from "child_process";
import { ethers } from "ethers";
import { promises as fs } from "fs";
import * as path from "path";
import { Provider } from "zksync-web3";

import { localConfig } from "./config";
import { Logger } from "./entities";

import type { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";

export class Helper {
  async txHashLogger(txType: string, txValue: string, tokenName?: string) {
    const logMessage = `TxHash for ${txType} ${Logger.textSeparator} ${txValue}`;

    if (tokenName === undefined) {
      return console.log(logMessage);
    } else {
      return console.log(logMessage, ` ${tokenName}`);
    }
  }

  async executeScript(script: string) {
    const output = execSync(script, { encoding: "utf-8" });

    try {
      console.log(`> Run NPM Script "${script}":\n`, output);
      return output;
    } catch (e) {
      console.log(e);
    }
  }

  async getStringFromFile(fileName: string) {
    const absoluteRoute = path.join(__dirname, "..", fileName);

    try {
      return await fs.readFile(absoluteRoute, { encoding: "utf-8" });
    } catch {
      console.log(`There is no the expected file: ${fileName}`);
    }
  }

  async getBalanceETH(walletAddress: string, layer: string) {
    let network: string;
    let provider: BaseProvider;
    if (layer == "L1") {
      network = localConfig.L1Network;
      provider = ethers.getDefaultProvider(network);
    } else if (layer == "L2") {
      network = localConfig.L2Network;
      provider = new Provider(network);
    } else {
      console.log(`Wrong layer: ${layer}`);
    }
    return ethers.utils.formatUnits(await provider.getBalance(walletAddress), "wei");
  }
}