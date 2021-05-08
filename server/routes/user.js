const express = require('express');
const validator = require('validator');
const db = require('../database.js');

const router = express.Router();

router.put('/updateProfile', (req, res) => {
    let code;
    try {
        
        const {idUser, Name, Email, Password} = req.body;

        if(validator.isEmpty(Name)) {
            code = 0
            throw new Error('Name feild is mandatory')
        }

        if(validator.isEmpty(Email)) {
            code = 1
            throw new Error('Email feild is mandatory')
        }

        if(validator.isEmpty(Password)) {
            code = 3
            throw new Error('Password feild is mandatory')
        }

        if(!validator.isEmail(Email)) {
            code = 1
            throw new Error('Email is invalid')
        }

        if(Password.length < 6) {
            code = 3;
            throw new Error('Password must be atleast 6 characters long.')
        }

        let updateQuery = "UPDATE user SET Name = (?), Email = (?), Password = (?) where user.idUser = (?)"
        db.query(updateQuery, [Name, Email, Password, idUser], (err,result) => {
            if(err) {
                res.status(400).json({error : err.message});
            } else {
                console.log(result);
                let searchQuery = "Select * from user where user.idUser = (?)"
                db.query(searchQuery, [idUser],(error, result) => {
                    if(!err && result.length > 0) {
                        res.status(200).json({message : "success", user : result[0]});
                    } else if(err) {
                        res.status(400).json({error : error.message})
                    }
                })
            }
        })
    } catch(error) {
        if(error.message) {
            res.status(200).json({code : code , error : error.message})
        }else {
            res.status(400).json({error : error.message})
        }
    }
})

router.get('/findUserById', async (req,res) => {
    const {idUser} = req.query;
    const searchQuery = "select * from meetingscheduler.user where idUser = (?)"
    await db.query(searchQuery, [idUser], (error, result) => {
        if(error) {
            res.status(400).json({error : error.message})
        } else {
            res.status(200).json({user : result[0]})
        }
    })
}) 

module.exports = router;