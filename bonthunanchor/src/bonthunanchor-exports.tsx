import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Bonthunanchor } from './idl'
import SolmineaIDL from "./idl.json"

export const BONTHUN_PROGRAM_ID = new PublicKey("ASDBLcyRSj8bWcQNFiPBJMtDLkWmWytsbYrC7B6RJ81M");

export function getBonthunProgram(provider: AnchorProvider, address?: PublicKey): Program<Bonthunanchor> {
  return new Program({ ...SolmineaIDL, address: address ? address.toBase58() : SolmineaIDL.address } as Bonthunanchor, provider)
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