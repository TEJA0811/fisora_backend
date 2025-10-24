import express from 'express'
const router = express.Router()


router.post('/admin_login', (req, res) => {
    res.send('login')
})

router.post('/admin_change_password', (req, res) => {
    res.send('change_password')
})

router.post('/add_fish', (req, res) => {
    res.send('add_fish')
})

router.post('/update_fish', (req, res) => {
    res.send('pdate_fish')
})

router.delete('/fish', (req, res) => {
    res.send('delet fish')
})


// middleware that is specific to this router
const timeLog = (req: any, res: any, next: any) => {
    console.log('Time: ', Date.now())
    next()
}

router.use(timeLog)

export default router
