



/* 
// Search video ID information
router.get("/search/:search", async (req, res) => {
  const videoId = req.params.search;
  const type = req.query.type || "json";
  const url = `https://www.youtube.com/oembed?url=www.youtube.com/watch?v=${videoId}&format=json`;

  try {    
    const data = await getVideoData(url, videoId, type);
    res.status(200).send(data);
    
  } catch (error) {
    // console.log("Error in router.get /search/:search: ", error);
    res.status(200).send(`Request failed.`);
  }
});


async function getVideoData(url, videoId, type) {
  try {
    const dataRequest = await fetch(url);
    const data = await dataRequest.json();

    if(type == "json") {
      const { title, author_name, author_url, thumbnail_url } = data;
      return { title, author_name, author_url, thumbnail_url, video_url: `https://youtu.be/${videoId}` };
    }
    return (`${data.title} - https://youtu.be/${videoId}`);

  } catch (error) {
    // console.error(error);
    if(type == "json") {
      return { 
        error: {
          message: "Request Failed. Please check the video ID is correct or try again later.",
          video_id: `${videoId}`,
          code: 400
        }
      }
    }
    return `Request failed. Please check the video ID is correct or try again later. Video ID: ${videoId}`;
  }

};

 */