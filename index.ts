import express from 'express'
import adminRoutes from './src/routes/admin.route.ts'
import authRoutes from './src/routes/auth.route.ts'
const app = express()
const port = 3000

app.use('/static', express.static('public'))

app.use('/', adminRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
