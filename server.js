if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
var cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.post('email', async (req, res) => {
  const { name, email } = req.body
  console.log(name, email)
  const smtpTransport = nodemailer.createTransport(
    'smtps://ziyak97%40gmail.com:' +
      encodeURIComponent(process.env.PASSWORD) +
      '@smtp.gmail.com:465'
  )

  const mailOptions = {
    from: 'ziyak97@gmail.com',
    to: email,
    subject: name + ' | new message!',
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
