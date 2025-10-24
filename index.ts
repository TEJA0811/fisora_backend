import express from 'express'
import verifyAuth from './src/controllers/auth.ts';
import fishList from './src/dummy/fishlist.json' with { type: 'json' };

const app = express()
const port = 3000

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.send(fishList)
})


app.get('/user', verifyAuth, (req, res) => {
  res.send('Got a PUT request at /user')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
