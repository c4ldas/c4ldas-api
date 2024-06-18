This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<h2> Justification</h2>

I have decided to rewrite my code running on https://c4ldas.com.br and the APIs created on that for Next.js. The current page is written using Nodejs/Express.js and deployed in Replit.com using Core account.
The main idea is to learn more about Nextjs and its features. Also, I can move the hosting to Vercel (which is free for hobby accounts) and have the benefits of it, like caching, CDN, etc.

Using App Router on Next.js currently and storing front pages on /(frontend) directory to clear as much as possible the app folder.

<h2> Structure </h2>

At the moment the structure of the application is:

<pre>
/
|-public/
|-app/
|  |--components/  
|  |--lib/   
|  |
|  |--(frontend)/    
|  |  |-- homepage       # done
|  |  |-- lol/           # pending
|  |  |-- tft/           # pending
|  |  |-- spotify/       # pending
|  |  |-- steam/         # pending
|  |  |-- twitch/        # pending
|  |  |-- valorant/      # pending
|  |  |-- youtube/       # pending
|  |  
|  |--api/
|     |-- spotify/       # pending
|     |-- twitch/        # pending
|     |
|     |-- youtube/       
|     |    |-- search/   # done
|     |    |-- channel/  # done
|     |     
|     |-- steam/          
|     |    |-- game/     # done
|     |     
|     |-- valorant/       
|     |    |-- lastgame/ # done
|     |    |-- rank/     # done
|     |    |-- puuid/    # done
|     |    |-- schedule/ # done
|     |     
|     |-- lol/
|     |    |-- rank/     # done
|     |     
|     |-- tft/
|     |    |-- rank/     # done
</pre>
