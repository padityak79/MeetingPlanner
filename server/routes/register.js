const express = require('express');
const validator = require('validator');
const db = require('../database.js');
var nodemailer = require('nodemailer');

const {transporter,sendEmail} = require('../email.js')

const router = express.Router();

router.post('/', (req,res) => {
    let code;
    try {
        console.log(req.body)
        let {Name,Email,Password,Category} = req.body

        if(validator.isEmpty(Name)) {
            code = 0
            throw new Error('Name feild is mandatory')
        }

        if(validator.isEmpty(Email)) {
            code = 1
            throw new Error('Email feild is mandatory')
        }

        if(validator.isEmpty(Password)) {
            code = 2
            throw new Error('Password feild is mandatory')
        }

        if(!validator.isEmail(Email)) {
            code = 1
            throw new Error('Email is invalid')
        }

        if(Password.length < 6) {
            code = 2;
            throw new Error('Password must be atleast 6 characters long.')
        }

        let sqlQuery = "select * from user where user.Email = (?)"
        db.query(sqlQuery, [Email], (err, result) => {
            try{
                if(result.length > 0) {
                    code = 1
                    throw new Error('Email is already registered.')
                } else if(err) {
                    console.log(err)
                    res.status(400).json({error : err.message})
                } else {
                    sqlQuery = "INSERT INTO user (Name, Email, Password, Category) Values (?,?,?,?)"
                    db.query(sqlQuery, [Name, Email, Password, Category], (error, result) => {

                        if(error) {
                            res.status(400).json({error : error.message});
                        } else {    
                            console.log(result);

                            var mailOptions = {
                                from: 'meetingplanneriiita@gmail.com',
                                to: Email,
                                subject: 'Registration successful',
                                text: 'Thanks for registering!'
                            };

                            sendEmail(transporter,mailOptions);
                            res.status(200).json({message: "success"})
                        }
                    })
                }
            } catch(error) {
                console.log(error)
                res.status(200).json({code : code, error : error.message})        
            }
        })

    } catch (error) {
        res.status(200).json({code : code, error : error.message})
    }
})

module.exports = router;