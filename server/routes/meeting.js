const express = require('express');
const validator = require('validator');
const db = require('../database.js');
var nodemailer = require('nodemailer');
const {transporter,sendEmail} = require('../email.js')

const router = express.Router();

let meetRooms = [1,2,3]; 
router.post('/addNewMeeting', async (req, res) => {
    const {idUser, creatorEmail, title, meetingDescription, startTime, endTime, meetingRoomId, participants} = req.body;

    let sqlQuery = "select idCreator, creatorEmail, title, meetingDescription from meetingscheduler.meeting where (meetingRoomId = (?)) and ((startTime >= (?) and startTime < (?)) or (endTime > (?) and endTime <= (?)) or (startTime <= (?)  and endTime >= (?)))"
    
    await db.query(sqlQuery, [meetingRoomId, startTime, endTime, startTime, endTime, startTime, endTime], async (err, result) => {
        if(!err && result.length > 0) {
            let availableMeetRooms = [];
            meetRooms.forEach(async (meetRoom) => {
                await db.query(sqlQuery, [meetRoom, startTime, endTime, startTime, endTime, startTime, endTime], async (error, searchResult) => {
                    if(!searchResult.length) {
                        console.log(meetRoom)
                        availableMeetRooms.push(meetRoom);
                    } 
                    if(meetRooms.indexOf(meetRoom) === meetRooms.length - 1) {
                        res.status(200).json({meetingsAlreadyScheduled : result, availableMeetRooms});
                    }
                })
            })

            // res.status(200).json({meetingAlreadyScheduled : result, availableMeetRooms});
        } else if(!err) {
            sqlQuery = "INSERT INTO meeting (idCreator, title, meetingDescription, startTime, endTime, meetingRoomId, creatorEmail) VALUES (?,?,?,?,?,?,?)";
            await db.query(sqlQuery, [idUser, title, meetingDescription, startTime, endTime, meetingRoomId, creatorEmail], async (err1, result) => {
                if(err1) {
                    res.status(400).json({error : err1.message});
                } else {
                    console.log(result);
                    participants.forEach(async (participant) => {
                        sqlQuery = "SELECT idUser from user where Email = (?)";
                        await db.query(sqlQuery, [participant], async (err2, searchResult) => {
                            console.log(searchResult);
                            if(!searchResult.length){
                                sqlQuery = "INSERT INTO user (Name, Email, Password) VALUES (?,?,?)";
                                await db.query(sqlQuery, [" ", participant, "abcabcabc"],async (err3, insertResult) => {
                                    if(!err3) {
                                        console.log(insertResult.insertId)

                                        var mailOptions = {
                                            from: 'meetingplanneriiita@gmail.com',
                                            to: participant,
                                            subject: 'Registration successful',
                                            text: 'Your account has been registered. Please login by using your Email and password "abcabcabc".'
                                        };
            
                                        sendEmail(transporter,mailOptions);
                                        let em = participant
                                        participant = insertResult.insertId;
                                        sqlQuery = "INSERT INTO usermeets (idMeeting, idUser, title, meetingRoomId, startTime, endTime) VALUES (?,?,?,?,?,?)";
                                        await db.query(sqlQuery, [result.insertId, participant, title, meetingRoomId, startTime, endTime], (error, insertResult) => {
                                            console.log(insertResult);
                                            if(!error){
                                            var mailOption = {
                                                from: 'meetingplanneriiita@gmail.com',
                                                to: em,
                                                subject: 'Meeting Scheduled',
                                                text: 'A meeting has been scheduled. Please login for details'
                                            };
                
                                            sendEmail(transporter,mailOption);}
                                            else{
                                                console.log(error)
                                            }
                                        })
                                    } 
                                })
                            } else if(!err2) {
                                let em=participant
                                participant = searchResult[0].idUser;
                                console.log(searchResult[0])
                                sqlQuery = "INSERT INTO usermeets (idMeeting, idUser, title, meetingRoomId, startTime, endTime) VALUES (?,?,?,?,?,?)";
                                await db.query(sqlQuery, [result.insertId, participant, title, meetingRoomId, startTime, endTime], (error, insertResult) => {
                                    console.log(insertResult);
                                    if(!error){
                                    var mailOption = {
                                        from: 'meetingplanneriiita@gmail.com',
                                        to: em,
                                        subject: 'Meeting Scheduled',
                                        text: 'A meeting has been scheduled. Please login for details.'
                                    };
        
                                    sendEmail(transporter,mailOption);}
                                    else{
                                        console.log(error)
                                    }
                                })
                            }
                        })
                    })

                    res.status(200).json({message: "success"});
                }
            })
        } else {
            res.status(400).json({error : err.message})
        }
    })    
})

router.get('/newMeetings', async (req, res) => {
    const {idUser} = req.query
    const now = new Date(new Date().getTime() + 330*60000);
    
    const nowString = now.toISOString().slice(0,19).replace('T',' ');
    const laterString = new Date(now.getTime() + 10*60000).toISOString().slice(0,19).replace('T',' ');
    console.log(idUser);
    console.log(nowString);
    console.log(laterString)

    let searchQuery = "select idMeeting, meetingRoomId, startTime from meetingscheduler.usermeets where idUser = (?) and startTime > (?) and startTime < (?)";
    db.query(searchQuery, [idUser, nowString, laterString], (error, result) => {
        if(error) {
            res.status(400).json({error : error.message});
        } else {
            res.status(200).json({meetings : result});
        }
    })
})


router.get('/myMeetings', async (req, res) => {
    const {idUser} = req.query

    let searchQuery = "select idMeeting, meetingRoomId, title, startTime, endTime from meetingscheduler.usermeets where idUser = (?)";
    db.query(searchQuery, [idUser], (error, result) => {
        console.log(result)
        if(error) {
            res.status(400).json({error : error.message});
        } else {
            res.status(200).json({meetings : result});
        }
    })
})


router.get('/allMeetings', async(req, res) => {
    const searchQuery = "select creatorEmail, title, meetingDescription, startTime, endTime, meetingRoomId, idCreator as creator from meetingscheduler.meeting"
    await db.query(searchQuery, [], (error, result) => {
        if(error) {
            res.status(400).json({error : error.message});
        } else {
            res.status(200).json({meetings : result});
        }
    })
})

module.exports = router;

