const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

router.use(express.urlencoded({extended:true}))
router.use(express.json())
const pool = require('../databaseAccess/db')


router.put('/', async (req,res) => {
    try{
        const result = await pool.query("UPDATE person SET boughtids = array_remove(boughtids, $1) WHERE username = $2", [req.body.id, req.body.userName])
        return res.json({msg:"deleted successfully"})
    }catch(e){
        console.log(e)
        res.status(500).json({msg:"something went wrong with server"})
    }
})

module.exports = router