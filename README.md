<h2>Info</h2>

I have decided to rewrite the code of my webpage and APIs. The webpage is still the same address, https://c4ldas.com.br. 

The main idea was to learn more about Next.js and its features. Also, I could move the hosting to Vercel (which is free for hobby accounts) and have the benefits of caching, CDN, etc. 
The previous page was hosted in [Replit](https://replit.com) with a Core account (called Hacker in the past). The code of that is still in [c4ldas/apis](https://github.com/c4ldas/apis) repository and the website can be reached (not for long) in https://c4ldas-api.replit.app.

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
|  |  |-- tft/
|  |  |-- marvel-rivals/
|  |  |-- spotify/
|  |  |-- youtube/
|  |  |-- widgets/
|  |  |
|  |  |-- twitch/
|  |  |    |-- clip/
|  |  |    |-- prediction/
|  |  |
|  |  |-- valorant/
|  |  |    |-- puuid/
|  |  |    |-- lastgame/
|  |  |    |-- rank/
|  |  |    |-- schedule/
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
|     |
|     |-- tft/
|     |    |-- rank/
|     |
|     |-- marvel-rivals/
|     |    |-- rank/
|     |
|     |-- weather/
</pre>
