This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<h2> Justification</h2>

I have decided to rewrite my code running on https://c4ldas.com.br and the APIs created on that for Next.js. The current page is written using Nodejs/Express.js

Using App Router on Next.js currently and storing front pages on /(frontend) directory to clear as much as possible the app folder.


<h2> Structure </h2>

At the moment the structure of the application is:

<pre>
/
|-public/
|-app/
|  |--(frontend)/    
|  |  |-- homepage        # done
|  |  |-- lol/            # pending
|  |  |-- tft/            # pending
|  |  |-- spotify/        # pending
|  |  |-- steam/          # pending
|  |  |-- twitch/         # pending
|  |  |-- valorant/       # pending
|  |  |-- youtube/        # pending
|  |  
|  |--api/
|     |-- spotify/        # pending
|     |-- steam/          # pending
|     |-- twitch/         # pending
|     |-- youtube/        # pending
|     |-- valorant/       
|     |     |-- lastgame/ # pending
|     |     |-- rank/     # in progress
|     |     
|     |-- lol/
|     |    |-- rank/     # done
|     |     
|     |-- tft/
|     |    |-- rank/     # done
</pre>