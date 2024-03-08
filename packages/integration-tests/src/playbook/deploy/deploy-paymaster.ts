import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as ethers from "ethers";
import { Wallet } from "zksync-web3";

import { Buffer, Path, Wallets } from "../../constants";
import { Helper } from "../../helper";

import type { HardhatRuntimeEnvironment } from "hardhat/types";

const helper = new Helper();
export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(Wallets.richWalletPrivateKey);
  // The wallet that will receive ERC20 tokens
  const emptyWallet = Wallet.createRandom();
  console.log(`Empty wallet's address: ${emptyWallet.address}`);
  await helper.writeFile(Path.absolutePathToBufferFiles, Buffer.emptyWalletAddress, emptyWallet.address);
  console.log(`Empty wallet's private key: ${emptyWallet.privateKey}`);
  await helper.writeFile(Path.absolutePathToBufferFiles, Buffer.emptyWalletPrivateKey, emptyWallet.privateKey);

  const deployer = new Deployer(hre, wallet);

  // Deploying the ERC20 token
  const erc20Artifact = await deployer.loadArtifact("MyERC20");
  const erc20 = await deployer.deploy(erc20Artifact, ["MyToken", "MyToken", 18]);
  console.log(`ERC20 address: ${erc20.address}`);
  await helper.writeFile(Path.absolutePathToBufferFiles, Buffer.customToken, erc20.address);

  const paymasterArtifact = await deployer.loadArtifact("MyPaymaster");
  const paymaster = await deployer.deploy(paymasterArtifact, [erc20.address]);
  console.log(`Paymaster address: ${paymaster.address}`);
  await helper.writeFile(Path.absolutePathToBufferFiles, Buffer.paymaster, paymaster.address);

  const deployTransaction = await paymaster.deployTransaction;
  console.log(`Paymaster deploy transaction: ${deployTransaction.hash}`);
  await helper.writeFile(Path.absolutePathToBufferFiles, Buffer.paymasterDeployTx, deployTransaction.hash);

  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.03"),
    })
  ).wait();

  await // We will give the empty wallet 3 units of the token:
  (await erc20.mint(emptyWallet.address, 3)).wait();

  console.log("Minted 3 tokens for the empty wallet");
  console.log(`Done!`);

  return deployTransaction.hash;
}
