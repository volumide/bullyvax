import React, { FunctionComponent, useEffect } from "react"
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

interface MessageToMomsProps {}

const MessageToMoms: FunctionComponent<MessageToMomsProps> = () => {
  const [response, setResponse] = React.useState({} as any)
  const [loading, setLoading] = React.useState(false)
  const [selectedPage] = React.useState("Message to Moms")

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

  useEffect(() => {
    let abortController = new AbortController()
    fetchContent({ page: selectedPage, tab: "" })
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
          <Grid item xs={12} sm={8}>
            <Box component={"div"} sx={{ width: "100%", p: 2 }}>
              <iframe
                width="100%"
                height="480"
                src="https://www.youtube.com/embed/1aNFeo3VDFI"
                title="Message To Mom"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* <iframe
								src="https://drive.google.com/file/d/1LfJFqqnTCKfn3tWMLgFqsCG--7WV0iYW/preview"
								width="100%"
								height="480"
								allow="autoplay"
							></iframe> */}
            </Box>
            <div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
          </Grid>
          <Grid item sm={2}></Grid>
        </Grid>
      </Box>
      {/* <div></div>
			<div dangerouslySetInnerHTML={{ __html: response?.content }}></div> */}
    </div>
  )
}

export default MessageToMoms
