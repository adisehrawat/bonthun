/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bonthunanc.json`.
 */
export type Bonthunanc = {
  "address": "9AzEGgnDWQP8zx9CCwe15iAxudmK7U6p1UdVHHqcyvRL",
  "metadata": {
    "name": "bonthunanc",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimBounty",
      "discriminator": [
        225,
        157,
        163,
        238,
        239,
        169,
        75,
        226
      ],
      "accounts": [
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "hunterProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "hunter"
              }
            ]
          }
        },
        {
          "name": "hunter",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createBounty",
      "discriminator": [
        122,
        90,
        14,
        143,
        8,
        125,
        200,
        2
      ],
      "accounts": [
        {
          "name": "bounty",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  117,
                  110,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "reward",
          "type": "u64"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "timeLimit",
          "type": "i64"
        }
      ]
    },
    {
      "name": "deleteProfile",
      "discriminator": [
        213,
        96,
        148,
        104,
        75,
        217,
        8,
        131
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "editProfile",
      "discriminator": [
        149,
        232,
        76,
        253,
        103,
        221,
        101,
        185
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        }
      ]
    },
    {
      "name": "initUserProfile",
      "discriminator": [
        148,
        35,
        126,
        247,
        28,
        169,
        135,
        175
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "isHunter",
          "type": "bool"
        },
        {
          "name": "isClient",
          "type": "bool"
        }
      ]
    },
    {
      "name": "selectWinner",
      "discriminator": [
        119,
        66,
        44,
        236,
        79,
        158,
        82,
        51
      ],
      "accounts": [
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "clientProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "hunterProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "winner"
              }
            ]
          }
        },
        {
          "name": "winner",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "bounty"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "submitWork",
      "discriminator": [
        158,
        80,
        101,
        51,
        114,
        130,
        101,
        253
      ],
      "accounts": [
        {
          "name": "submission",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "bounty"
              },
              {
                "kind": "account",
                "path": "hunter"
              }
            ]
          }
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "hunter",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "submissionLink",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bounty",
      "discriminator": [
        237,
        16,
        105,
        198,
        19,
        69,
        242,
        234
      ]
    },
    {
      "name": "submission",
      "discriminator": [
        58,
        194,
        159,
        158,
        75,
        102,
        178,
        197
      ]
    },
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "stringTooLong",
      "msg": "String too long for allocated space"
    },
    {
      "code": 6001,
      "name": "invalidTimeLimit",
      "msg": "Invalid time limit"
    },
    {
      "code": 6002,
      "name": "invalidReward",
      "msg": "Invalid reward amount"
    },
    {
      "code": 6003,
      "name": "notAClient",
      "msg": "Only client role can perform this action"
    },
    {
      "code": 6004,
      "name": "notAHunter",
      "msg": "Only hunter role can perform this action"
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6006,
      "name": "invalidStatus",
      "msg": "Invalid status transition or status"
    },
    {
      "code": 6007,
      "name": "submissionMismatch",
      "msg": "Submission does not belong to bounty or hunter mismatch"
    },
    {
      "code": 6008,
      "name": "pastDeadline",
      "msg": "Submission past the deadline"
    },
    {
      "code": 6009,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6010,
      "name": "insufficientEscrow",
      "msg": "Escrow does not have enough lamports"
    },
    {
      "code": 6011,
      "name": "invalidIndex",
      "msg": "Invalid index for PDA seeds"
    },
    {
      "code": 6012,
      "name": "seedIndexUnavailable",
      "msg": "Seed index unavailable (store it in the Bounty account)"
    },
    {
      "code": 6013,
      "name": "bountyNotOpen",
      "msg": "bounty open opened"
    },
    {
      "code": 6014,
      "name": "bountyNotClaimed",
      "msg": "Bounty has not been claimed."
    }
  ],
  "types": [
    {
      "name": "bounty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "reward",
            "type": "u64"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "timeLimit",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "bountyStatus"
              }
            }
          },
          {
            "name": "hunter",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "bountyStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "claimed"
          },
          {
            "name": "completed"
          }
        ]
      }
    },
    {
      "name": "submission",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bounty",
            "type": "pubkey"
          },
          {
            "name": "hunter",
            "type": "pubkey"
          },
          {
            "name": "submissionLink",
            "type": "string"
          },
          {
            "name": "submittedAt",
            "type": "i64"
          },
          {
            "name": "selected",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "avatar",
            "type": "string"
          },
          {
            "name": "isHunter",
            "type": "bool"
          },
          {
            "name": "isClient",
            "type": "bool"
          },
          {
            "name": "bountiesCompleted",
            "type": "u64"
          },
          {
            "name": "bountiesApplied",
            "type": "u64"
          },
          {
            "name": "totalSolEarned",
            "type": "u64"
          },
          {
            "name": "successRate",
            "type": "f64"
          },
          {
            "name": "bountiesPosted",
            "type": "u64"
          },
          {
            "name": "totalSolSpent",
            "type": "u64"
          },
          {
            "name": "bountiesCompletedAsClient",
            "type": "u64"
          },
          {
            "name": "bountiesRewarded",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
