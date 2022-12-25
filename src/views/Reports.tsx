/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from "@emotion/styled"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import React, { FunctionComponent, useEffect } from "react"
import Form, { FRadioButton, InputField } from "../components/Form"
import Axios from "axios"
import Backdrop from "@mui/material/Backdrop"
import Loader from "react-loader-spinner"
import GenericModal from "../components/Modal"
import { FormFieldWrapper } from "./Home"
import { AddCircleRounded } from "@mui/icons-material"
import Modal from "@mui/material/Modal"
interface ReportsProps {}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface bullyInfo {
  bully_name: string
  bully_grade: string
  bully_gender: string
}
const Input = styled("input")({
  display: "none"
})

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const StyledTabPanel = styled(TabPanel)(() => ({
  // height: '50vh',
  // overflow: 'scroll'
}))

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  }
}

const Reports: FunctionComponent<ReportsProps> = () => {
  const [value, setValue] = React.useState(3)
  const [videoUploadStatus, setVideoUploadStatus] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [response, setResponse] = React.useState({} as any)
  const [openModal, setOpenModal] = React.useState(false)
  const [modalContent, setModalContent] = React.useState("" as any)
  const [otherBully, setOtherBully] = React.useState([] as bullyInfo[])
  const [bullies, setBullies] = React.useState([] as bullyInfo[])
  const [bullyCount, setBullyCount] = React.useState(1)
  const [getBully, setGetBully] = React.useState({} as any)
  const [oepnAddBully, setOpenBully] = React.useState(false)
  const [messageType, setMessageType] = React.useState(
    "" as "info" | "warning" | "error" | "success" | "danger"
  )
  const [bullyingReportForm] = React.useState({
    username: "",
    trustee_or_not: "",
    full_name: "",
    phone: "",
    email: "",
    school_name: "",
    admin_email: "",
    bully_finitial: "",
    bully_lname: "",
    bully_fullname: "",
    gender: "",
    bully_grade: "",
    bully_teacher: "",
    incident_date: "",
    incident_time: "",
    more_bullies: "",
    bully_supporters: "",
    staff_witnessed: "",
    staff_witness: "",
    staff_action: "",
    incident_place: "",
    physically_abused: "",
    victim_handicapped: "",
    victim_younger: "",
    details: "",
    serial_bully: "",
    other_incidents: ""
  })

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    console.log(newValue)
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const formData = new FormData()

  let url: string

  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
    // console.log(url);
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
    console.log(url)
  }

  let uploadVideo = async (e: any) => {
    console.log("e", e)
    formData.set("File", e.target.files[0])

    setLoading(true)
    try {
      let res = await Axios({
        method: "post",
        url: `${url + "/file-upload/upload"}`,
        data: formData
      })

      console.log("res.data", res.data, response, loading)
      localStorage.setItem("video_name", res.data[0].filename)
      setResponse(res.data)

      setLoading(false)
      setVideoUploadStatus(true)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
      setMessageType("error")
      setModalContent(<p>{error?.response?.data?.message}</p>)
      setOpenModal(true)
    }
  }

  let handleModalClose = () => {
    setOpenModal(false)
  }

  const sendBullyingReport = async (reqBody: any) => {
    console.log(reqBody)
    // return;
    setLoading(true)

    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (
      (reqBody.email && !reqBody.email.match(regexEmail)) ||
      (reqBody.adminemail && !reqBody.adminemail.match(regexEmail))
    ) {
      setModalContent(<div>principal email or personal email is invalid</div>)
      setMessageType("warning")
      setOpenModal(true)
      setLoading(false)
      return
    }
    setModalContent("")

    let { data: result } = await Axios({
      method: "get",
      url: `${url + "/sponsorships"}?zip_name=${reqBody.school_name}&&zip_code=${reqBody.zip_code}`
    })

    if (result?.length === 0) {
      setModalContent(
        <div>School is not protected under bullyvax check school name and zip code</div>
      )
      setMessageType("info")
      setOpenModal(true)
      setLoading(false)
      return
    }
    setModalContent("")

    console.log("reqBody", reqBody)
    const getVideo = localStorage.getItem("video_name")
    const link = `${url}/file-upload/image/${getVideo}`

    // cyber and and normal bully template
    const templateBully = `
		I have information involving bullying in your school. I am reporting this information through The BullyVaxx system. If you are not
		familiar with The BullyVaxx system please go to www.bullyvaxx.com for details. Once you are on the site if you will click on the School
		Administrator tab at the top of the Home page complete instructions for BullyVaxx will be provided for you. At the bottom of this page is
		a link where you can review my identification video. Thank you
            <br />
            ${reqBody.trustee_or_not}<br />
            If you have any further questions or need to immediately verify this
            information please contact me and I will provide the answers for
            you. <br />
            Your Full Name ${reqBody.full_name}<br />
            Your cell phone number ${reqBody.phone}<br />
            My e-mail address ${reqBody.email}<br />
            Name of School ${reqBody.school_name}<br />
            zip of School ${reqBody.zip_code}<br />
            Principal’s email address ${reqBody.admin_email}<br />
            What is the first initial in the bully’s first name ${reqBody.bully_finitial}<br />
            What is the bully’s last name ${reqBody.bully_lname}<br />
            Full name of bully ${reqBody.bully_fullname}<br />
            Gender of bully: ${reqBody.gender}<br />
            Grade of bully. ${reqBody.bully_grade}<br />
            Homeroom Teacher of bully ${reqBody.bully_teacher}<br />
            Date of incident ${reqBody.incident_date}<br />
            Time of incident ${reqBody.incident_time}<br />
            If more than one bully add their names here ${reqBody.more_bullies}<br />
            Names of any other students that supported the bully’s actions ${reqBody.other_incidents}
            <br />
            Did any teacher or staff member see this incident? ${reqBody.staff_witnessed}<br />
            If yes, who was the teacher / staff member? ${reqBody.staff_witness}
            <br />
            What actions did the teacher / staff member take? ${reqBody.staff_action}<br />
            Where did this incident occur? ${reqBody.incident_place}<br />
            Did the bully physically abuse the victim? ${reqBody.physically_abused}<br />
            Was the victim a handicapped student? ${reqBody.victim_handicapped}<br />
            Was the victim a
            younger or smaller student than the bully? ${reqBody.victim_younger}<br />
            In complete detail provide all information you have on this threat. ${reqBody.details}
            <br />
            Have you witnessed this bully abusing other students in the past? ${reqBody.serial_bully}
            <br />
            If Yes, please provide any details of other bullying incidents that
            you have witnessed or seen in the past involving this bully. ${reqBody.other_incidents}<br />
            Please send me a reply email confirming that you have received this
            information, this will allow me to know that the information that I
            have submitted is being properly addressed. Thank you.<br />
						<a href= "${link}" target="_blank"> Click here to review video </a>
    `

    // weapon threat template - solved
    const templateWeaponThreat = `
					
					I have information concernating a threat against your school. I am reporting this information through The BullyVaxx system. If you are not
					familiar with The BullyVaxx system please go to www.bullyvaxx.com for details. Once you are on the site if you will click on the School
					Administrator tab at the top of the Home page complete instructions for BullyVaxx will be provided for you. At the bottom of this page is
					a link where you can review my identification video. Thank you
					<br />
					${reqBody.trustee_or_not}<br />
					If you have any further questions or need to immediately verify this
					information please contact me and I will provide the answers for
					you. <br />

					My Full Name ${reqBody.full_name}<br />
					My cell phone number ${reqBody.phone}<br />
					My e-mail address ${reqBody.email}<br />
					Name of School ${reqBody.school_name}<br />
					zip of School ${reqBody.zip_code}<br />
					Principal’s email address ${reqBody.admin_email}<br />
					Full name of student/person bringing weapon to school ${reqBody.bully_fullname}<br />
					Gender of student/person bringing weapon to school: ${reqBody.gender}<br />
					Grade of student/person bringing weapon to school: ${reqBody.bully_grade}<br />
					If a student is bringing weapon to school, homeroom Teacher of student making threat  <br/>
					Date you learned about the weapon at school ${reqBody.incident_date}<br />
					Time you learned about threat ${reqBody.incident_time}<br />
					
					Names of any other students who may be aware of this weapon ${reqBody.other_incidents}
					<br />
					In complete detail provide all information you have on this threat ${reqBody.other_incidents}<br />
					Dear Principal, please send me a reply email confirming that you have received this information, this will allow me to know that the information that I have submitted is being properly addressed. Thank you. <br />

					<a href= "${link}" target="_blank"> Click here to review video </a>
    `

    // school threat template - solved
    const templateSchoolThreat = `
					Dear Principal, <br/>
					I have information concernating a threat against your school. I am reporting this information through The BullyVaxx system. If you are not
					familiar with The BullyVaxx system please go to www.bullyvaxx.com for details. Once you are on the site if you will click on the School
					Administrator tab at the top of the Home page complete instructions for BullyVaxx will be provided for you. At the bottom of this page is
					a link where you can review my identification video. Thank you
					<br />
					${reqBody.trustee_or_not}<br />
					If you have any further questions or need to immediately verify this
					information please contact me and I will provide the answers for
					you. <br />
					My Full Name ${reqBody.full_name}<br />
					My cell phone number ${reqBody.phone}<br />
					My e-mail address ${reqBody.email}<br />
					Name of School ${reqBody.school_name}<br />
					zip of School ${reqBody.zip_code}<br />
					Principal’s email address ${reqBody.admin_email}<br />
					Full name of student/person making threat  ${reqBody.bully_fullname}<br />
					Gender of student/person making threat : ${reqBody.gender}<br />
					Grade of student/person making threat . ${reqBody.bully_grade}<br />
					Homeroom Teacher of bully ${reqBody.bully_teacher}<br />
					Date of incident ${reqBody.incident_date}<br />
					Time of incident ${reqBody.incident_time}<br />
					
					Names of any other students that supported the bully’s actions ${reqBody.other_incidents}
					<br />
					In complete detail provide all information you have on this threat ${reqBody.other_incidents}<br />
					Dear Principal, please send me a reply email confirming that you have received this information, this will allow me to know that the information that I have submitted is being properly addressed. Thank you. <br />

					<a href= "${link}" target="_blank"> Click here to review video </a>
    `
    // other threat template - solved
    const templateOtherThreat = `
					Dear Principal, <br/>
					I have information concernating a threat against your school. I am reporting this information through The BullyVaxx system. If you are not familiar with The BullyVaxx system please go to www.bullyvaxx.com for details. Once you are on the site if you will click on the School
					Administrator tab at the top of the Home page complete instructions for BullyVaxx will be provided for you. At the bottom of this page is a link where you can review my identification video. Thank you
					<br />
					${reqBody.trustee_or_not}<br /> 
					My BullyVaxx  ${reqBody.username}<br /> 
					My Full Name ${reqBody.full_name}<br />
					My cell phone number ${reqBody.phone}<br />
					My e-mail address ${reqBody.email}<br />
					Name of School ${reqBody.school_name}<br />
					zip of School ${reqBody.zip_code}<br />
					Principal’s email address ${reqBody.admin_email}<br />
					Full name of student/person making threat  ${reqBody.bully_fullname}<br />
					Gender of student/person making threat : ${reqBody.gender}<br />
					Grade of student/person making threat . ${reqBody.bully_grade}<br />
					Homeroom Teacher of bully ${reqBody.bully_teacher}<br />
					Date of incident ${reqBody.incident_date}<br />
					Time of incident ${reqBody.incident_time}<br />
					
					Names of any other students that supported the bully’s actions ${reqBody.other_incidents}
					<br />
					In complete detail provide all information you have on this threat ${reqBody.other_incidents}<br />
					Dear Principal, please send me a reply email confirming that you have received this information, this will allow me to know that the information that I have submitted is being properly addressed. Thank you. <br />

					<a href= "${link}" target="_blank"> Click here to review video </a>
    `
    let template = ""

    if (value === 3) {
      reqBody.report_type = "bully"
      template = templateBully
    }

    if (value === 5) {
      reqBody.report_type = "others"
      template = templateOtherThreat
    }

    if (value === 2) {
      reqBody.report_type = "weapon in school"
      template = templateWeaponThreat
    }

    if (value === 0) {
      reqBody.report_type = "school threat"
      template = templateSchoolThreat
    }

    reqBody.user_id = localStorage.getItem("id")
    let data = {
      from: "info@bullyvaxx.com",
      to: reqBody.admin_email,
      subject: "Bullying Report",
      text: "Bullying Report",
      html: template
    }

    try {
      // let res = await Axios({
      // 	method: "post",
      // 	url: `${url + "/mailing-service/send-mail"}`,
      // 	data: data,
      // });

      // data.to = reqBody.email;

      // let toUser = await Axios({
      // 	method: "post",
      // 	url: `${url + "/mailing-service/send-mail"}`,
      // 	data: data,
      // });

      if (bullies.length > 0) {
        reqBody.bullies = bullies
      }

      let { data: result } = await Axios({
        method: "post",
        url: `${url + "/users/report"}`,
        data: reqBody,
        headers: {
          "Authorization": "Bearer" + localStorage.getItem("app_id")
        }
      })

      // console.log(res, toUser);
      console.log(result)

      // if (res.data) setResponse(res.data);
      // if(result)
      setLoading(false)
      setMessageType("success")
      // setModalContent(<p>{res.data.message}</p>);
      setOpenModal(true)
      localStorage.removeItem("video_name")
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
      setMessageType("error")
      setModalContent(<p>{error?.response?.data?.message}</p>)
      setOpenModal(true)
    }
  }

  const oepnAddBullyModal = () => {
    setOpenBully(!oepnAddBully)
  }

  const handleBullyCount = () => {
    const currentCount = otherBully.length + 1
    const updatedInfo: bullyInfo[] = [
      ...otherBully,
      {
        "bully_name": "",
        "bully_grade": "",
        "bully_gender": ""
      }
    ]
    setOtherBully(updatedInfo)
    console.log(updatedInfo)
    // setBullyCount(currentCount);
    console.log(currentCount)
  }

  const submitBully = (reqBody: any): any => {
    let bullies: any[] = []
    const allKeys = Object.keys(reqBody).length
    if (allKeys) {
      let count = allKeys / 3
      let currentIndex = 0
      for (let i = 0; i < count; i++) {
        if (reqBody[`other_bully_name${currentIndex}`]) {
          bullies.push({
            bully_name: reqBody[`other_bully_name${currentIndex}`],
            bully_grade: reqBody[`other_bully_grade${currentIndex}`],
            bully_gender: reqBody[`other_bully_gender${currentIndex}`]
          })
          currentIndex += 1
        }
      }
      console.log(bullies)
      setBullies(bullies)
      if (bullies) setOpenBully(false)
    }
  }

  useEffect(() => {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === "development") {
      url = `${process.env.REACT_APP_DEV_BACKEND}`
      // console.log(url);
    } else if (process.env.NODE_ENV === "production") {
      url = `https://bullyvax.onrender.com`
      console.log(url)
    }
  }, [])

  return (
    <div style={{ width: "100%" }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
      </Backdrop>
      {openModal && (
        <GenericModal messageType={messageType} handleClose={handleModalClose}>
          {modalContent}
        </GenericModal>
      )}
      {!videoUploadStatus && (
        <Box sx={{ width: "100%", p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h3">
                Start by uploading a simple "selfie" video using the statement below:
              </Typography>
              <p>
                The first step to submitting a report through BullyVaxx is to upload a short, ID
                verification video. Please follow these 4 guidelines when recording this video
                <ul>
                  <li>
                    All video must be made at arm's lenght from straight ahead clearly showing the
                    person's face and head{" "}
                  </li>
                  <li>No sun glasses, caps or anyhting that will obstruct the view can be worn </li>
                  <li>The audio must be clear and easy to understand </li>
                  <li>
                    Please say this statement in your video " My BullyVaxx username is
                    _______________ Today's date is ___________ "{" "}
                  </li>
                </ul>
              </p>
              {/* <p>
								My username is ______________. Today’s date is ___________. NOTE: If you are submitting this information as a trustee for another
								individual who chooses to not be identified, please add the statement below to your video: I am submitting this information as a
								trustee. Upload an Identification Video
							</p> */}
              {/* <Form initialValues={{ selfie_video: '' }} buttonText="upload" buttonSize="medium" submit={uploadVideo}>
              <InputField size="small" color="secondary" name="selfie_video" type="file" variant="outlined" />
            </Form> */}
              <label htmlFor="contained-button-file">
                <Input
                  accept="video/*"
                  id="contained-button-file"
                  onChange={(e) => uploadVideo(e)}
                  multiple
                  type="file"
                />
                <Button color="secondary" variant="contained" component="span">
                  UPLOAD VIDEO
                </Button>
              </label>
            </Grid>
            {/* <Grid item xs={12} sm={5}>
							<Typography style={{ textAlign: "center" }} variant="h4">
								Guidelines
							</Typography>
							<Typography style={{ textAlign: "center" }} variant="h5">
								All videos must conform to these rules:
							</Typography>
							<ul>
								<li>All videos must be made at arm’s length from straight ahead clearly showing the person’s face and head.</li>
								<li>No sun glasses, caps or anything that will obstruct the view can be worn.</li>
								<li>The audio must be clear and easy to understand.</li>
							</ul>
						</Grid> */}
          </Grid>
        </Box>
      )}
      {videoUploadStatus && (
        <Box sx={{ width: "100%", p: 2 }}>
          <Typography variant="h3">What type of information are you submitting?</Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
            >
              <Tab label="Threat against a school" {...a11yProps(0)} />
              <Tab disabled label="Mass Attack Threat" {...a11yProps(1)} />
              <Tab label="Weapons in School" {...a11yProps(2)} />
              <Tab label="Bullying" {...a11yProps(3)} />
              <Tab disabled label="Cyberbullying" {...a11yProps(4)} />
              <Tab label="Other threat" {...a11yProps(5)} />
            </Tabs>
          </Box>

          {/* threat against school */}
          <StyledTabPanel value={value} index={0}>
            <Typography variant="h4">THREAT AGAINST A SCHOOL</Typography>
            <Form
              initialValues={bullyingReportForm}
              buttonText="submit report"
              buttonSize="medium"
              submit={sendBullyingReport}
            >
              To report a school shooter or any type threat against a school complete the form below
              and click SUBMIT REPORT. The report will automatically be sent by email to the
              principal: <br />
              Dear Principal, I have information involving a threat against your school. I am
              reporting this threat through The Threat Alert system. <br />
              <FRadioButton
                name="trustee_or_not"
                options={[
                  "I am a trustee reporting this information for another individual who requests to not be identified; however, I will act as an intermediary so you can immediately access any additional information you need.",
                  "I am not a trustee for someone else, I am submitting this information on my own behalf."
                ]}
              />
              <br />
              I have uploaded an identification video in the Threat Alert System database. You can
              view this video at www.threatalert.us under my username
              <InputField
                size="small"
                color="secondary"
                name="username"
                type="text"
                variant="outlined"
              />
              .<br />
              If you have any further questions or need to immediately verify this information
              please contact me and I will provide the answers for you.
              <br />
              Your Full Name{" "}
              <InputField
                size="small"
                color="secondary"
                name="full_name"
                type="text"
                variant="outlined"
              />
              <br />
              Your cell phone number{" "}
              <InputField
                size="small"
                color="secondary"
                name="phone"
                type="text"
                variant="outlined"
              />
              <br />
              My e-mail address{" "}
              <InputField
                size="small"
                color="secondary"
                name="email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="school_name"
                type="text"
                variant="outlined"
              />
              <br />
              Zip code of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="zip_code"
                type="text"
                variant="outlined"
              />
              <br />
              Principal’s email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of person/student making this threat?{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_fullname"
                type="text"
                variant="outlined"
              />
              <br />
              Gender of person/student making this threat: <br />
              <FRadioButton name="gender" options={["Male", "Female"]} />
              <br />
              Grade of person if student is making this threat.{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_grade"
                type="number"
                variant="outlined"
              />
              <br />
              Homeroom Teacher of person/student making this threat.{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_teacher"
                type="text"
                variant="outlined"
              />
              <br />
              When is this attack supposed to occur?{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_date"
                type="date"
                variant="outlined"
              />
              <br />
              Do any other people/students have knowledge of this threat? <br />
              <FRadioButton name="more_bullies" options={["No", "Yes"]} />
              <br />
              If yes, what are their names? (if more than one person, seperate their names using
              commas){" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_supporters"
                type="text"
                variant="outlined"
              />
              <br />
              In complete detail provide all information you have on this threat.{" "}
              <InputField
                size="small"
                color="secondary"
                name="other_incidents"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Please send me a reply email confirming that you have received this information, this
              will allow me to know that the information that I have submitted is being properly
              addressed. Thank you.
              <br />
            </Form>
          </StyledTabPanel>

          {/* mass attack threat */}
          <StyledTabPanel value={value} index={1}>
            <Typography variant="h4">MASS ATTACK THREAT</Typography>
            <Form
              initialValues={bullyingReportForm}
              buttonText="submit report"
              buttonSize="medium"
              submit={sendBullyingReport}
            >
              To report a mass attack, terrorism, workplace attack or any other public mass attack
              complete the form below and click SUBMIT REPORT. The report will automatically be sent
              by email to the proper authorities: <br />
              Dear Sir, I have information involving a terrorism threat. I am reporting this threat
              through The Threat Alert system. <br />
              <FRadioButton
                name="trustee_or_not"
                options={[
                  "I am a trustee reporting this information for another individual who requests to not be identified; however, I will act as an intermediary so you can immediately access any additional information you need.",
                  "I am not a trustee for someone else, I am submitting this information on my own behalf."
                ]}
              />
              <br />I have uploaded an identification video in the Threat Alert System database. You
              can view this video at www.threatalert.us under my username{" "}
              <InputField
                size="small"
                color="secondary"
                name="username"
                type="text"
                variant="outlined"
              />
              . <br />
              If you have any further questions or need to immediately verify this information
              please contact me and I will provide the answers for you. <br />
              Your Full Name{" "}
              <InputField
                size="small"
                color="secondary"
                name="full_name"
                type="text"
                variant="outlined"
              />
              <br />
              Your cell phone number{" "}
              <InputField
                size="small"
                color="secondary"
                name="phone"
                type="text"
                variant="outlined"
              />
              <br />
              My e-mail address{" "}
              <InputField
                size="small"
                color="secondary"
                name="email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of County{" "}
              <InputField
                size="small"
                color="secondary"
                name="country"
                type="text"
                variant="outlined"
              />
              <br />
              County Sheriff's email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of person/student making this threat?{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_fullname"
                type="text"
                variant="outlined"
              />
              <br />
              Gender of person/student making this threat: <br />
              <FRadioButton name="gender" options={["Male", "Female"]} /> <br />
              When is this attack supposed to occur?{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_date"
                type="date"
                variant="outlined"
              />{" "}
              <br />
              Do any other people/students have knowledge of this threat? <br />
              <FRadioButton name="student_witness" options={["Yes", "No"]} />
              <br />
              If yes, what are their names? (if more than one person, seperate their names using
              commas){" "}
              <InputField
                size="small"
                color="secondary"
                name="more_bullies"
                type="text"
                variant="outlined"
              />
              <br />
              In complete detail provide all information you have on this threat.{" "}
              <InputField
                size="small"
                color="secondary"
                name="other_incidents"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Please send me a reply email confirming that you have received this information, this
              will allow me to know that the information that I have submitted is being properly
              addressed. Thank you. <br />
            </Form>
          </StyledTabPanel>

          {/* weapon in school */}
          <StyledTabPanel value={value} index={2}>
            <Typography variant="h4">WEAPONS IN SCHOOL</Typography>
            <Form
              initialValues={bullyingReportForm}
              buttonText="submit report"
              buttonSize="medium"
              submit={sendBullyingReport}
            >
              To report a WEAPON IN THE SCHOOL complete the form below and click SUBMIT REPORT. The
              report will automatically be sent by email to the principal: Dear Principal, I have
              information involving a weapon in your school. I am reporting this threat through The
              Threat Alert system. <br />
              <FRadioButton
                name="trustee_or_not"
                options={[
                  "I am a trustee reporting this information for another individual who requests to not be identified; however, I will act as an intermediary so you can immediately access any additional information you need.",
                  "I am not a trustee for someone else, I am submitting this information on my own behalf."
                ]}
              />
              <br />I have uploaded an identification video in the Threat Alert System database. You
              can view this video at www.threatalert.us under my username{" "}
              <InputField
                size="small"
                color="secondary"
                name="username"
                type="text"
                variant="outlined"
              />
              . <br />
              If you have any further questions or need to immediately verify this information
              please contact me and I will provide the answers for you. <br />
              Your Full Name{" "}
              <InputField
                size="small"
                color="secondary"
                name="full_name"
                type="text"
                variant="outlined"
              />
              <br />
              Your cell phone number{" "}
              <InputField
                size="small"
                color="secondary"
                name="phone"
                type="text"
                variant="outlined"
              />
              <br />
              My e-mail address{" "}
              <InputField
                size="small"
                color="secondary"
                name="email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="school_name"
                type="text"
                variant="outlined"
              />
              <br />
              Zip code of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="zip_code"
                type="text"
                variant="outlined"
              />
              <br />
              Principal’s email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of the person/student bringing the weapon to school?{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_fullname"
                type="text"
                variant="outlined"
              />
              <br />
              Gender of person/student bringing the weapon to school: <br />
              <FRadioButton name="gender" options={["Male", "Female"]} />
              <br />
              Grade of person/student bringing the weapon to school.{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_grade"
                type="text"
                variant="outlined"
              />
              <br />
              Homeroom Teacher of person/student bringing the weapon to school{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_teacher"
                type="text"
                variant="outlined"
              />
              <br />
              What type of weapon is this?{" "}
              <InputField
                size="small"
                color="secondary"
                name="weapon_type"
                type="text"
                variant="outlined"
              />
              <br />
              Do any other people/students have knowledge of this threat? <br />
              <FRadioButton name="student_witnessed" options={["Yes", "No"]} />
              <br />
              If yes, what are their names? (if more than one person, seperate their names using
              commas){" "}
              <InputField
                size="small"
                color="secondary"
                name="more_bullies"
                type="text"
                variant="outlined"
              />
              <br />
              Where does the student keep this weapon at school?{" "}
              <InputField
                size="small"
                color="secondary"
                name="waepon_store"
                type="text"
                variant="outlined"
              />
              <br />
              Do you know why this student is bringing this weapon to school?{" "}
              <InputField
                size="small"
                color="secondary"
                name="weapon_reson"
                type="text"
                variant="outlined"
              />
              <br />
              In complete detail provide all information you have on this threat.{" "}
              <InputField
                size="small"
                color="secondary"
                name="other_incidents"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Please send me a reply email confirming that you have received this information, this
              will allow me to know that the information that I have submitted is being properly
              addressed. Thank you.
              <br />
            </Form>
          </StyledTabPanel>

          {/* bullying  */}
          <StyledTabPanel value={value} index={3}>
            <Typography variant="h4">BULLYING</Typography>

            <Form
              initialValues={bullyingReportForm}
              buttonText="submit report"
              buttonSize="medium"
              submit={sendBullyingReport}
            >
              I have information involving bullying in your school. I am reporting this information
              through The BullyVaxx system. If you are not familiar with The BullyVaxx system please
              go to www.bullyvaxx.com for details. Once you are on the site if you will click on the
              School Administrator tab at the top of the Home page complete instructions for
              BullyVaxx will be provided for you. At the bottom of this page is a link where you can
              review my identification video. Thank you
              <FRadioButton
                name="trustee_or_not"
                options={[
                  "I am a trustee reporting this information for another individual who requests to not be identified; however, I will act as an intermediary so you can immediately access any additional information you need.",
                  "I am not a trustee for someone else, I am submitting this information on my own behalf."
                ]}
              />
              <br />
              If you have any further questions or need to immediately verify this information
              please contact me and I will provide the answers for you. <br />
              Your Full Name{" "}
              <InputField
                size="small"
                color="secondary"
                name="full_name"
                type="text"
                variant="outlined"
              />
              <br />
              Your cell phone number{" "}
              <InputField
                size="small"
                color="secondary"
                name="phone"
                type="text"
                variant="outlined"
              />
              <br />
              My e-mail address{" "}
              <InputField
                size="small"
                color="secondary"
                name="email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="school_name"
                type="text"
                variant="outlined"
              />
              <br />
              Zip code of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="zip_code"
                type="text"
                variant="outlined"
              />
              <br />
              Principal’s email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              What is the first initial in the bully’s first name{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_finitial"
                type="text"
                variant="outlined"
              />
              <br />
              What is the bully’s last name{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_lname"
                type="text"
                variant="outlined"
              />
              <br />
              Full name of bully{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_fullname"
                type="text"
                variant="outlined"
              />
              <br />
              Gender of bully: <br />
              <FRadioButton name="gender" options={["Male", "Female"]} />
              <br />
              Grade of bully.{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_grade"
                type="text"
                variant="outlined"
              />
              <br />
              Homeroom Teacher of bully{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_teacher"
                type="text"
                variant="outlined"
              />
              <br />
              Date of incident{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_date"
                type="date"
                variant="outlined"
              />
              <br />
              Time of incident{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_time"
                type="time"
                variant="outlined"
              />
              <br />
              If more than one bully add their names here{" "}
              {/* <div style={{ marginBottom: "2%", marginTop: "2%" }}> */}
              <Button variant="contained" color="info" onClick={() => oepnAddBullyModal()}>
                Add More Bully Details
              </Button>
              {/* </div> */}
              {/* <InputField size="small" color="secondary" name="more_bullies" type="text" variant="outlined" /> */}
              <br />
              Names of any other students that supported the bully’s actions{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_supporters"
                type="text"
                variant="outlined"
              />
              <br />
              Did any teacher or staff member see this incident? <br />
              <FRadioButton name="staff_witnessed" options={["Yes", "No"]} />
              <br />
              If yes, who was the teacher / staff member?{" "}
              <InputField
                size="small"
                color="secondary"
                name="staff_witness"
                type="text"
                variant="outlined"
              />
              <br />
              What actions did the teacher / staff member take?{" "}
              <InputField
                size="small"
                color="secondary"
                name="staff_action"
                type="text"
                variant="outlined"
              />
              <br />
              Where did this incident occur?{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_place"
                type="text"
                variant="outlined"
              />
              <br />
              Did the bully physically abuse the victim? <br />
              <FRadioButton name="physically_abused" options={["Yes", "No"]} />
              <br />
              Was the victim a handicapped student? <br />
              <FRadioButton name="victim_handicapped" options={["Yes", "No"]} /> <br />
              Was the victim a younger or smaller student than the bully? <br />
              <FRadioButton name="victim_younger" options={["Yes", "No"]} /> <br />
              In complete detail provide all information you have on this threat.{" "}
              <InputField
                size="small"
                color="secondary"
                name="details"
                type="text"
                variant="outlined"
              />
              <br />
              Have you witnessed this bully abusing other students in the past?
              <br />
              <FRadioButton name="serial_bully" options={["Yes", "No"]} /> <br />
              If Yes, please provide any details of other bullying incidents that you have witnessed
              or seen in the past involving this bully.{" "}
              <InputField
                size="small"
                color="secondary"
                name="other_incidents"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Please send me a reply email confirming that you have received this information, this
              will allow me to know that the information that I have submitted is being properly
              addressed. Thank you.
              <br />
            </Form>

            <Modal
              open={oepnAddBully}
              onClose={oepnAddBullyModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Form initialValues={{}} buttonText="save" buttonSize="medium" submit={submitBully}>
                  {otherBully.map((bully, index) => (
                    <div style={{ marginBottom: "2px" }}>
                      <FormFieldWrapper>
                        <InputField
                          size="small"
                          color="secondary"
                          fullWidth={true}
                          key={`keyName${index}`}
                          name={`other_bully_name${index}`}
                          variant="outlined"
                          label={`Bully Name${index + 1}`}
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper>
                        <InputField
                          size="small"
                          color="secondary"
                          fullWidth={true}
                          key={`keyGrade${index}`}
                          name={`other_bully_grade${index}`}
                          variant="outlined"
                          label={`Bully Grade${index + 1}`}
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper>
                        <InputField
                          size="small"
                          color="secondary"
                          fullWidth={true}
                          key={`keyGender${index}`}
                          name={`other_bully_gender${index}`}
                          variant="outlined"
                          label={`Bully Gender${index + 1}`}
                        />
                      </FormFieldWrapper>
                    </div>
                  ))}
                  <div style={{ marginBottom: "2%", marginTop: "2%" }}>
                    <Button
                      variant="contained"
                      endIcon={<AddCircleRounded />}
                      onClick={() => handleBullyCount()}
                    >
                      Add Bully
                    </Button>
                  </div>
                  {/* <div style={{ marginBottom: "2%", marginTop: "2%" }}>
								<Button variant="contained" endIcon={<AddCircleRounded />} onClick={() => submitBully()}>
									Cancel
								</Button>
							</div> */}
                </Form>
              </Box>
            </Modal>

            {/* <OtherBullyForm /> */}
          </StyledTabPanel>

          {/* cyber cyberbullly report  */}
          <StyledTabPanel value={value} index={4}>
            <Typography variant="h4">CYBERBULLYING</Typography>
            <Form
              initialValues={bullyingReportForm}
              buttonText="submit report"
              buttonSize="medium"
              submit={sendBullyingReport}
            >
              To report BULLYING IN THE SCHOOL complete the form below and click SUBMIT REPORT. The
              report will automatically be sent by email to the principal: <br />
              Dear Principal, I have information involving cyberbullying in your school. I am
              reporting this threat through The Threat Alert system. <br />
              <FRadioButton
                name="gender"
                options={[
                  "I am a trustee reporting this information for another individual who requests to not be identified; however, I will act as an intermediary so you can immediately access any additional information you need.",
                  "I am not a trustee for someone else, I am submitting this information on my own behalf."
                ]}
              />
              <br />
              If you have any further questions or need to immediately verify this information
              please contact me and I will provide the answers for you. <br />
              Your Full Name{" "}
              <InputField
                size="small"
                color="secondary"
                name="full_name"
                type="text"
                variant="outlined"
              />
              <br />
              Your cell phone number{" "}
              <InputField
                size="small"
                color="secondary"
                name="phone"
                type="text"
                variant="outlined"
              />
              <br />
              My e-mail address{" "}
              <InputField
                size="small"
                color="secondary"
                name="email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="school_name"
                type="text"
                variant="outlined"
              />
              <br />
              Zip code of School{" "}
              <InputField
                size="small"
                color="secondary"
                name="zip_code"
                type="text"
                variant="outlined"
              />
              <br />
              Principal’s email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              What is the first initial in the bully’s first name{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_finitial"
                type="text"
                variant="outlined"
              />
              <br />
              What is the cyberbully’s last name{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_lname"
                type="text"
                variant="outlined"
              />
              <br />
              Full name of cyberbully{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_fullname"
                type="text"
                variant="outlined"
              />
              <br />
              Gender of cyberbully: <br />
              <FRadioButton name="gender" options={["Male", "Female"]} /> <br />
              Grade of cyberbully.{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_grade"
                type="text"
                variant="outlined"
              />
              <br />
              Homeroom Teacher of cyberbully{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_teacher"
                type="text"
                variant="outlined"
              />
              <br />
              Date of incident{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_date"
                type="date"
                variant="outlined"
              />
              <br />
              Time of incident{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_time"
                type="time"
                variant="outlined"
              />
              <br />
              If more than one cyberbully add their names here{" "}
              <InputField
                size="small"
                color="secondary"
                name="more_bullies"
                type="text"
                variant="outlined"
              />
              <br />
              Names of any other students that supported the cyberbully’s actions{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_supporters"
                type="text"
                variant="outlined"
              />
              <br />
              Did any teacher or staff member see this incident? <br />
              <FRadioButton name="staff_witnessed" options={["Yes", "No"]} /> <br />
              If yes, who was the teacher / staff member?{" "}
              <InputField
                size="small"
                color="secondary"
                name="staff_witness"
                type="text"
                variant="outlined"
              />
              <br />
              What actions did the teacher / staff member take?{" "}
              <InputField
                size="small"
                color="secondary"
                name="staff_action"
                type="text"
                variant="outlined"
              />
              <br />
              Where did this incident occur?{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_place"
                type="text"
                variant="outlined"
              />
              <br />
              Did the cyberbully physically abuse the victim? <br />
              <FRadioButton name="physically_abused" options={["Yes", "No"]} />
              <br />
              Was the victim a handicapped student? <br />
              <FRadioButton name="victim_handicapped" options={["Yes", "No"]} /> <br />
              Was the victim a younger or smaller student than the cyberbully? <br />
              <FRadioButton name="victim_younger" options={["Yes", "No"]} /> <br />
              In complete detail provide all information you have on this threat. <br />
              <InputField
                size="small"
                color="secondary"
                name="details"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Have you witnessed this cyberbully abusing other students in the past? <br />
              <FRadioButton name="serial_bully" options={["Yes", "No"]} /> <br />
              If Yes, please provide any details of other cyberbullying incidents that you have
              witnessed or seen in the past involving this cyberbully. <br />
              <InputField
                size="small"
                color="secondary"
                name="other_incidents"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Please send me a reply email confirming that you have received this information, this
              will allow me to know that the information that I have submitted is being properly
              addressed. Thank you.
              <br />
            </Form>
          </StyledTabPanel>

          {/* other threat  */}
          <StyledTabPanel value={value} index={5}>
            <Typography variant="h4">OTHER THREAT</Typography>
            <Form
              initialValues={bullyingReportForm}
              buttonText="submit report"
              buttonSize="medium"
              submit={sendBullyingReport}
            >
              To report any OTHER THREAT complete the form below and click SUBMIT REPORT. The report
              will automatically be sent by email to the proper authorities: <br />
              Dear Sir, I have information involving a threat. I am reporting this threat through
              The Threat Alert system. <br />
              <FRadioButton
                name="trustee_or_not"
                options={[
                  "I am a trustee reporting this information for another individual who requests to not be identified; however, I will act as an intermediary so you can immediately access any additional information you need.",
                  "I am not a trustee for someone else, I am submitting this information on my own behalf."
                ]}
              />
              <br />I have uploaded an identification video in the Threat Alert System database. You
              can view this video at www.threatalert.us under my username{" "}
              <InputField
                size="small"
                color="secondary"
                name="usernmae"
                type="text"
                variant="outlined"
              />
              . <br />
              If you have any further questions or need to immediately verify this information
              please contact me and I will provide the answers for you. <br />
              Your Full Name{" "}
              <InputField
                size="small"
                color="secondary"
                name="full_name"
                type="text"
                variant="outlined"
              />
              <br />
              Your cell phone number{" "}
              <InputField
                size="small"
                color="secondary"
                name="phone"
                type="text"
                variant="outlined"
              />
              <br />
              My e-mail address{" "}
              <InputField
                size="small"
                color="secondary"
                name="email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of County{" "}
              <InputField
                size="small"
                color="secondary"
                name="country"
                type="text"
                variant="outlined"
              />
              <br />
              Is the threat against a school? <br />
              <FRadioButton name="against_school" options={["Yes", "No"]} /> <br />
              If this is a threat against a school, principal’s email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              If this is not a threat against a school, County Sheriff’s email address{" "}
              <InputField
                size="small"
                color="secondary"
                name="admin_email"
                type="text"
                variant="outlined"
              />
              <br />
              Name of person/student making this threat?{" "}
              <InputField
                size="small"
                color="secondary"
                name="bully_fullname"
                type="text"
                variant="outlined"
              />
              <br />
              Gender of person/student making this threat: <br />
              <FRadioButton name="gender" options={["Male", "Female"]} /> <br />
              When is this attack supposed to occur?{" "}
              <InputField
                size="small"
                color="secondary"
                name="incident_date"
                type="date"
                variant="outlined"
              />{" "}
              <br />
              Do any other people/students have knowledge of this threat? <br />
              <FRadioButton name="staff_witnessed" options={["Yes", "No"]} />
              <br />
              If yes, what are their names? (if more than one person, seperate their names using
              commas){" "}
              <InputField
                size="small"
                color="secondary"
                name="staff_witness"
                type="text"
                variant="outlined"
              />
              <br />
              In complete detail provide all information you have on this threat. <br />
              <InputField
                size="small"
                color="secondary"
                name="other_incidents"
                type="text"
                variant="outlined"
                isMultiline={true}
              />
              <br />
              Please send me a reply email confirming that you have received this information, this
              will allow me to know that the information that I have submitted is being properly
              addressed. Thank you.
              <br />
            </Form>
          </StyledTabPanel>
        </Box>
      )}
    </div>
  )
}

export default Reports
