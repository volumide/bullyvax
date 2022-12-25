import { GridColDef } from "@mui/x-data-grid"
import Axios from "axios"
import React, { FunctionComponent, useEffect } from "react"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import { FormFieldWrapper } from "./Home"
import TextField from "@mui/material/TextField"

import DataTable from "../components/DataTable"
interface ManageReportsProps {}

const ManageReports: FunctionComponent<ManageReportsProps> = () => {
  const [rows, setRows] = React.useState([])
  const [result, setResult] = React.useState({} as any)
  const [edit, setEdit] = React.useState({} as any)
  const [open, setOpen] = React.useState(false)
  const [wordSearched, setWordSearched] = React.useState([])
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
  const renderDetailsButton = (params: any) => {
    return (
      <>
        <button type="submit" onClick={() => handleOpen(params.row)}>
          View Report
        </button>
      </>
    )
  }

  let columns: GridColDef[] = [
    {
      field: "school_name",
      headerName: "School",
      flex: 1
    },
    {
      field: "zip_code",
      headerName: "Zip Code",
      flex: 1
    },

    {
      field: "bully_fullname",
      headerName: "Name",
      flex: 1
    },
    {
      field: "bully_grade",
      headerName: "Grade",
      flex: 1
    },
    {
      field: "report_type",
      headerName: "Report Type",
      flex: 1
    },

    {
      field: "gender",
      headerName: "Bully Gender",
      flex: 1
    },

    {
      field: "bully_teacher",
      headerName: "Bully Teacher",
      flex: 1
    },

    {
      field: "createdAt",
      headerName: "Date",
      flex: 1
    },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: renderDetailsButton
    }

    // {
    // 	field: "",
    // 	headerName: "Action",
    // 	flex: 1,
    // 	sortable: false,
    // },
  ]

  const handleOpen = (params: any) => {
    console.log(params)
    setResult(params)
    // setEdit(params);
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  let url: string
  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
  }

  let fetchUsers = async () => {
    // setLoading(true);
    try {
      let { data } = await Axios({
        method: "get",
        url: `${url + "/users/report"}`,
        headers: {
          "Authorization": "Bearer" + localStorage.getItem("app_id")
        }
      })

      // console.log("res.data", res.data, response, loading);

      // setResponse(data);
      setRows(data)
      console.log(data)

      // setLoading(false);
    } catch (error: any) {
      console.log(error.response)
      // setResponse(error.response);
      // setLoading(false);
    }
  }

  const findMatches = (wordToMatch: string, reports: any[]) => {
    const f = reports.filter((v) => {
      const regex = new RegExp(wordToMatch, "gi")
      return (
        v.full_name.match(regex) || v.school_name.match(regex) || v.incident_place.match(regex)
        // || v.zip_code.match(regex) || v.zip_code.match(regex)
      )
    })
    // console.log(f);
    return f
  }

  const displayMatches = (word: string) => {
    const matchArray: any = findMatches(word, rows)
    setWordSearched(matchArray)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div style={{ width: "100%", marginTop: "10%", padding: "2%" }}>
      {/* <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <Loader
                type="Puff"
                color="#f44336"
                height={100}
                width={100}
                visible={loading}
            />
        </Backdrop> */}

      {/* <FormFieldWrapper>
				<InputField
					size="small"
					color="secondary"
					fullWidth={true}
					name=""
					type="text"
					variant="outlined"
					label="Search"
				/>
			</FormFieldWrapper> */}
      <FormFieldWrapper>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          fullWidth={true}
          onChange={(e) => displayMatches(e.target.value)}
        />
      </FormFieldWrapper>
      <DataTable
        defaultSortColumn="expiry"
        rowId={"report_id"}
        columns={columns}
        rows={wordSearched.length > 0 ? wordSearched : rows}
      ></DataTable>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {result && (
          <Box sx={style}>
            {result.report_type === "bully" && (
              <>
                I have information involving bullying in your school. I am reporting this
                information through The BullyVaxx system. If you are not familiar with The BullyVaxx
                system please go to www.bullyvaxx.com for details. Once you are on the site if you
                will click on the School Administrator tab at the top of the Home page complete
                instructions for BullyVaxx will be provided for you. At the bottom of this page is a
                link where you can review my identification video. Thank you
                <br />
                {result.trustee_or_not}
                <br />
                If you have any further questions or need to immediately verify this information
                please contact me and I will provide the answers for you. <br />
                My name is {result.full_name}
                <br />
                My phone number {result.phone}
                <br />
                My e-mail address {result.email}
                <br />
                Name of School {result.school_name}
                <br />
                Principal’s email address {result.admin_email}
                <br />
                What is the first initial in the bully’s first name {result.bully_finitial}
                <br />
                What is the bully’s last name {result.bully_lname}
                <br />
                Full name of bully {result.bully_fullname}
                <br />
                Gender of bully: {result.gender}
                <br />
                Grade of bully. {result.bully_grade}
                <br />
                Homeroom Teacher of bully {result.bully_teacher}
                <br />
                Date of incident {result.incident_date}
                <br />
                Time of incident {result.incident_time}
                <br />
                If more than one bully add their names here {result.more_bullies}
                <br />
                Names of any other students that supported the bully’s actions{" "}
                {result.other_incidents}
                <br />
                Did any teacher or staff member see this incident? {result.staff_witnessed}
                <br />
                If yes, who was the teacher / staff member? {result.staff_witness}
                <br />
                What actions did the teacher / staff member take? {result.staff_action}
                <br />
                Where did this incident occur? {result.incident_place}
                <br />
                Did the bully physically abuse the victim? {result.physically_abused}
                <br />
                Was the victim a handicapped student? {result.victim_handicapped}
                <br />
                Was the victim a younger or smaller student than the bully? {result.victim_younger}
                <br />
                In complete detail provide all information you have on this threat. {result.details}
                <br />
                Have you witnessed this bully abusing other students in the past?{" "}
                {result.serial_bully}
                <br />
                If Yes, please provide any details of other bullying incidents that you have
                witnessed or seen in the past involving this bully. {result.other_incidents}
                <br />
                Please send me a reply email confirming that you have received this information,
                this will allow me to know that the information that I have submitted is being
                properly addressed. Thank you.
                <br />
              </>
            )}

            {result.report_type === "weapon in school" && (
              <>
                I have information concernating a threat against your school. I am reporting this
                information through The BullyVaxx system. If you are not familiar with The BullyVaxx
                system please go to www.bullyvaxx.com for details. Once you are on the site if you
                will click on the School Administrator tab at the top of the Home page complete
                instructions for BullyVaxx will be provided for you. At the bottom of this page is a
                link where you can review my identification video. Thank you
                <br />
                {result.trustee_or_not}
                <br />
                If you have any further questions or need to immediately verify this information
                please contact me and I will provide the answers for you. <br />
                My Full Name {result.full_name}
                <br />
                My cell phone number {result.phone}
                <br />
                My e-mail address {result.email}
                <br />
                Name of School {result.school_name}
                <br />
                zip of School {result.zip_code}
                <br />
                Principal’s email address {result.admin_email}
                <br />
                Full name of student/person bringing weapon to school {result.bully_fullname}
                <br />
                Gender of student/person bringing weapon to school: {result.gender}
                <br />
                Grade of student/person bringing weapon to school: {result.bully_grade}
                <br />
                If a student is bringing weapon to school, homeroom Teacher of student making threat{" "}
                <br />
                Date you learned about the weapon at school {result.incident_date}
                <br />
                Time you learned about threat {result.incident_time}
                <br />
                Names of any other students who may be aware of this weapon {result.other_incidents}
                <br />
                In complete detail provide all information you have on this threat{" "}
                {result.other_incidents}
                <br />
                Dear Principal, please send me a reply email confirming that you have received this
                information, this will allow me to know that the information that I have submitted
                is being properly addressed. Thank you. <br />
              </>
            )}
            {(result.report_type === "others" || result.report_type === "") && (
              <>
                Dear Principal, <br />
                I have information concernating a threat against your school. I am reporting this
                information through The BullyVaxx system. If you are not familiar with The BullyVaxx
                system please go to www.bullyvaxx.com for details. Once you are on the site if you
                will click on the School Administrator tab at the top of the Home page complete
                instructions for BullyVaxx will be provided for you. At the bottom of this page is a
                link where you can review my identification video. Thank you
                <br />
                {result.trustee_or_not}
                <br />
                My BullyVaxx {result.username}
                <br />
                My Full Name {result.full_name}
                <br />
                My cell phone number {result.phone}
                <br />
                My e-mail address {result.email}
                <br />
                Name of School {result.school_name}
                <br />
                zip of School {result.zip_code}
                <br />
                Principal’s email address {result.admin_email}
                <br />
                Full name of student/person making threat {result.bully_fullname}
                <br />
                Gender of student/person making threat : {result.gender}
                <br />
                Grade of student/person making threat . {result.bully_grade}
                <br />
                Homeroom Teacher of bully {result.bully_teacher}
                <br />
                Date of incident {result.incident_date}
                <br />
                Time of incident {result.incident_time}
                <br />
                Names of any other students that supported the bully’s actions{" "}
                {result.other_incidents}
                <br />
                In complete detail provide all information you have on this threat{" "}
                {result.other_incidents}
                <br />
                Dear Principal, please send me a reply email confirming that you have received this
                information, this will allow me to know that the information that I have submitted
                is being properly addressed. Thank you. <br />
              </>
            )}

            {result.report_type === "school threat" && (
              <>
                Dear Principal, <br />
                I have information concernating a threat against your school. I am reporting this
                information through The BullyVaxx system. If you are not familiar with The BullyVaxx
                system please go to www.bullyvaxx.com for details. Once you are on the site if you
                will click on the School Administrator tab at the top of the Home page complete
                instructions for BullyVaxx will be provided for you. At the bottom of this page is a
                link where you can review my identification video. Thank you
                <br />
                {result.trustee_or_not}
                <br />
                My BullyVaxx {result.username}
                <br />
                My Full Name {result.full_name}
                <br />
                My cell phone number {result.phone}
                <br />
                My e-mail address {result.email}
                <br />
                Name of School {result.school_name}
                <br />
                zip of School {result.zip_code}
                <br />
                Principal’s email address ${result.admin_email}
                <br />
                Full name of student/person making threat ${result.bully_fullname}
                <br />
                Gender of student/person making threat : ${result.gender}
                <br />
                Grade of student/person making threat . ${result.bully_grade}
                <br />
                Homeroom Teacher of bully ${result.bully_teacher}
                <br />
                Date of incident ${result.incident_date}
                <br />
                Time of incident ${result.incident_time}
                <br />
                Names of any other students that supported the bully’s actions $
                {result.other_incidents}
                <br />
                In complete detail provide all information you have on this threat $
                {result.other_incidents}
                <br />
                Dear Principal, please send me a reply email confirming that you have received this
                information, this will allow me to know that the information that I have submitted
                is being properly addressed. Thank you. <br />
              </>
            )}
            <a href="${link}" target="_blank">
              {" "}
              Click here to review video{" "}
            </a>
          </Box>
        )}
      </Modal>
    </div>
  )
}

export default ManageReports
