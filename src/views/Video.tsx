/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useEffect, useState } from "react"
import Axios from "axios"
import Form, { InputField } from "../components/Form"
import Loader from "react-loader-spinner"
import { Link } from "react-router-dom"
import styled from "@mui/material/styles/styled"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import { TextField } from "@mui/material"
import { letterSpacing } from "@mui/system"

interface VideoProps {}

const Video: FunctionComponent<VideoProps> = () => {
  const [response, setResponse] = React.useState({} as any)
  const [loading, setLoading] = React.useState(false)
  const [video, setVideo] = React.useState([])
  const [user, setUsers] = React.useState([])
  const [selectedPage] = React.useState("Message to Moms")
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState([])
  const [filteredV, setFiltered] = useState([])

  let url: string

  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
  }

  let fetchContent = async (q: { page?: string; tab?: string }) => {
    setLoading(true)
    try {
      let res = await Axios({
        method: "get",
        url: `${url + "/content"}?page=${q.page}&tab=${q.tab}`
      })

      console.log("res.data", res.data, response, loading)

      setResponse(res.data)

      setLoading(false)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
    }
  }

  const getVideos = async () => {
    try {
      let res = await Axios({
        method: "get",
        url: `${url + "/file-upload/fetch"}`
      })

      console.log("res.data", res.data, response, loading)

      setVideo(res.data)

      setLoading(false)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
    }
  }

  const getUsers = async () => {
    try {
      let res = await Axios({
        method: "get",
        url: `${url + "/users/fetch"}`
      })

      console.log("res.data", res.data, response, loading)

      setUsers(res.data)
      setFilter(res.data)

      setLoading(false)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    let j: any = user.filter((e: any) => e.username.toLowerCase() === value.toLowerCase())
    setFilter(j || user)
  }

  const filterVideo = (value: any) => {
    const g = video.filter((e: any) => e.user_id === value)
    setFiltered(g)
    console.log(g)
  }

  useEffect(() => {
    let abortController = new AbortController()
    fetchContent({ page: selectedPage, tab: "" })
    getVideos()
    getUsers()
    // getEffectiveTypeParameterDeclarations
    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line
  }, [selectedPage])

  return (
    <div style={{ width: "100%" }}>
      <Box component={"div"} sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item sm={2}></Grid>
          <Grid item xs={12} sm={7}>
            <Box component={"div"} sx={{ width: "100%", p: 2 }}>
              <TextField
                InputProps={{
                  type: "text",
                  placeholder: "Reporter",
                  onChange: (e: any) => {
                    setSearch(e.target.value)
                    console.log(e.target.value)
                  },
                  // placeholder: "School Name and Zip Code…",
                  size: "small"
                }}
              />
              <Button variant="contained" type="button" onClick={() => handleSearch(search)}>
                Search Video
              </Button>
            </Box>
            <Box component={"div"} sx={{ width: "100%", p: 2 }}>
              {/* <p className="" role="button" onClick={() => console.log()}> */}
              {filter.length
                ? filter.map((e: any) => (
                    <div onClick={() => filterVideo(e.user_id)} role="button">
                      {e.username}
                    </div>
                  ))
                : ""}
              {/* </p> */}
            </Box>
            <div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
          </Grid>
          <Grid item sm={3}>
            {filteredV.map((e: any) => (
              <>
                <video width="320" height="240" controls>
                  <source src={url + "/file-upload/image/" + e.filename} type={e.mimetype} />
                </video>
              </>
            ))}
          </Grid>
        </Grid>
      </Box>
      {/* <div></div>
			<div dangerouslySetInnerHTML={{ __html: response?.content }}></div> */}
    </div>
  )
}

export default Video
