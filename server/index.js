const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PORT = 5700

const pool = require('./databaseAccess/db')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use("/auth/signup", require('./routes/signUp'))
app.use("/auth/login", require('./routes/login'))
app.use("/addproduct", require('./routes/addProcuts'))
app.use('/deleteProduct', require('./routes/deleteProduct'))

app.get('/', async (req,res) => {
    const {rows} = await pool.query("SELECT * FROM PRODUCT LIMIT 20")
    await pool.end()
    res.status(200).json(rows)
})

app.get('/persons', async (req,res) => {
    const {rows} = await pool.query("SELECT * FROM person")
    return res.status(200).json(rows)
})

app.listen(PORT,() => {
    console.log("app is running on port "+PORT)
})

