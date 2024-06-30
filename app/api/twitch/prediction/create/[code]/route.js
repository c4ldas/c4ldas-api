import { NextResponse } from "next/server";

export async function GET(request) {

  return NextResponse.json({ route: "create" });
}


/*
// Create prediction
router.get('/create/:code', async (req, res) => {
  const channel = req.query.channel
  const question = req.query.question || null
  const option1 = req.query.option1
  const option2 = req.query.option2
  const code = req.params.code
  const newPrediction = await createNewPrediction(code, channel, question, option1, option2)

  console.log(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${channel} - ${newPrediction}`)
  res.status(200).send(newPrediction)
})




// Create Prediction
async function createNewPrediction(code, channel, question, option1, option2) {

  const values = await databaseQuery(channel, code)
  if (values.erro) return values.erro

  const newToken = await generateNewToken(channel, values.refresh_token)

  const createPredictionFetch = await fetch('https://api.twitch.tv/helix/predictions', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${newToken.access_token}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'broadcaster_id': values.id,
      'title': question !== null ? question : 'Quem ganha esse mapa?',
      'prediction_window': 300,
      'outcomes':
        [
          { 'title': option1 },
          { 'title': option2 }
        ],
    })
  });

  const createPrediction = await createPredictionFetch.json()

  if (createPrediction.status) {
    //console.log(createPrediction)
    return 'Erro: Já existe aposta/palpite ativo, não é possível abrir novamente!'
  }
  // console.log(createPrediction)
  return `Aposta/Palpite criado. Opções: ${option1} / ${option2}`
}




// Database
async function databaseQuery(channel, code) {
  const values = await db.get(`twitch_${channel}`)
  const dbCode = values ? values.code : null
  if (dbCode !== code) {
    return { erro: 'Code inválido!' }
  }
  return { access_token: values.access_token, refresh_token: values.refresh_token, id: values.id }
}


// Generate New Token
async function generateNewToken(channel, refreshToken) {
  const newTokenFetch = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
      'client_id': process.env.TWITCH_CLIENT_ID,
      'client_secret': process.env.TWITCH_CLIENT_SECRET
    })
  })

  const newToken = await newTokenFetch.json()
  const newAccessToken = newToken.access_token
  const newRefreshToken = newToken.refresh_token

  const values = await db.get(`twitch_${channel}`)

  values.access_token = newAccessToken
  values.refresh_token = newRefreshToken

  const newTokenDb = await db.set(`twitch_${channel}`, values).then(async () => {
    const newValues = await db.get(`twitch_${channel}`)
    return newValues
  })
  return newTokenDb
}

*/