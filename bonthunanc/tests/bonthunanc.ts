// Import necessary libraries and modules
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Bonthunanc } from "../target/types/bonthunanc";
import { assert, expect } from "chai";

describe("bonthunanc", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Reference to the program on the blockchain
    const program = anchor.workspace.Bonthunanc as Program<Bonthunanc>;

    // Generate keypairs for the different actors in our tests
    const client = anchor.web3.Keypair.generate();
    const hunter = anchor.web3.Keypair.generate();
    const unauthorizedUser = anchor.web3.Keypair.generate();

    // Define PDAs for user profiles
    const [clientProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user"), client.publicKey.toBuffer()],
        program.programId
    );

    const [hunterProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user"), hunter.publicKey.toBuffer()],
        program.programId
    );

    // Variables to hold bounty details
    const bountyTitle = "Build a dApp";
    let bountyPda: anchor.web3.PublicKey;
    let bountyEscrowPda: anchor.web3.PublicKey;
    let bountyBump: number;
    let escrowBump: number;

    // Before running tests, airdrop some SOL to our test accounts and wait for confirmation
    before(async () => {
        console.log("🚀 Airdropping SOL to test accounts...");

        // Function to request and confirm airdrop
        const requestAndConfirmAirdrop = async (publicKey: anchor.web3.PublicKey, amount: number) => {
            const airdropTx = await provider.connection.requestAirdrop(publicKey, amount);
            const latestBlockhash = await provider.connection.getLatestBlockhash();
            await provider.connection.confirmTransaction({
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                signature: airdropTx,
            });
        };
        
        // Airdrop to all accounts in parallel and wait for all to complete
        await Promise.all([
            requestAndConfirmAirdrop(client.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL),
            requestAndConfirmAirdrop(hunter.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL),
            requestAndConfirmAirdrop(unauthorizedUser.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
        ]);
        
        console.log("✅ Airdrop complete.");

        // Derive bounty and escrow PDAs
        [bountyPda, bountyBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("bounty"), client.publicKey.toBuffer(), Buffer.from(bountyTitle)],
            program.programId
        );
        [bountyEscrowPda, escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("bounty-escrow"), bountyPda.toBuffer()],
            program.programId
        );
    });

    // Test Suite for User Profile Initialization
    describe("User Profile Management", () => {
        it("Initializes a client profile successfully", async () => {
            const username = "TestClient";
            const email = "client@test.com";

            console.log("\n🧪 Test: Initializing a client profile...");
            await program.methods
                .initUserProfile(username, email, false, true)
                .accountsStrict({
                    userProfile: clientProfilePda,
                    authority: client.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([client])
                .rpc();

            const profile = await program.account.userProfile.fetch(clientProfilePda);
            assert.equal(profile.username, username);
            assert.equal(profile.email, email);
            assert.isTrue(profile.isClient);
            assert.isFalse(profile.isHunter);
            assert.equal(profile.bountiesPosted.toNumber(), 0);
            console.log("✅ Client profile initialized.");
        });

        it("Initializes a hunter profile successfully", async () => {
            const username = "TestHunter";
            const email = "hunter@test.com";

            console.log("🧪 Test: Initializing a hunter profile...");
            await program.methods
                .initUserProfile(username, email, true, false)
                .accountsStrict({
                    userProfile: hunterProfilePda,
                    authority: hunter.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([hunter])
                .rpc();

            const profile = await program.account.userProfile.fetch(hunterProfilePda);
            assert.equal(profile.username, username);
            assert.isTrue(profile.isHunter);
            assert.isFalse(profile.isClient);
            assert.equal(profile.bountiesApplied.toNumber(), 0);
            console.log("✅ Hunter profile initialized.");
        });

        it("Edits a user profile successfully", async () => {
            const newName = "HunterTheGreat";
            const newEmail = "hunter.the.great@test.com";

            console.log("🧪 Test: Editing a user profile...");
            await program.methods
                .editProfile(newName, newEmail)
                .accountsStrict({
                    profile: hunterProfilePda,
                    authority: hunter.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([hunter])
                .rpc();

            const profile = await program.account.userProfile.fetch(hunterProfilePda);
            assert.equal(profile.username, newName);
            assert.equal(profile.email, newEmail);
            console.log("✅ Profile edited successfully.");
        });

        it("Fails to edit a profile with an unauthorized user", async () => {
            const newName = "Hacker";
            const newEmail = "hacker@test.com";

            console.log("🧪 Test: Failing to edit with unauthorized user...");
            try {
                await program.methods
                    .editProfile(newName, newEmail)
                    .accountsStrict({
                        profile: hunterProfilePda,
                        authority: unauthorizedUser.publicKey, // Wrong authority
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([unauthorizedUser])
                    .rpc();
                assert.fail("Should have failed with an unauthorized error.");
            } catch (err) {
                assert.include(err.message, "A has_one constraint was violated");
                console.log("✅ Correctly failed as unauthorized.");
            }
        });
    });

    // Test Suite for Bounty Lifecycle
    describe("Bounty Lifecycle Management", () => {
        const reward = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
        const timeLimit = new anchor.BN(Math.floor(Date.now() / 1000) + 60 * 60 * 24); // 24 hours from now

        it("Creates a new bounty successfully", async () => {
            console.log("\n🧪 Test: Creating a new bounty...");
            const clientBalanceBefore = await provider.connection.getBalance(client.publicKey);
            
            await program.methods
                .createBounty(
                    bountyTitle,
                    "A detailed description of the bounty.",
                    reward,
                    { tech: {} }, // BountyCategory
                    { medium: {} }, // BountyDifficulty
                    "Remote",
                    timeLimit
                )
                .accountsStrict({
                    bounty: bountyPda,
                    bountyEscrow: bountyEscrowPda,
                    profile: clientProfilePda,
                    creator: client.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([client])
                .rpc();

            const bountyAccount = await program.account.bounty.fetch(bountyPda);
            assert.equal(bountyAccount.title, bountyTitle);
            assert.ok(bountyAccount.reward.eq(reward));
            assert.deepEqual(bountyAccount.status, { open: {} });

            const escrowBalance = await provider.connection.getBalance(bountyEscrowPda);
            console.log(escrowBalance);

            const clientProfile = await program.account.userProfile.fetch(clientProfilePda);
            assert.equal(clientProfile.bountiesPosted.toNumber(), 1);

            const clientBalanceAfter = await provider.connection.getBalance(client.publicKey);
            expect(clientBalanceAfter).to.be.lessThan(clientBalanceBefore - reward.toNumber());

            console.log("✅ Bounty created and escrow funded.");
        });

        it("Allows a hunter to claim an open bounty", async () => {
            console.log("🧪 Test: Claiming an open bounty...");
            await program.methods
                .claimBounty()
                .accountsStrict({
                    bounty: bountyPda,
                    hunterProfile: hunterProfilePda,
                    hunter: hunter.publicKey,
                })
                .signers([hunter])
                .rpc();

            const bountyAccount = await program.account.bounty.fetch(bountyPda);
            assert.deepEqual(bountyAccount.status, { claimed: {} });
            assert.ok(bountyAccount.hunter.equals(hunter.publicKey));

            const hunterProfile = await program.account.userProfile.fetch(hunterProfilePda);
            assert.equal(hunterProfile.bountiesApplied.toNumber(), 1);
            console.log("✅ Bounty claimed successfully.");
        });

        it("Fails to claim a bounty that is not open", async () => {
            console.log("🧪 Test: Failing to claim an already claimed bounty...");
            try {
                await program.methods
                    .claimBounty()
                    .accountsStrict({
                        bounty: bountyPda,
                        hunterProfile: hunterProfilePda,
                        hunter: hunter.publicKey,
                    })
                    .signers([hunter])
                    .rpc();
                assert.fail("Should have failed because the bounty is not open.");
            } catch (err) {
                assert.equal(err.error.errorCode.code, "BountyNotOpen");
                console.log("✅ Correctly failed as bounty is not open.");
            }
        });

        it("Allows the hunter to submit work", async () => {
            const submissionLink = "https://github.com/my-submission";
            const [submissionPda] = anchor.web3.PublicKey.findProgramAddressSync(
                [Buffer.from("submission"), bountyPda.toBuffer(), hunter.publicKey.toBuffer()],
                program.programId
            );

            console.log("🧪 Test: Submitting work for a claimed bounty...");
            await program.methods
                .submitWork(submissionLink)
                .accountsStrict({
                    submission: submissionPda,
                    bounty: bountyPda,
                    hunter: hunter.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([hunter])
                .rpc();

            const submissionAccount = await program.account.submission.fetch(submissionPda);
            assert.equal(submissionAccount.submissionLink, submissionLink);
            assert.ok(submissionAccount.bounty.equals(bountyPda));
            console.log("✅ Work submitted successfully.");
        });
        
        it("Selects a winner and transfers the reward", async () => {
            console.log("🧪 Test: Selecting a winner and distributing reward...");
            const hunterBalanceBefore = await provider.connection.getBalance(hunter.publicKey);
            
            await program.methods
                .selectWinner()
                .accountsStrict({
                    bounty: bountyPda,
                    bountyEscrow: bountyEscrowPda,
                    clientProfile: clientProfilePda,
                    hunterProfile: hunterProfilePda,
                    winner: hunter.publicKey,
                    creator: client.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([client])
                .rpc();

            const bountyAccount = await program.account.bounty.fetch(bountyPda);
            assert.deepEqual(bountyAccount.status, { completed: {} });

            const hunterBalanceAfter = await provider.connection.getBalance(hunter.publicKey);
            assert.equal(hunterBalanceAfter, hunterBalanceBefore + reward.toNumber());

            const clientProfile = await program.account.userProfile.fetch(clientProfilePda);
            assert.ok(clientProfile.totalSolSpent.eq(reward));
            // Note: This checks the correct field. Your Rust program should update 'bounties_completed_as_client'.
            assert.equal(clientProfile.bountiesCompletedAsClient.toNumber(), 1);

            const hunterProfile = await program.account.userProfile.fetch(hunterProfilePda);
            assert.ok(hunterProfile.totalSolEarned.eq(reward));
            assert.equal(hunterProfile.bountiesCompleted.toNumber(), 1);
            // Since 1 bounty was applied and 1 was completed, success rate should be 100.0
            assert.equal(hunterProfile.successRate, 100.0);
            
            // Check if escrow account is closed and its lamports are transferred
            const escrowInfo = await provider.connection.getAccountInfo(bountyEscrowPda);
            assert.isNull(escrowInfo, "Escrow account should be closed.");

            console.log("✅ Winner selected, reward paid, and accounts updated.");
        });
    });
});
