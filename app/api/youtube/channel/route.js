import { NextResponse } from 'next/server';



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const url = "https://youtube.googleapis.com/youtube/v3/channels";
    const id = await getChannelByHandle(username);
    const channelInfo = id != 0 ? await getChannelById(id, url) : { items: [] };
    return NextResponse.json(channelInfo);
  } catch (error) {
    console.log(error);
  }
}

// router.get("/:username", async (req, res) => {
//   const username = req.params.username;
//   const key = process.env.YOUTUBE_KEY;
//   // const innerTube = await Innertube.create(/* options */);
//   const url = "https://youtube.googleapis.com/youtube/v3/channels";
//
//   const id = await getChannelByHandle(username);
//   const channelInfo = id != 0 ? await getChannelById(id, url, key) : { items: [] };
//
//   const results = await channelInfo.items[0] || {
//     snippet: {
//       publishedAt: null,
//       channelId: null,
//       title: null,
//       description: null,
//       thumbnails: {
//         medium: {
//           url: "https://www.c4ldas.com.br/api/youtube/not-found.png",
//         },
//       },
//     },
//   };
//   const { title, description, publishedAt, thumbnails } = results.snippet;
//
//   res.status(200).json({ channelId: id, title, description, publishedAt, thumbnails });
// });


// async function getChannelByHandle(username) {
//   try {
//     const html = await (
//       await fetch(`https://youtube.com/${username}`)
//     ).text();
//     // const channelId = html.match(/(?<=channelId(":"|"\scontent="))[^"]+/g)[0];
//     const channelId = html.match(
//       /itemprop="url"\s*href="https:\/\/www\.youtube\.com\/channel\/([^"]+)"/,
//     )[1];
//     // console.log("Channel ID: ", channelId);
//     return channelId;
//
//     // Using Youtubei.js library
//     // const resolved = await innerTube.resolveURL(`https://youtube.com/${username}`);
//     // console.log("Resolved:", resolved)
//     // return resolved.payload.browseId;
//   } catch (error) {
//     // console.log(error)
//     // const errorMessage = JSON.parse(error.info);
//     // console.log("Youtube: ", errorMessage.error.message);
//     return 0;
//   }
// }
//
//
// async function getChannelById(id, url, key) {
//   try {
//     const info = await (await fetch(`${url}?part=id,snippet&id=${id}&key=${key}`)).json();
//     // console.log("Info: ", info)
//     return await info;
//
//   } catch (error) {
//     // console.log("Catch get ChannelById Youtube: ", error);
//     return 0;
//   }
// }