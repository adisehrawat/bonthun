import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Bonthunanc } from './idl'
import SolmineaIDL from "./idl.json"

export const BONTHUN_PROGRAM_ID = new PublicKey("9AzEGgnDWQP8zx9CCwe15iAxudmK7U6p1UdVHHqcyvRL");

export function getBonthunProgram(provider: AnchorProvider, address?: PublicKey): Program<Bonthunanc> {
  return new Program({ ...SolmineaIDL, address: address ? address.toBase58() : SolmineaIDL.address } as Bonthunanc, provider)
}

export function getBonthunProgramId(cluster: Cluster) {
    switch (cluster) {
        case "devnet":
        case "testnet":
        case "mainnet-beta":
        default:
            return BONTHUN_PROGRAM_ID;
    }
}