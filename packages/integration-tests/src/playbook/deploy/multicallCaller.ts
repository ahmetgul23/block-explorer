import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { promises as fs } from "fs";

import { Buffer, Path } from "../../constants";
import { Helper } from "../../helper";
import getWallet from "../utils/getWallet";

import type { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the contract`);
  const helper = new Helper();
  const wallet = await getWallet(hre);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("GCaller");

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const addressContractMiddle = await helper.readFile(Path.absolutePathToBufferFiles, Buffer.addressMultiCallMiddle);
  const contractConstructorArguments = [addressContractMiddle];
  console.log(`Arguments for the contract constructor: ${JSON.stringify(contractConstructorArguments)}`);
  const deployedContract = await deployer.deploy(artifact, contractConstructorArguments);

  // Show the contract info.
  console.log(`Contract "${artifact.contractName}" was deployed to ${deployedContract.address}`);

  // Call the deployed contract.
  const greetingFromContract = await deployedContract.newCallGreeter();

  console.log(`Contract said something like this: ${greetingFromContract}`);

  const address = deployedContract.address;
  const txHash = deployedContract.deployTransaction.hash;

  await fs.writeFile(Buffer.addressMultiCallCaller, address);
  await fs.writeFile(Buffer.txMultiCallCaller, txHash);

  return [address, txHash];
}
