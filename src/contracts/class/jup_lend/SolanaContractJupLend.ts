import { idlJupLend, IdlJupLend } from 'src/contracts/idl/JupLend';
import { SolanaContractAbstract } from '../SolanaContractAbstract';
import { ctrAdsSolana } from 'src/contracts/ctrAdsSolana';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddressSync, getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN as BNAnchor } from '@coral-xyz/anchor';
import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { SolanaEcosystemTokenInfo } from 'src/token-info/solana-ecosystem/SolanaEcosystemTokenInfo';
import { BN } from 'src/utils';

const JUPITER_LEND_ACCOUNTS = {
    fTokenMint: (assetAddress: PublicKey) => PublicKey.findProgramAddressSync([Buffer.from('f_token_mint'), assetAddress.toBuffer()], ctrAdsSolana.jupiterLendingProgram)[0],

    lendingAdmin: PublicKey.findProgramAddressSync([Buffer.from('lending_admin')], ctrAdsSolana.jupiterLendingProgram)[0],

    lending: function (assetAddress: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from('lending'), assetAddress.toBuffer(), this.fTokenMint(assetAddress).toBuffer()], ctrAdsSolana.jupiterLendingProgram)[0];
    },

    claimAccount: (assetAddress: PublicKey, user: PublicKey) =>
        PublicKey.findProgramAddressSync([Buffer.from('user_claim'), user.toBuffer(), assetAddress.toBuffer()], ctrAdsSolana.jupiterLendingProgram)[0],

    supplyTokenReservesLiquidity: (assetAddress: PublicKey) => PublicKey.findProgramAddressSync([Buffer.from('reserve'), assetAddress.toBuffer()], ctrAdsSolana.jupiterLiquidityProgram)[0],

    lendingSupplyPositionOnLiquidity: function (assetAddress: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from('user_supply_position'), assetAddress.toBuffer(), this.lending(assetAddress).toBuffer()], ctrAdsSolana.jupiterLiquidityProgram)[0];
    },

    rateModel: (assetAddress: PublicKey) => PublicKey.findProgramAddressSync([Buffer.from('rate_model'), assetAddress.toBuffer()], ctrAdsSolana.jupiterLiquidityProgram)[0],

    liquidity: PublicKey.findProgramAddressSync([Buffer.from('liquidity')], ctrAdsSolana.jupiterLiquidityProgram)[0],

    vault: function (assetAddress: PublicKey) {
        return getAssociatedTokenAddressSync(assetAddress, this.liquidity, true);
    },

    rewardsRateModel: (assetAddress: PublicKey) => PublicKey.findProgramAddressSync([Buffer.from('lending_rewards_rate_model'), assetAddress.toBuffer()], ctrAdsSolana.jupiterEarnRewardsProgram)[0],
};

export class SolanaContractJupLend extends SolanaContractAbstract<IdlJupLend> {
    constructor() {
        super(ctrAdsSolana.jupiterLendingProgram, idlJupLend);
    }

    getExchangeRate = async ({ token }: { token: SolanaEcosystemTokenInfo }) => {
        const tokenMint = new PublicKey(token.address);
        return (await this.program.account.lending.fetch(JUPITER_LEND_ACCOUNTS.lending(tokenMint))).tokenExchangePrice;
    };

    getFTokenTotalSupply = async ({ token }: { token: SolanaEcosystemTokenInfo }) => {
        const tokenMint = new PublicKey(token.address);
        return (await getMint(this.provider.connection, JUPITER_LEND_ACCOUNTS.fTokenMint(tokenMint))).supply;
    };

    getUserFTokenBalance = async (data: { smartWallet: PublicKey; token: SolanaEcosystemTokenInfo }) => {
        const { smartWallet, token } = data;
        const tokenMint = new PublicKey(token.address);
        return (await getAccount(this.provider.connection, getAssociatedTokenAddressSync(JUPITER_LEND_ACCOUNTS.fTokenMint(tokenMint), smartWallet, true))).amount;
    };

    depositToJupLend = async (data: { smartWallet: PublicKey; token: SolanaEcosystemTokenInfo; amount: number }) => {
        const { smartWallet, token, amount } = data;
        const tokenMint = new PublicKey(token.address);
        const jupLendDepositIx = await this.program.methods
            .deposit(
                new BNAnchor(
                    BN(amount)
                        .times(BN(10).pow(BN(token.decimals)))
                        .toFixed(0)
                )
            )
            .accountsStrict({
                signer: smartWallet,
                depositorTokenAccount: getAssociatedTokenAddressSync(tokenMint, smartWallet, true),
                recipientTokenAccount: getAssociatedTokenAddressSync(JUPITER_LEND_ACCOUNTS.fTokenMint(tokenMint), smartWallet, true),
                mint: tokenMint,
                lendingAdmin: JUPITER_LEND_ACCOUNTS.lendingAdmin,
                lending: JUPITER_LEND_ACCOUNTS.lending(tokenMint),
                fTokenMint: JUPITER_LEND_ACCOUNTS.fTokenMint(tokenMint),
                supplyTokenReservesLiquidity: JUPITER_LEND_ACCOUNTS.supplyTokenReservesLiquidity(tokenMint),
                lendingSupplyPositionOnLiquidity: JUPITER_LEND_ACCOUNTS.lendingSupplyPositionOnLiquidity(tokenMint),
                rateModel: JUPITER_LEND_ACCOUNTS.rateModel(tokenMint),
                vault: JUPITER_LEND_ACCOUNTS.vault(tokenMint),
                liquidity: JUPITER_LEND_ACCOUNTS.liquidity,
                liquidityProgram: ctrAdsSolana.jupiterLiquidityProgram,
                rewardsRateModel: JUPITER_LEND_ACCOUNTS.rewardsRateModel(tokenMint),
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction();
        return jupLendDepositIx;
    };
}
