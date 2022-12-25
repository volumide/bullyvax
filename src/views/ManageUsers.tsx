/* eslint-disable @typescript-eslint/no-unused-vars */
import { GridColDef } from "@mui/x-data-grid"
import React, { FunctionComponent, useEffect } from "react"
import DataTable from "../components/DataTable"
import Axios from "axios"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import { FormControl, InputLabel } from "@mui/material"
import Form, { InputField } from "../components/Form"
import { FormFieldWrapper } from "./Home"

interface ManageUsersProps {}

const ManageUsers: FunctionComponent<ManageUsersProps> = () => {
  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [response, setResponse] = React.useState({} as any)
  const [edit, setEdit] = React.useState({} as any)
  const [open, setOpen] = React.useState(false)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const handleOpen = (params: any) => {
    setEdit(params)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const renderDetailsButton = (params: any) => {
    return (
      <>
        <button type="submit" onClick={() => handleOpen(params.row)}>
          Update
        </button>
        <button
          type="submit"
          onClick={() => {
            console.log()
            deleteUSer(params.row.user_id)
          }}
        >
          Delete
        </button>
      </>
    )
  }

  let columns: GridColDef[] = [
    {
      field: "username",
      headerName: "Name",
      flex: 1
    },
    {
      field: "permission",
      headerName: "Permission",
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1
    },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: renderDetailsButton
    }
  ]

  let url: string
  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
  }

  const deleteUSer = async (id: string) => {
    try {
      const res = await Axios({
        method: "delete",
        url: `${url}/users/delete-user/${id}`
      })
      console.log(res)
      await fetchUsers()
    } catch (error) {
      console.log(error)
    }
  }

  let fetchUsers = async () => {
    setLoading(true)
    try {
      let res = await Axios({
        method: "get",
        url: `${url + "/users/fetch"}`,
        headers: {
          "Authorization": "Bearer" + localStorage.getItem("app_id")
        }
      })

      console.log("res.data", res.data, response, loading)

      setResponse(res.data)
      setRows(res.data)

      setLoading(false)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
    }
  }

  const submitDetails = async (reqBody: any) => {
    try {
      let res = await Axios({
        method: "put",
        url: `${url + "/users/update-user"}`,
        data: reqBody
      })
      console.log(res)
      fetchUsers()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let abortController = new AbortController()
    fetchUsers()
    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{ width: "100%", marginTop: "10%", padding: "2%" }}>
      <DataTable
        defaultSortColumn="last_name"
        rowId="user_id"
        columns={columns}
        rows={rows}
      ></DataTable>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Form
            // initialValues={{ username: "", email: "", first_name: "", last_name: "", dob: "", gender: "", state: "", country: "" }}
            initialValues={edit}
            buttonText="Update"
            buttonSize="medium"
            submit={submitDetails}
          >
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="username"
                type="text"
                variant="outlined"
                label="Username"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="email"
                type="text"
                variant="outlined"
                label="Email"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="first_name"
                type="text"
                variant="outlined"
                label="First Name"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="last_name"
                type="text"
                variant="outlined"
                label="Last Name"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="dob"
                type="text"
                variant="outlined"
                label="Date Of Birth"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="gender"
                type="text"
                variant="outlined"
                label="Gender"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="state"
                type="text"
                variant="outlined"
                label="State"
              />
            </FormFieldWrapper>
            <FormFieldWrapper>
              <InputField
                size="small"
                color="secondary"
                fullWidth={true}
                name="county"
                type="text"
                variant="outlined"
                label="Country"
              />
            </FormFieldWrapper>
          </Form>
          {/* <InputField size="small" color="secondary" fullWidth={true} name="username" type="text" variant="outlined" label="Username" /> */}
        </Box>
      </Modal>
    </div>
  )
}

export default ManageUsers
