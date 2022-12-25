import React, { FunctionComponent, useEffect } from "react"
import Form, { InputField } from "../components/Form"
import Loader from "react-loader-spinner"
import { Link } from "react-router-dom"
import styled from "@mui/material/styles/styled"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Axios from "axios"
import GenericModal from "../components/Modal"

interface HomeProps {}

export const FeedbackDiv = styled("div")(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.primary.main),
  backgroundColor: theme.palette.primary.main
}))

export const Video = styled("video")(({ theme }) => ({
  width: "100%"
}))

const FeedbackForm = styled("div")(({ theme }) => ({
  width: "100%",
  background: "#FDFEFB",
  padding: "7%",
  borderRadius: "5px"
}))

export const FormFieldWrapper = styled("div")(({ theme }) => ({
  marginBottom: "3%"
}))

const Home: FunctionComponent<HomeProps> = () => {
  const [loading, setLoading] = React.useState(false)
  const [response, setResponse] = React.useState({} as any)
  const [selectedPage] = React.useState("Home")
  const [messageType, setMessageType] = React.useState(
    "" as "info" | "warning" | "error" | "success" | "danger"
  )
  const [openModal, setOpenModal] = React.useState(false)
  const [modalContent, setModalContent] = React.useState("" as any)

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

  const submitForm = async (req: any) => {
    setLoading(true)
    const template = `
			<p> sender Name: ${req.name} </p>
			<p>email: ${req.email}</p>
			<p>${req.message}</p>
		`
    const data = {
      from: "info@bullyvaxx.com",
      to: "info@bullyvaxx.com",
      // from: "volumide42@gmail.com",
      // to: "volumide42@gmail.com",
      subject: "Bullying Report Request",
      text: "Bullying Report Request",
      html: template
    }
    try {
      let res = await Axios({
        method: "post",
        url: `${url + "/mailing-service/send-mail"}`,
        data: data
      })
      setModalContent(<div>Message Sent</div>)
      setMessageType("success")
      setOpenModal(true)
      setLoading(false)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  let handleModalClose = () => {
    setOpenModal(false)
  }
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

      <Box component={"div"} sx={{ width: "100%", position: "relative", minHeight: "40vh" }}>
        <img
          style={{
            display: "block",
            opacity: 0.7,
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto"
          }}
          alt="banner"
          src={"banner.jpeg"}
        />
        <div style={{ position: "absolute", zIndex: 300, top: 0 }}>
          <Typography
            variant="h3"
            style={{ textAlign: "center", fontFamily: `'Rampart One', cursive` }}
          >
            BULLYVAXX
          </Typography>
          <Box component={"span"} sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="h4" style={{ textAlign: "center" }}>
              Bullying harms a child in every way that a child can be harmed; BullyVaxx has been
              created to end this harm
              {/* Two Important Vaccines Have Been Developed; One for the Coronavirus Pandemic and One for the Bullying Epidemic */}
            </Typography>
          </Box>
        </div>
        <Box component={"span"} sx={{ display: { xs: "block", sm: "none" } }}>
          <Typography style={{ textAlign: "center" }}>
            Bullying harms a child in every way that a child can be harmed; BullyVaxx has been
            created to end this harm
            {/* Two Important Vaccines Have Been Developed; One for the Coronavirus Pandemic and One for the Bullying Epidemic */}
          </Typography>
        </Box>
      </Box>

      <Box component={"div"} sx={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "4%" }}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              color="primary"
              size="large"
              variant="outlined"
              style={{
                borderRadius: "0",
                cursor: "pointer",
                fontSize: "1.5rem",
                fontWeight: "bolder"
              }}
            >
              Report Bullying, School Shooter Threats or a Weapon in the School
              {/* REPORT BULLYING, SCHOOL SHOOTER THREATS OR A WEAPON IN THE SCHOOL submit bully report */}
            </Button>
          </Link>
        </div>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          WHY BULLYVAXX WORKS
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={2}></Grid>
          <Grid item xs={12} sm={8}>
            <Box component={"div"} sx={{ width: "100%", p: 2 }}>
              <iframe
                width="100%"
                height="500"
                src="https://www.youtube.com/embed/P4EDSU8rQHc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* <iframe
								src="https://drive.google.com/file/d/1T3cpfUytRbxGKOKjHXQe_jo_2skCXRVU/preview"
								width="100%"
								height="500"
								allow="autoplay"
							></iframe> */}
              {/* <Video controls>
								<source src="mov_bbb.mp4" type="video/mp4" />
								<source src="mov_bbb.ogg" type="video/ogg" />
								Your browser does not support HTML video.
							</Video> */}
              <Typography variant="h5">
                Is your school protected by BullyVaxx? Click <Link to="/sponsors/create">HERE</Link>{" "}
                to see
              </Typography>
            </Box>
            <div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
          </Grid>
          <Grid item sm={2}></Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100%", background: "#FDFEFB" }}>
        <svg style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 318">
          <path
            fill="#f44336"
            fillOpacity="1"
            d="M0,160L48,154.7C96,149,192,139,288,160C384,181,480,235,576,229.3C672,224,768,160,864,154.7C960,149,1056,203,1152,229.3C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <FeedbackDiv>
          <Typography variant="h3" style={{ textAlign: "center" }}>
            Send us your feedback
          </Typography>
          {/* <Typography variant="h4" style={{ textAlign: 'center' }}>See what people say about us</Typography> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}></Grid>
            <Grid item xs={12} sm={4}>
              <Box component={"div"} sx={{ width: "100%", p: 1 }}>
                <FeedbackForm>
                  <Form
                    initialValues={{}}
                    buttonText="submit"
                    buttonSize="medium"
                    submit={submitForm}
                  >
                    <FormFieldWrapper>
                      <InputField
                        size="small"
                        color="secondary"
                        fullWidth={true}
                        name="name"
                        type="text"
                        variant="outlined"
                        label="Full Name"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper>
                      <InputField
                        size="small"
                        color="secondary"
                        fullWidth={true}
                        name="email"
                        type="email"
                        variant="outlined"
                        label="Email"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper>
                      <InputField
                        size="small"
                        isMultiline={true}
                        color="secondary"
                        fullWidth={true}
                        name="message"
                        type="text"
                        variant="outlined"
                        label="Message"
                      />
                    </FormFieldWrapper>
                  </Form>
                </FeedbackForm>
              </Box>
            </Grid>
          </Grid>
        </FeedbackDiv>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 319">
          <path
            fill="#f44336"
            fillOpacity="1"
            d="M0,128L48,122.7C96,117,192,107,288,101.3C384,96,480,96,576,117.3C672,139,768,181,864,208C960,235,1056,245,1152,213.3C1248,181,1344,107,1392,69.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </Box>
    </div>
  )
}

export default Home
