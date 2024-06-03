/*
This endpoint shows the games of the day based on the tournament searched.
Information can be found here: 
https://c4ldas.com.br/api/valorant/schedule

Endpoint: 
https://repl.c4ldas.com.br/api/valorant/schedule?channel=$(channel)&league=LEAGUE_NAME&type=text

Response example:
"Game Changers BR: 17h - Black Dragons 0 x 0 LOUD"

{
  endpoint: `/api/valorant/schedule`,
  description: "Display the games of the day based on the tournament searched.",
  usage: `${origin}${pathname}?channel=$(channel)&league=LEAGUE_NAME&type=text`,
  params: {
    channel: {
      description: "Your Twitch channel",
      required: true
    },
    league: {
      description: "Name of the league",
      required: true,
      available_variables: [
        "challengers_br",
        "vct_lock_in",
        "game_changers_series_brazil",
        "last_chance_qualifier_br_and_latam",
        "vct_americas",
        "vct_masters",
        "champions",
        "ascension_americas",
        "last_chance_qualifier_americas",
        "game_changers_championship",
        "vct_emea"
      ]
    },
    type: {
      description: "Format of the response",
      required: false,
      default: "text",
      available_variables: ["json", "text"],
    }
  }
}

*/