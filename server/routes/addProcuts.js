const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

router.use(express.urlencoded({extended:true}))
router.use(express.json())
const pool = require('../databaseAccess/db')


router.post('/', async (req,res) => {
    let productId = req.body.id
    let personUserName = req.body.userName
    const {rows} = await pool.query("SELECT id FROM person WHERE userName = $1", [personUserName])
    let personId = rows[0].id
    try{
        const result = await pool.query("UPDATE person SET boughtids = array_append(boughtids,$1) WHERE id = $2", [parseInt(productId), parseInt(personId)])
        return res.json(result)
    }catch(e){
        console.log(e)
        return res.status(500).json({msg:"not added, something went wrong to server"})
    }
})

router.get('/:userName' ,async (req,res) => {
    try{
        const {rows} = await pool.query("SELECT boughtids FROM person WHERE username = $1", [req.params.userName])
        if(rows.length === 0) return res.status(404).json({msg:"No such person exists"})
        return res.json(rows[0].boughtids)
    }catch(e){
        res.status(500).json({msg:"something went wrong with the server"})
    }
})

module.exports = router