/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lending.json`.
 */
export type IdlJupLend = {
    address: '7tjE28izRUjzmxC1QNXnNwcc4N82CNYCexf3k8mw67s3';
    metadata: {
        name: 'jup_lend';
        version: '0.1.0';
        spec: '0.1.0';
        description: 'Created with Anchor';
    };
    docs: ['Anchor CPI crate generated from lending v0.1.0 using [anchor-gen](https://crates.io/crates/anchor-gen) v0.4.1.'];
    instructions: [
        {
            name: 'deposit';
            discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'depositorTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'assets';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'depositWithMinAmountOut';
            discriminator: [116, 144, 16, 97, 118, 109, 40, 119];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'depositorTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'assets';
                    type: 'u64';
                },
                {
                    name: 'minAmountOut';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'initLending';
            discriminator: [156, 224, 67, 46, 89, 189, 157, 209];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'lendingAdmin';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'metadataAccount';
                    writable: true;
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'tokenReservesLiquidity';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'systemProgram';
                },
                {
                    name: 'sysvarInstruction';
                },
                {
                    name: 'metadataProgram';
                },
                {
                    name: 'rent';
                }
            ];
            args: [
                {
                    name: 'symbol';
                    type: 'string';
                },
                {
                    name: 'liquidityProgram';
                    type: 'pubkey';
                }
            ];
        },
        {
            name: 'initLendingAdmin';
            discriminator: [203, 185, 241, 165, 56, 254, 33, 9];
            accounts: [
                {
                    name: 'authority';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'lendingAdmin';
                    writable: true;
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'liquidityProgram';
                    type: 'pubkey';
                },
                {
                    name: 'rebalancer';
                    type: 'pubkey';
                },
                {
                    name: 'authority';
                    type: 'pubkey';
                }
            ];
        },
        {
            name: 'mint';
            discriminator: [51, 57, 225, 47, 182, 146, 137, 166];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'depositorTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'shares';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'mintWithMaxAssets';
            discriminator: [6, 94, 69, 122, 30, 179, 146, 171];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'depositorTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'shares';
                    type: 'u64';
                },
                {
                    name: 'maxAssets';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'rebalance';
            discriminator: [108, 158, 77, 9, 210, 52, 88, 62];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'depositorTokenAccount';
                    writable: true;
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                    writable: true;
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [];
        },
        {
            name: 'redeem';
            discriminator: [184, 12, 86, 149, 70, 196, 97, 225];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'ownerTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'claimAccount';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'shares';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'redeemWithMinAmountOut';
            discriminator: [235, 189, 237, 56, 166, 180, 184, 149];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'ownerTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'claimAccount';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'shares';
                    type: 'u64';
                },
                {
                    name: 'minAmountOut';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'setRewardsRateModel';
            discriminator: [174, 231, 116, 203, 8, 58, 143, 203];
            accounts: [
                {
                    name: 'signer';
                    signer: true;
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'fTokenMint';
                },
                {
                    name: 'newRewardsRateModel';
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                }
            ];
            args: [
                {
                    name: 'mint';
                    type: 'pubkey';
                }
            ];
        },
        {
            name: 'updateAuthority';
            discriminator: [32, 46, 64, 28, 149, 75, 243, 88];
            accounts: [
                {
                    name: 'signer';
                    signer: true;
                },
                {
                    name: 'lendingAdmin';
                    writable: true;
                }
            ];
            args: [
                {
                    name: 'newAuthority';
                    type: 'pubkey';
                }
            ];
        },
        {
            name: 'updateAuths';
            discriminator: [93, 96, 178, 156, 57, 117, 253, 209];
            accounts: [
                {
                    name: 'signer';
                    signer: true;
                },
                {
                    name: 'lendingAdmin';
                    writable: true;
                }
            ];
            args: [
                {
                    name: 'authStatus';
                    type: {
                        vec: {
                            defined: {
                                name: 'addressBool';
                            };
                        };
                    };
                }
            ];
        },
        {
            name: 'updateRate';
            discriminator: [24, 225, 53, 189, 72, 212, 225, 178];
            accounts: [
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                },
                {
                    name: 'rewardsRateModel';
                }
            ];
            args: [];
        },
        {
            name: 'updateRebalancer';
            discriminator: [206, 187, 54, 228, 145, 8, 203, 111];
            accounts: [
                {
                    name: 'signer';
                    signer: true;
                },
                {
                    name: 'lendingAdmin';
                    writable: true;
                }
            ];
            args: [
                {
                    name: 'newRebalancer';
                    type: 'pubkey';
                }
            ];
        },
        {
            name: 'withdraw';
            discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'ownerTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'claimAccount';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'amount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'withdrawWithMaxSharesBurn';
            discriminator: [47, 197, 183, 171, 239, 18, 245, 171];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'ownerTokenAccount';
                    writable: true;
                },
                {
                    name: 'recipientTokenAccount';
                    writable: true;
                },
                {
                    name: 'lendingAdmin';
                },
                {
                    name: 'lending';
                    writable: true;
                },
                {
                    name: 'mint';
                },
                {
                    name: 'fTokenMint';
                    writable: true;
                },
                {
                    name: 'supplyTokenReservesLiquidity';
                    writable: true;
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity';
                    writable: true;
                },
                {
                    name: 'rateModel';
                },
                {
                    name: 'vault';
                    writable: true;
                },
                {
                    name: 'claimAccount';
                    writable: true;
                },
                {
                    name: 'liquidity';
                    writable: true;
                },
                {
                    name: 'liquidityProgram';
                    writable: true;
                },
                {
                    name: 'rewardsRateModel';
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                },
                {
                    name: 'systemProgram';
                }
            ];
            args: [
                {
                    name: 'amount';
                    type: 'u64';
                },
                {
                    name: 'maxSharesBurn';
                    type: 'u64';
                }
            ];
        }
    ];
    events: [
        {
            name: 'logDeposit';
            discriminator: [176, 243, 1, 56, 142, 206, 1, 106];
        },
        {
            name: 'logRebalance';
            discriminator: [90, 67, 219, 41, 181, 118, 132, 9];
        },
        {
            name: 'logUpdateAuthority';
            discriminator: [150, 152, 157, 143, 6, 135, 193, 101];
        },
        {
            name: 'logUpdateAuths';
            discriminator: [88, 80, 109, 48, 111, 203, 76, 251];
        },
        {
            name: 'logUpdateRates';
            discriminator: [222, 11, 113, 60, 147, 15, 68, 217];
        },
        {
            name: 'logUpdateRebalancer';
            discriminator: [66, 79, 144, 204, 26, 217, 153, 225];
        },
        {
            name: 'logUpdateRewards';
            discriminator: [37, 13, 111, 186, 47, 245, 162, 121];
        },
        {
            name: 'logWithdraw';
            discriminator: [49, 9, 176, 179, 222, 190, 6, 117];
        }
    ];
    types: [
        {
            name: 'addressBool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'addr';
                        type: 'pubkey';
                    },
                    {
                        name: 'value';
                        type: 'bool';
                    }
                ];
            };
        },
        {
            name: 'logDeposit';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'sender';
                        type: 'pubkey';
                    },
                    {
                        name: 'receiver';
                        type: 'pubkey';
                    },
                    {
                        name: 'assets';
                        type: 'u64';
                    },
                    {
                        name: 'sharesMinted';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'logRebalance';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'assets';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'logUpdateAuthority';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'newAuthority';
                        type: 'pubkey';
                    }
                ];
            };
        },
        {
            name: 'logUpdateAuths';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'authStatus';
                        type: {
                            vec: {
                                defined: {
                                    name: 'addressBool';
                                };
                            };
                        };
                    }
                ];
            };
        },
        {
            name: 'logUpdateRates';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'tokenExchangePrice';
                        type: 'u64';
                    },
                    {
                        name: 'liquidityExchangePrice';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'logUpdateRebalancer';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'newRebalancer';
                        type: 'pubkey';
                    }
                ];
            };
        },
        {
            name: 'logUpdateRewards';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'rewardsRateModel';
                        type: 'pubkey';
                    }
                ];
            };
        },
        {
            name: 'logWithdraw';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'sender';
                        type: 'pubkey';
                    },
                    {
                        name: 'receiver';
                        type: 'pubkey';
                    },
                    {
                        name: 'owner';
                        type: 'pubkey';
                    },
                    {
                        name: 'assets';
                        type: 'u64';
                    },
                    {
                        name: 'sharesBurned';
                        type: 'u64';
                    }
                ];
            };
        }
    ];
};

export const idlJupLend: IdlJupLend = {
    address: '7tjE28izRUjzmxC1QNXnNwcc4N82CNYCexf3k8mw67s3',
    metadata: {
        name: 'jup_lend',
        version: '0.1.0',
        spec: '0.1.0',
        description: 'Created with Anchor',
    },
    docs: ['Anchor CPI crate generated from lending v0.1.0 using [anchor-gen](https://crates.io/crates/anchor-gen) v0.4.1.'],
    instructions: [
        {
            name: 'deposit',
            discriminator: [242, 35, 198, 137, 82, 225, 242, 182],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'depositorTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'assets',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'depositWithMinAmountOut',
            discriminator: [116, 144, 16, 97, 118, 109, 40, 119],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'depositorTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'assets',
                    type: 'u64',
                },
                {
                    name: 'minAmountOut',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'initLending',
            discriminator: [156, 224, 67, 46, 89, 189, 157, 209],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'lendingAdmin',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'metadataAccount',
                    writable: true,
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'tokenReservesLiquidity',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'systemProgram',
                },
                {
                    name: 'sysvarInstruction',
                },
                {
                    name: 'metadataProgram',
                },
                {
                    name: 'rent',
                },
            ],
            args: [
                {
                    name: 'symbol',
                    type: 'string',
                },
                {
                    name: 'liquidityProgram',
                    type: 'pubkey',
                },
            ],
        },
        {
            name: 'initLendingAdmin',
            discriminator: [203, 185, 241, 165, 56, 254, 33, 9],
            accounts: [
                {
                    name: 'authority',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'lendingAdmin',
                    writable: true,
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'liquidityProgram',
                    type: 'pubkey',
                },
                {
                    name: 'rebalancer',
                    type: 'pubkey',
                },
                {
                    name: 'authority',
                    type: 'pubkey',
                },
            ],
        },
        {
            name: 'mint',
            discriminator: [51, 57, 225, 47, 182, 146, 137, 166],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'depositorTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'shares',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'mintWithMaxAssets',
            discriminator: [6, 94, 69, 122, 30, 179, 146, 171],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'depositorTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'shares',
                    type: 'u64',
                },
                {
                    name: 'maxAssets',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'rebalance',
            discriminator: [108, 158, 77, 9, 210, 52, 88, 62],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'depositorTokenAccount',
                    writable: true,
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                    writable: true,
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [],
        },
        {
            name: 'redeem',
            discriminator: [184, 12, 86, 149, 70, 196, 97, 225],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'ownerTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'claimAccount',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'shares',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'redeemWithMinAmountOut',
            discriminator: [235, 189, 237, 56, 166, 180, 184, 149],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'ownerTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'claimAccount',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'shares',
                    type: 'u64',
                },
                {
                    name: 'minAmountOut',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'setRewardsRateModel',
            discriminator: [174, 231, 116, 203, 8, 58, 143, 203],
            accounts: [
                {
                    name: 'signer',
                    signer: true,
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'fTokenMint',
                },
                {
                    name: 'newRewardsRateModel',
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                },
            ],
            args: [
                {
                    name: 'mint',
                    type: 'pubkey',
                },
            ],
        },
        {
            name: 'updateAuthority',
            discriminator: [32, 46, 64, 28, 149, 75, 243, 88],
            accounts: [
                {
                    name: 'signer',
                    signer: true,
                },
                {
                    name: 'lendingAdmin',
                    writable: true,
                },
            ],
            args: [
                {
                    name: 'newAuthority',
                    type: 'pubkey',
                },
            ],
        },
        {
            name: 'updateAuths',
            discriminator: [93, 96, 178, 156, 57, 117, 253, 209],
            accounts: [
                {
                    name: 'signer',
                    signer: true,
                },
                {
                    name: 'lendingAdmin',
                    writable: true,
                },
            ],
            args: [
                {
                    name: 'authStatus',
                    type: {
                        vec: {
                            defined: {
                                name: 'addressBool',
                            },
                        },
                    },
                },
            ],
        },
        {
            name: 'updateRate',
            discriminator: [24, 225, 53, 189, 72, 212, 225, 178],
            accounts: [
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                },
                {
                    name: 'rewardsRateModel',
                },
            ],
            args: [],
        },
        {
            name: 'updateRebalancer',
            discriminator: [206, 187, 54, 228, 145, 8, 203, 111],
            accounts: [
                {
                    name: 'signer',
                    signer: true,
                },
                {
                    name: 'lendingAdmin',
                    writable: true,
                },
            ],
            args: [
                {
                    name: 'newRebalancer',
                    type: 'pubkey',
                },
            ],
        },
        {
            name: 'withdraw',
            discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'ownerTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'claimAccount',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'amount',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'withdrawWithMaxSharesBurn',
            discriminator: [47, 197, 183, 171, 239, 18, 245, 171],
            accounts: [
                {
                    name: 'signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'ownerTokenAccount',
                    writable: true,
                },
                {
                    name: 'recipientTokenAccount',
                    writable: true,
                },
                {
                    name: 'lendingAdmin',
                },
                {
                    name: 'lending',
                    writable: true,
                },
                {
                    name: 'mint',
                },
                {
                    name: 'fTokenMint',
                    writable: true,
                },
                {
                    name: 'supplyTokenReservesLiquidity',
                    writable: true,
                },
                {
                    name: 'lendingSupplyPositionOnLiquidity',
                    writable: true,
                },
                {
                    name: 'rateModel',
                },
                {
                    name: 'vault',
                    writable: true,
                },
                {
                    name: 'claimAccount',
                    writable: true,
                },
                {
                    name: 'liquidity',
                    writable: true,
                },
                {
                    name: 'liquidityProgram',
                    writable: true,
                },
                {
                    name: 'rewardsRateModel',
                },
                {
                    name: 'tokenProgram',
                },
                {
                    name: 'associatedTokenProgram',
                },
                {
                    name: 'systemProgram',
                },
            ],
            args: [
                {
                    name: 'amount',
                    type: 'u64',
                },
                {
                    name: 'maxSharesBurn',
                    type: 'u64',
                },
            ],
        },
    ],
    events: [
        {
            name: 'logDeposit',
            discriminator: [176, 243, 1, 56, 142, 206, 1, 106],
        },
        {
            name: 'logRebalance',
            discriminator: [90, 67, 219, 41, 181, 118, 132, 9],
        },
        {
            name: 'logUpdateAuthority',
            discriminator: [150, 152, 157, 143, 6, 135, 193, 101],
        },
        {
            name: 'logUpdateAuths',
            discriminator: [88, 80, 109, 48, 111, 203, 76, 251],
        },
        {
            name: 'logUpdateRates',
            discriminator: [222, 11, 113, 60, 147, 15, 68, 217],
        },
        {
            name: 'logUpdateRebalancer',
            discriminator: [66, 79, 144, 204, 26, 217, 153, 225],
        },
        {
            name: 'logUpdateRewards',
            discriminator: [37, 13, 111, 186, 47, 245, 162, 121],
        },
        {
            name: 'logWithdraw',
            discriminator: [49, 9, 176, 179, 222, 190, 6, 117],
        },
    ],
    types: [
        {
            name: 'addressBool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'addr',
                        type: 'pubkey',
                    },
                    {
                        name: 'value',
                        type: 'bool',
                    },
                ],
            },
        },
        {
            name: 'logDeposit',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'sender',
                        type: 'pubkey',
                    },
                    {
                        name: 'receiver',
                        type: 'pubkey',
                    },
                    {
                        name: 'assets',
                        type: 'u64',
                    },
                    {
                        name: 'sharesMinted',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'logRebalance',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'assets',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'logUpdateAuthority',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'newAuthority',
                        type: 'pubkey',
                    },
                ],
            },
        },
        {
            name: 'logUpdateAuths',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'authStatus',
                        type: {
                            vec: {
                                defined: {
                                    name: 'addressBool',
                                },
                            },
                        },
                    },
                ],
            },
        },
        {
            name: 'logUpdateRates',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'tokenExchangePrice',
                        type: 'u64',
                    },
                    {
                        name: 'liquidityExchangePrice',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'logUpdateRebalancer',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'newRebalancer',
                        type: 'pubkey',
                    },
                ],
            },
        },
        {
            name: 'logUpdateRewards',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'rewardsRateModel',
                        type: 'pubkey',
                    },
                ],
            },
        },
        {
            name: 'logWithdraw',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'sender',
                        type: 'pubkey',
                    },
                    {
                        name: 'receiver',
                        type: 'pubkey',
                    },
                    {
                        name: 'owner',
                        type: 'pubkey',
                    },
                    {
                        name: 'assets',
                        type: 'u64',
                    },
                    {
                        name: 'sharesBurned',
                        type: 'u64',
                    },
                ],
            },
        },
    ],
};
