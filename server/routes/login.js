const express = require('express')
const router = express.Router()


const pool = require('../databaseAccess/db')

router.post('/', async (req,res) => {
    try{
        const {rows} = await pool.query("SELECT * FROM person WHERE username = $1 AND password = $2", [req.body.userName, req.body.password])
        if(rows.length > 0){
            return res.json({msg:"loged in successfully", personEmail : rows[0].email})
        }
    }catch(e){
        return res.json({msg:"we do not have such person in our list"})
    }
})

module.exports = router