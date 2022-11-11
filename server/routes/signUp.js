const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

router.use(express.urlencoded({extended:true}))
router.use(express.json())
const pool = require('../databaseAccess/db')

router.use((req,res,next) => {
    if(req.body.userName === undefined && req.body.password === undefined && req.body.email === undefined) return res.status(404).json({msg:"undefind values"})
    if(req.body.userName === null && req.body.password === null && req.body.email === null) return res.status(404).json({msg:"null values appeared"})
    if(req.body.userName === "" && req.body.password === "" && req.body.email === "") return res.status(404).json({msg:"empty values returned"})
    next()
})

router.use(async (req,res,next) => {
    const userName = req.body.userName
    const password = req.body.password
    const query1 = "SELECT username FROM person WHERE username = $1"
    const values1 = [userName] 
    try{
        const rows1 = await pool.query(query1, values1)
        if(rows1.rows.length > 0) return res.status(404).json({msg:"this username exists in the list"})
        const query2 = {text : "SELECT password FROM person WHERE password = $1", values : [password]}
        const rows2 = await pool.query(query2)
        if(rows2.rows.length > 0) return res.status(404).json({msg:"this password exists in the list"})
    }catch(err){
        return res.status(500).json({msg:"Unavailable"})
    }
    next()
})

router.use((req,res,next) => {
    const password = req.body.password
    if(password.length < 8) return res.status(404).json({msg:"password too short"})
    const chars = ['@', '#','!','$', '%', '^', '&','*']
    let specialContained = false, numbersContain = false
    for(let i = 0;i<chars.length;i++){
        if(password.includes(chars[i])) specialContained = true
    }
    const numbers = ['1','2','3','4','5','6','7','8','9','0']
    for(let i = 0;i<numbers.length;i++){
        if(password.includes(numbers[i])) numbersContain = true
    }
    if(!numbersContain && !specialContained){
        return res.status(404).json({msg:"Your password should contains numbers and specialCharacters"})
    }
    if(!numbersContain) return res.status(404).json({msg:"Your password should contains numbers"})
    if(!specialContained) return res.status(404).json({msg:"Your password should contains specialCharacters"})
    next()
})

router.post('/', async (req,res) => {
    await pool.query("INSERT INTO person (username,password,boughtids,email) VALUES ($1,$2,$3,$4)", [req.body.userName, req.body.password, [], req.body.email])
    return res.status(200).json({msg:"Succesfully signed Up"})
})

module.exports = router

