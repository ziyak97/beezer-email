if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
var cors = require('cors')
const nodemailer = require('nodemailer')
const path = require('path')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const publicPath = path.join(__dirname, 'client', 'build')

const app = express()

const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.static(publicPath))
app.use(express.json())

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
)

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
})
const accessToken = oauth2Client.getAccessToken()

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.post('/email', async (req, res) => {
  const { name, email } = req.body
  console.log(name, email)

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'ziyak97@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  })

  const mailOptions = {
    from: 'ziyak97@gmail.com',
    to: email,
    subject: name + ' | new message from Ziyak!',
    text: `Hey, ${name}! Thanks for using my test signup form. If you like what you see and want to get in touch with me feel free to send me an email.`,
  }

  try {
    await smtpTransport.sendMail(mailOptions)
    res.status(200).send({ msg: 'Sent email successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err })
  }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
