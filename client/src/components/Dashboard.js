import react, {useContext,useHistory} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {blueGrey} from '@material-ui/core/colors';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import currentUserContext from '../context/userContext';
import moment from 'moment'
import { Button, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : "#fff",
        minHeight : "80vh",
        margin: 0,
        paddingTop : "40px",
        [theme.breakpoints.down("sm")] : {
            paddingTop : "20px",
            width:  "100%"
        }
    },
    head : {
        display : "flex",
        flexDirection : "column",
        margin: theme.spacing(1),
        justifyContent : "start",
        alignItems : "center"
    },
    icon: {
        width: theme.spacing(14),
        height: theme.spacing(14),
        color: '#fff',
        backgroundColor: blueGrey[500],
        marginBottom : 20,
        fontSize : "120px",
        [theme.breakpoints.down("sm")] : {
            width: theme.spacing(9),
            height: theme.spacing(9)
        }
    }, name : {
        fontFamily: "emoji",
        fontWeight : "300",
        fontSize : 22,
        [theme.breakpoints.down("sm")] : {
            fontSize : 12
        }
    }, body : {
        display : "flex",
        flexWrap : "wrap",
        justifyContent : "center",
        alignItems : "center",
        width : "100%",
        marginTop : 50
    }, card: {
        width : "50%",
        padding : 10,
        [theme.breakpoints.down("sm")] : {
            padding : 0,
            width : "80%"
        }
    }, cardHeader : {
        marginBottom: 16,
        fontSize : 20,
        textAlign : "center",
        [theme.breakpoints.down("sm")] : {
            fontSize : 12
        }
    },
    pos: {
        marginBottom: 10,
        fontSize : 15,
        [theme.breakpoints.down("sm")] : {
            fontSize : 10
        }
    }, table : {
        textAlign : "center",
        border : "1px solid black",
        width : "100%",
        marginTop : 20,
        [theme.breakpoints.down("sm")] : {
            width : "100%",
            fontSize : 10
        }
    }, tableHead : {
        backgroundColor : "black",
        color : "#fff"
    }, tableRow : {
        height : "40px",
        fontSize : 12,
        margin : 3,
        [theme.breakpoints.down("xs")] : {
            fontSize : 8,
            height : "50px"
        }
    }
}));

const Dashboard = (props) => {
    const classes = useStyles()
    const {changeSelectedMode,changeIndicatortab} = props
    const {user,upcomingMeetings} = useContext(currentUserContext);

    const handleClick = () => {
        changeSelectedMode("View My Meetings")
        changeIndicatortab(3)
    }

    return (
        <div className = {classes.root} >
            {user ? 
            <div className = {classes.head}>
                <Avatar className = {classes.icon}>
                    <ProfileIcon style = {{fontSize : "120px"}}/>
                </Avatar>
                <div className = {classes.name} style = {{marginBottom : "15px"}}>
                    {user.Name ? user.Name.toUpperCase() : ""}
                </div>
                <div className = {classes.name}>
                    {user.Email ? user.Email : ""}
                </div>
                <div className = {classes.name}>
                    {user.organisation ? user.organisation : ""}
                </div>
                <div className = {classes.body}> 
                    <Card className={classes.card} variant="outlined">
                        <CardContent>
                        <Typography color="textPrimary" className = {classes.cardHeader}>
                            Upcoming Meetings
                        </Typography>
                        {
                        upcomingMeetings.length > 0
                        ?
                        <Table className = {classes.table}>
                            <Thead className = {classes.tableHead}>
                                <Tr className = {classes.tableRow}>
                                <Th>Meeting Id</Th>
                                <Th>Meeting Room</Th>
                                <Th>Start Time</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {upcomingMeetings.map((meeting) => (
                                    <Tr className = {classes.tableRow}>
                                    <Td>{meeting.idMeeting}</Td>
                                    <Td>{meeting.meetingRoomId}</Td>
                                    <Td>{new moment(meeting.startTime).format("DD-MM-YYYY HH:mm:ss")}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        :
                        <></>
                        } 
                        <Button onClick = {handleClick} color="primary" style={{marginTop : "20px"}}>View More&#8594;</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            :
            <CircularProgress/>
            }
             
        </div>
    )
}

export default Dashboard