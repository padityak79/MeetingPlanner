const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database.js');

const registerRouter = require('./routes/register.js');
const loginRouter = require('./routes/login.js');
const meetingsRouter = require('./routes/meeting.js');
const userRouter = require('./routes/user.js');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(bodyParser.json({limit : "30mb", extended : true}));
app.use(bodyParser.urlencoded({limit : "30mb", extended : true}));
app.use(cors());

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/meetings', meetingsRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)

    const deleteEXpiredMeetings = async () => {
        const now = new Date(new Date().getTime() + 330*60000)
        const nowString = now.toISOString().slice(0,19).replace('T',' ')
        const deletionQuery = "delete from meetingscheduler.meeting where endTime < (?)"
        await db.query(deletionQuery, [nowString], (err, result) => {
            console.log(result);
        })
    }

    deleteEXpiredMeetings()

    setInterval(() => deleteEXpiredMeetings(), 60000);
})