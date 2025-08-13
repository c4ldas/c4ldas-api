<h2>Info</h2>

I have decided to rewrite the code of my webpage and APIs. The webpage is still the same address, https://c4ldas.com.br. 

The main idea was to learn more about Next.js and its features. Also, I could move the hosting to Vercel (which is free for hobby accounts) and have the benefits of caching, CDN, etc. 
The previous page was hosted in [Replit](https://replit.com) with a Core account (called Hacker by the time). 

<h2>Webpage</h2>

The webpage and the APIs are in https://c4ldas.com.br or https://repl.c4ldas.com.br.

<h2> Structure </h2>

This is the structure of the application:

<pre>
/
|- public/
|  |-- images/
|  |-- css/
|
|- app/
|  |--components/
|  |--lib/
|  |
|  |--(frontend)/
|  |  |-- homepage
|  |  |-- lol/
|  |  |    |-- rank/
|  |  |    |-- schedule/
|  |  |
|  |  |-- tft/
|  |  |-- marvel-rivals/ (retired)
|  |  |-- youtube/
|  |  |-- widgets/
|  |  |-- spotify/
|  |  |    |-- musica/
|  |  |
|  |  |-- twitch/
|  |  |    |-- clip/
|  |  |    |-- prediction/
|  |  |    |-- commercial/
|  |  |    |-- replay/
|  |  |
|  |  |-- valorant/
|  |  |    |-- puuid/
|  |  |    |-- lastgame/
|  |  |    |-- rank/
|  |  |    |-- schedule/
|  |  |    
|  |  |-- terms
|  |       |-- contact/
|  |       |-- about/
|  |       |-- privacy-policy/
|  |       |-- end-user-agreement/
|  |
|  |--api/
|     |-- spotify/
|     |    |-- musica/
|     |    |-- callback/
|     |    |-- logout/
|     |
|     |-- twitch/
|     |    |-- prediction/
|     |    |     |-- get/
|     |    |     |-- create/
|     |    |     |-- close/
|     |    |     |-- cancel/
|     |    |
|     |    |-- clip/
|     |    |-- replay/
|     |    |-- commercial/
|     |    |-- callback/
|     |    |-- logout/
|     |
|     |-- youtube/
|     |    |-- search/
|     |    |-- channel/
|     |
|     |-- steam/
|     |    |-- game/
|     |
|     |-- valorant/
|     |    |-- lastgame/
|     |    |-- rank/
|     |    |-- puuid/
|     |    |-- schedule/
|     |
|     |-- lol/
|     |    |-- rank/
|     |    |-- active-game/
|     |    |-- schedule/
|     |
|     |-- tft/
|     |    |-- rank/
|     |
|     |-- marvel-rivals/
|     |    |-- rank/ (retired)
|     |
|     |-- weather/
</pre>
