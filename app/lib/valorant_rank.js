export const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${region}/${id}`;
export const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}`;

export async function getRank(url, apiToken) {
  try {
    const rankRequest = await fetch(url, {
      method: "GET",
      next: { revalidate: 600 }, // 10 minutes
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiToken
      }
    });
    const data = await rankRequest.json();
    // console.log("getRank() function: ", data);
    return data;

  } catch (error) {
    // console.log("getRank() function: ", error);
    throw (error);
  }
}

export const validRegions = [
  { code: "ap",     region_name: "Asia Pacific"  },
  { code: "br",     region_name: "Brazil"        },
  { code: "eu",     region_name: "Europe"        },
  { code: "kr",     region_name: "Korea"         },
  { code: "latam",  region_name: "Latin America" },
  { code: "na",     region_name: "North America" }
]

export const tiers = [
  { tier: 0,    tier_name: "Unranked",      tier_name_pt: "Sem rank/elo"  },
  { tier: 1,    tier_name: "Unused1",       tier_name_pt: "Sem uso 1"     },
  { tier: 2,    tier_name: "Unused2",       tier_name_pt: "Sem uso 2"     },
  { tier: 3,    tier_name: "Iron 1",        tier_name_pt: "Ferro 1"       },
  { tier: 4,    tier_name: "Iron 2",        tier_name_pt: "Ferro 2"       },
  { tier: 5,    tier_name: "Iron 3",        tier_name_pt: "Ferro 3"       },
  { tier: 6,    tier_name: "Bronze 1",      tier_name_pt: "Bronze 1"      },
  { tier: 7,    tier_name: "Bronze 2",      tier_name_pt: "Bronze 2"      },
  { tier: 8,    tier_name: "Bronze 3",      tier_name_pt: "Bronze 3"      },
  { tier: 9,    tier_name: "Silver 1",      tier_name_pt: "Prata 1"       },
  { tier: 10,   tier_name: "Silver 2",      tier_name_pt: "Prata 2"       },
  { tier: 11,   tier_name: "Silver 3",      tier_name_pt: "Prata 3"       },
  { tier: 12,   tier_name: "Gold 1",        tier_name_pt: "Ouro 1"        },
  { tier: 13,   tier_name: "Gold 2",        tier_name_pt: "Ouro 2"        },
  { tier: 14,   tier_name: "Gold 3",        tier_name_pt: "Ouro 3"        },
  { tier: 15,   tier_name: "Platinum 1",    tier_name_pt: "Platina 1"     },
  { tier: 16,   tier_name: "Platinum 2",    tier_name_pt: "Platina 2"     },
  { tier: 17,   tier_name: "Platinum 3",    tier_name_pt: "Platina 3"     },
  { tier: 18,   tier_name: "Diamond 1",     tier_name_pt: "Diamante 1"    },
  { tier: 19,   tier_name: "Diamond 2",     tier_name_pt: "Diamante 2"    },
  { tier: 20,   tier_name: "Diamond 3",     tier_name_pt: "Diamante 3"    },
  { tier: 21,   tier_name: "Ascendant 1",   tier_name_pt: "Ascendente 1"  },
  { tier: 22,   tier_name: "Ascendant 2",   tier_name_pt: "Ascendente 2"  },
  { tier: 23,   tier_name: "Ascendant 3",   tier_name_pt: "Ascendente 3"  },
  { tier: 24,   tier_name: "Immortal 1",    tier_name_pt: "Imortal 1"     },
  { tier: 25,   tier_name: "Immortal 2",    tier_name_pt: "Imortal 2"     },
  { tier: 26,   tier_name: "Immortal 3",    tier_name_pt: "Imortal 3"     },
  { tier: 27,   tier_name: "Radiant",       tier_name_pt: "Radiante"      }
]
