import "date-fns";
import React,{useState,useContext} from "react";
import currentUserContext from "../context/userContext"

import ModelInfo from "./ModelInfo.js"

import axios from "axios"

import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import TextInput from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles'; 
import { Chip , CircularProgress, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root : {
    display : "flex",
    flexDirection: "column",
    alignItems : "center",
    justifycontent : "flex-start",
    paddingTop : "40px",
    [theme.breakpoints.down("sm")] : {
      width: "100%",
      paddingTop : "20px",
    }
  },
  head : {
    display : "flex",
    flexDirection : "column",
    margin: theme.spacing(1),
    marginBottom : theme.spacing(3),
    justifyContent : "start",
    alignItems : "center",
    [theme.breakpoints.down("sm")] : {
      width: "100%"
    }
  },
  name : {
    fontFamily: "emoji",
    fontWeight : "300",
    fontSize : 27,
    [theme.breakpoints.down("sm")] : {
      fontSize : 15
    }
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 215,
  },
  submitButton  : {
    margin : 30,
  },
  inputFields : {
      width : "100%",
      display : "flex",
      flexWrap : "wrap",
      justifyContent : "space-evenly",
      margin : theme.spacing(3),
      "&>div" : {
          width : "35%"
      },
      [theme.breakpoints.down("xs")] : {
          "&>div" : {
              width : "80%",
              marginBottom : theme.spacing(1)
          }
      }
  },
  inputContainer : {
      display : "flex",
      alignItems : "center",
      [theme.breakpoints.down("sm")] : {
        "&>*" : {
          fontSize : "10px"
        }
      }
  },
  timeInput : {
    [theme.breakpoints.down("sm")] : {
      marginBottom : "10px"
    }
  },
  select : {
    [theme.breakpoints.down("sm")] : {
      display: "flex",
      height : "30px",
      alignItems: "center"
    }
  },
  container : {
      display : "flex",
      minHeight : '200px',
      width : "50%",
      justifyContent : "center"
  },
  paper : {
    display : "flex",
    minHeight : '150px',
    width : "50%",
    marginBottom : "20px",
    flexWrap : "wrap",
    alignContent : "flex-start",
    padding : "10px",
    [theme.breakpoints.down("sm")] : {
      width : "70%",
      minHeight : "120px"
    }
  },
  chip : {
    marginRight : "10px",
    marginBottom: "10px",
    fontSize : "12px",
    [theme.breakpoints.down("sm")] : {
      fontSize : "10px",
      marginRight : "7px",
      marginBottom : "7px"
    }
  }, 
  submitButton : {
    margin : "40px",
  },
  card : {
    width : 600, 
    padding : "30px",
    display : "flex",
    alignItems : "center",
    flexDirection : "column"
  },
  tabContainer : {
    margin : "20px 0px"  
  },
}))


const AddNewMeeting = (props) => {
  const classes = useStyles()
  const {user,newMeet, setNewMeet} = useContext(currentUserContext)
  const {changeSelectedMode,changeIndicatortab} = props
  const localDate = new Date(new Date().getTime() + 330*60000);
  const [err,setErr] = useState({})
  const [emailInput , setEmailInput] = useState("")
  const [startDate,setStartDate] = useState(localDate.toISOString().slice(0,19));
  const [endDate,setEndDate] = useState(localDate.toISOString().slice(0,19)); 
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [roomId, setRoomId] = useState(1)
  const [membersArray , setMembersArray] = useState([])
  const [open, setOpen] = useState(false)
  const [prePlannedMeetings, setPrePlannedMeetings] = useState([])
  const [avalaibleMeetRooms, setAvailableMeetRooms] = useState([])
  const [openLoader,setOpenLoader] = useState(false)
  const changeNameValue = (e) => {
    setErr({})
    const {value} = e.target
    setNameValue(value)
  } 

  const changeDescriptionValue = (e) => {
    setErr({})
    const {value} = e.target
    setDescriptionValue(value)
  } 

  const handleRoomChange = (e) => {
    const {value} = e.target
    setRoomId(value)
  }

  const deleteMember = (index) => {
      const newMembersArray = membersArray.filter((m , i) => i !== index)
      setMembersArray(newMembersArray)
  }

  const addMember = () => {
      if(emailInput === user.Email || membersArray.includes(emailInput)) {
        setEmailInput("");
        return
      }
      const newMembersArray = [...membersArray , emailInput]
      setMembersArray(newMembersArray)
      setEmailInput("")
  }

  const onKeyDown = (e) => {
      if(e.keyCode === 13) {
          addMember()
      }
  }

  const handleSubmit = async () => {

    if(nameValue.length === 0) {
      setErr({code : 0, error : "Meeting Name Feild is mandatory"})
      return;
    }


    if(descriptionValue.length === 0) {
      setErr({code : 1, error : "Meeting Desciption Feild is mandatory"})
      return;
    }

    if(endDate < startDate) {
      alert("Invalid Meeting Times.")
      return;
    }

    setOpenLoader(true)

    let url = "http://localhost:5000/meetings/addNewMeeting"
    try {
      const response = await axios.post(url, {
      idUser : user.idUser,
      creatorEmail : user.Email,
      title : nameValue,
      meetingDescription : descriptionValue,
      startTime : startDate,
      endTime : endDate,
      meetingRoomId : roomId,
      participants : [user.Email,...membersArray]
      })

      console.log(response)
      setOpenLoader(false)
      const {message, availableMeetRooms, meetingsAlreadyScheduled} = response.data
      if(message === "success") {
        
        alert("New Meeting has been created")
        changeIndicatortab(0)
        changeSelectedMode("Dashboard")
        setNewMeet(newMeet+1) 
        return;
      }

      if(meetingsAlreadyScheduled.length > 0) {
        setPrePlannedMeetings(meetingsAlreadyScheduled)
        setAvailableMeetRooms(availableMeetRooms)
        setOpen(true)
      }

    } catch(error) {
      setOpenLoader(false)
      console.log(error)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className = {classes.root}>
      <div className = {classes.head}>
        <div className = {classes.name}>
          CREATE NEW MEETING
        </div>
      </div>
      <Grid container justify="space-around">
      <TextField
        id="datetime-local"
        label="Meet Start Time"
        type="datetime-local"
        inputProps = {{min : `${localDate.toISOString().slice(0,19)}`}}
        value={startDate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        className = {classes.timeInput}
        onChange={(e) => {
          setStartDate(e.target.value);
          setErr({})
        }}
      />
      <TextField
        id="datetime-local"
        label="Meet End Time"
        type="datetime-local"
        inputProps = {{min : `${localDate.toISOString().slice(0,19)}`}}
        value={endDate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        className = {classes.timeInput}
        onChange = {(e) => {
          setEndDate(e.target.value);
          setErr({})
        }}
        onBlur={(e) => {
          if(e.target.value < startDate) {
            alert("Invalid Ending Time. Meeting can't end before it starts")
            setEndDate(`${localDate.toISOString().slice(0,19)}`)
            return;
          }
          setEndDate(e.target.value);
        }}
      />
      <div className = {classes.select}>
        <InputLabel id="demo-simple-select-label" style = {{fontSize : "12px"}}>Meeting Room</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={roomId}
          onChange={handleRoomChange}
        >
          <MenuItem value={1}>Meet1</MenuItem>
          <MenuItem value={2}>Meet2</MenuItem>
          <MenuItem value={3}>Meet3</MenuItem>
        </Select>
      </div>
      </Grid>
      <div className = {classes.inputFields}>
        <TextInput required id="standard-required" value={nameValue} onChange={changeNameValue} variant="outlined" label="Name of the Meeting" helperText={err.code === 0 ? err.error : ""}/>
        <TextInput required id="standard-required" value={descriptionValue} onChange={changeDescriptionValue} variant="outlined" label="Description of the Meeting" helperText={err.code === 1 ? err.error : ""}/>
      </div>
      <Paper className={classes.paper} variant="outlined">{membersArray.map((email , index) => <Chip className={classes.chip} key={index} onDelete={() => deleteMember(index)} label={email}/>)}</Paper>
      <div className={classes.inputContainer}><TextField onKeyDown={onKeyDown} onChange={(e)=> setEmailInput(e.target.value)} value={emailInput}/><Button style={{marginLeft : "5px"}} variant="contained" onClick={addMember}>Add Member</Button></div>
      <div className = {classes.submitButton}><Button onClick = {handleSubmit} variant = "contained" color = "primary">Create New Meeting</Button></div>
      {
        openLoader ? 
        <CircularProgress/>
        : <></>
      }
      <Modal
      open = {open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      >
        <ModelInfo availableMeetingRooms = {avalaibleMeetRooms} prePlannedMeetings = {prePlannedMeetings}/>
        
      </Modal>

    </div>
  );
}

export default AddNewMeeting