/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/system"
import React, { FunctionComponent, useEffect, useState } from "react"
import Form, { FRadioButton, InputField, SelectOption } from "../components/Form"
import { FormFieldWrapper } from "./Home"
import Axios from "axios"
import { PayPalButton } from "react-paypal-button-v2"
import SearchIcon from "@mui/icons-material/Search"
import GenericModal from "../components/Modal"
import { Link, useParams } from "react-router-dom"
import AddIcon from "@mui/icons-material/Add"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import Button from "@mui/material/Button"
import Backdrop from "@mui/material/Backdrop"
import Loader from "react-loader-spinner"
// import Box from '@mui/material/Box';
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import StripeCheckout from "react-stripe-checkout"
interface SponsorsProps {}

interface SchoolInfo {
  name: string
  zip_code: string
}

const Sponsors: FunctionComponent<SponsorsProps> = () => {
  const [states, setStates] = React.useState([] as SelectOption[])
  // const [counties, setCounties] = React.useState([] as SelectOption[]);
  const [loading, setLoading] = React.useState(false)
  const [existing, setExisting] = React.useState([] as any)
  const [sponsorsOverflow, setSponsorsOverflow] = React.useState([] as any)
  // const [selectedState, setSelectedState] = React.useState('');
  const [response, setResponse] = React.useState({} as any)
  const [selectedPage] = React.useState("Sponsors")
  const [canCheckout, setCanCheckout] = React.useState(false)
  const [sponsorType, setSponsorType] = React.useState("Individual")
  const [userDetails, setUserDetails] = React.useState({} as any)
  const [sponsorshipPrice] = React.useState(84)
  const [openModal, setOpenModal] = React.useState(false)
  const [schoolsArray, setSchoolsArray] = React.useState([] as SchoolInfo[])
  const params = useParams()
  const [successMessage, setSuccessMessage] = React.useState("")
  const [formSchema, setFormSchema] = React.useState({
    type: "Individual",
    entity_name: "",
    first_name: "",
    last_name: "",
    state: "",
    county: "",
    email: "",
    username: "",
    quantity: schoolsArray.length,
    schoolsArray
  })
  const [modalContent, setModalContent] = React.useState("" as any)
  const [messageType, setMessageType] = React.useState(
    "" as "info" | "warning" | "error" | "success" | "danger"
  )
  const [searchTerm, setSearchTerm] = React.useState("")
  const [searchCode, setSearchCode] = React.useState("")
  const [schools, setSchools] = React.useState([])
  const [businesses, setBusinesses] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [schoolCount, setSchoolCount] = React.useState(0)
  const [waitting, setWaiting] = React.useState(false)
  const businessOptions = [
    "real estate agent",
    "auto dealerships new",
    "auto dealerships used",
    "restaurant",
    "church youth group",
    "insurance agent",
    "auto repair businesses",
    "auto body shops",
    "school supply businessess",
    "music stores",
    "hardware stores",
    "food stores",
    "others"
  ]

  let statesUrl =
    "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:*&key=8ea19e5ad6a8d3f6f527ef60f677f2e6586178f1"
  let url: string

  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
  }

  let handleSponsorTypeSelection = (selected: string) => {
    setSponsorType(selected)
  }

  let getStates = async () => {
    setLoading(true)
    try {
      let res = await Axios({
        method: "get",
        url: `${statesUrl}`
      })

      console.log("res.data", res.data, states, loading)

      setStates(
        res.data.map((stateInfo: any[], index: number): SelectOption => {
          let state = {
            label: stateInfo[1],
            value: stateInfo[2]
          }

          if (index === 0) {
            state.label = "Choose your State"
            state.value = ""
          }

          return state
        })
      )

      setLoading(false)
    } catch (error: any) {
      console.log(error.response)
      setStates([])
      setLoading(false)
    }
  }

  const handleChange = (event: any) => {
    setDescription(event.target.value)
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

  let createUser = async (reqBody: any) => {
    // return;
    let schoolArr: any[] = []
    const allKeys = Object.keys(reqBody)
    let count = 0
    allKeys.forEach((i) => {
      if (i.includes("_") && i.startsWith("school")) count += 1
    })

    count = count / 2
    let currentNum = 0

    for (let index = 1; index <= count; index++) {
      currentNum += 1
      schoolArr.push({
        name: reqBody[`school${currentNum}_name`],
        zip_code: reqBody[`school${currentNum}_zip_code`]
      })
    }

    const userInfo = {
      "first_name": reqBody.first_name.trim(),
      "last_name": reqBody.last_name.trim(),
      "entity_name": reqBody.entity_name.trim(),
      "description": sponsorType === "Individual" ? "Individual" : description.trim(),
      "email": reqBody.email.trim(),
      "quantity": schoolArr.length,
      "username": "",
      "role": "SPONSOR"
    }

    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (
      (reqBody.email && !reqBody.email.match(regexEmail)) ||
      (reqBody.adminemail && !reqBody.adminemail.match(regexEmail))
    ) {
      setModalContent(<div>Invalid email</div>)
      setMessageType("warning")
      setOpenModal(true)
      setLoading(false)
      return
    }
    setModalContent("")

    let finalPass: any[] = []
    schoolArr.forEach((v) => {
      if (v.name) finalPass.push(v)
    })

    schoolArr = finalPass
    setSchoolCount(+userInfo.quantity)
    const sponsorForm = {
      "userInfo": userInfo,
      "form": {
        "schoolsArray": schoolArr
      }
    }

    if (!schoolArr.length) {
      console.log("You have not sponsore any school")
      return
    }

    const exist: any[] = []
    // get if school exist
    try {
      setLoading(true)
      const { data: res } = await Axios({
        method: "post",
        url: `${url + "/sponsorships/get/" + sponsorForm.userInfo.description}`,
        data: sponsorForm
      })

      if (res) {
        res.forEach((result: any) => {
          if (result?.message || result?.sponsors) {
            const individialCheck =
              result && result?.message ? result.message.split(" ").pop().toUpperCase() : ""
            if (individialCheck && individialCheck.toLowerCase() !== "individual")
              exist.push(result)
          }
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

    if (exist.length > 0) {
      let sponsorOverlow: any[] = []
      setExisting(exist)
      exist.forEach((all) => {
        if (all.sponsors.length >= 4) {
          sponsorOverlow.push(
            `${all?.sponsors[0].school_name.toUpperCase()} reached maximum number of sponsors ${
              all?.sponsors.length
            }`
          )
        }
      })
      setSponsorsOverflow(sponsorOverlow)
    } else {
      localStorage.setItem("sponsoredSchool", JSON.stringify(sponsorForm))
      setCanCheckout(true)
      // const price = { "price": schoolArr };
      // console.log(price);
      // try {
      // 	setLoading(true);
      // 	console.log(reqBody);
      // 	let res = await Axios({
      // 		method: "post",
      // 		url: `${url + "/users/create/user/payment"}`,
      // 		// url: `${url + "/sponsorships"}`,
      // 		data: price,
      // 	});
      // 	console.log(res);
      // 	window.open(res.data.url, "_blank");
      // } catch (error: any) {
      // 	console.log(error.response);
      // 	setResponse(error.response);
      // 	setMessageType("error");
      // } finally {
      // 	setLoading(false);
      // }
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

  const createOnLoad = async () => {
    let getId: any = params
    if (getId.id === "success") {
      const data: any = localStorage.getItem("sponsoredSchool")
      const retData: any = JSON.parse(data)
      try {
        let res = await Axios({
          method: "post",
          url: `${url + "/sponsorships"}`,
          data: retData
        })
        console.log(res)
        let message = ""
        retData.form.schoolsArray.forEach((v: any) => {
          message += v.name + ","
        })

        setSuccessMessage("Thanks for successful sponsor of " + message + "school")
        localStorage.removeItem("sponsoredSchool")
      } catch (error) {
        console.log(error)
      }
    }
    if (getId.id === "cancel") {
      setSuccessMessage("Sponsor not successful ")
      console.log("unsuccessful payment")
    }
  }

  let handleSeachK = async () => {
    setLoading(true)
    try {
      if (!searchCode || !searchTerm) {
        setModalContent(<div>School name or zip code is empty</div>)
        setMessageType("info")
        setLoading(false)
        setOpenModal(true)
        return
      }
      let res = await Axios({
        method: "get",
        url: `${url + "/sponsorships"}?zip_name=${searchTerm}&&zip_code=${searchCode}`
      })

      const busiType: any[] = []
      console.log("res.data", res.data, loading)
      res.data.forEach((e: any) => {
        if (e) busiType.push(e.description)
      })

      // busiType.push("male");
      const fields: any = new Set(busiType)
      let businesses: string = " "
      console.log(fields.size)

      for (let item of fields) {
        businesses += item + ", "
      }

      setBusinesses(businesses)
      setResponse(res.data)
      setLoading(false)
      // if (res.data[0] === null) {
      // 	res.data.shift();
      // }
      if (res.data?.length === 0) {
        setModalContent(
          <div>
            Your school is currently not protected by BullyVaxx. All that is needed for your school
            to become protected is a individual or business to step up and become the sponsor for
            the school. Real estate agents, new and used auto dealerships, personal injury
            attorneys, restaurants and church youth groups all make great sponsors for BullyVaxx.
            Please contact any of these businesses/groups that you are connected to and get your
            school protected. To sponsor a school please click <Link to="/sponsors">HERE</Link>.
          </div>
        )
      } else {
        setModalContent(
          <div>
            Yes, your school is protected by BullyVaxx,sponsored by businesses in ({businesses}) to
            file a bully or threat report please click <Link to="/login">HERE</Link>.
          </div>
        )
      }

      setMessageType("info")
      setOpenModal(true)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
    }
  }

  let handleModalClose = () => {
    setOpenModal(false)
  }

  let handleAddSchool = () => {
    let nextSchool = schoolsArray.length + 1
    let updatedSchools: SchoolInfo[] = [
      ...schoolsArray,
      { name: `school${nextSchool}_name`, zip_code: `school${nextSchool}_zip_code` }
    ]
    let updatedFormSchema = {
      ...formSchema,
      [`school${nextSchool}_name`]: "",
      [`school${nextSchool}_zip_code`]: ""
    }
    setFormSchema(updatedFormSchema)
    setSchoolsArray(updatedSchools)
    console.log("updatedFormSchema", updatedFormSchema)
  }

  let handleSearchInput = (e: any) => {
    setSearchTerm(e?.target?.value)
  }

  async function handleToken(token: any) {
    console.log(token)
    const quantity: number = +schoolCount
    const price: number = 6500
    const response = await Axios.post(`${url}/users/stripe/payment`, { token, quantity, price })
    setWaiting(true)
    const { status } = response.data
    if (status === "succeeded") {
      const data: any = localStorage.getItem("sponsoredSchool")
      const retData: any = JSON.parse(data)
      try {
        let res = await Axios({
          method: "post",
          url: `${url + "/sponsorships"}`,
          data: retData
        })
        console.log(res)
        let message = ""
        retData.form.schoolsArray.forEach((v: any) => {
          message += v.name + ","
        })
        setCanCheckout(false)
        setSuccessMessage("Thanks for successful sponsor of " + message + "school")
        setTimeout(() => {
          setSuccessMessage("")
        }, 5000)
        localStorage.removeItem("sponsoredSchool")
      } catch (error) {
        setSuccessMessage("Unable to create sponsorship")
        console.log(error)
      } finally {
        setWaiting(false)
      }
      // console.log(response, 'success');
    } else {
      console.log(response.data, "error")
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          <Box sx={{ marginTop: "4%", padding: "2%" }}>
            <Grid container spacing={2}>
              <Grid item sm={3}>
                {successMessage}
              </Grid>
              <Grid item sm={6} xs={12}>
                <iframe
                  width="100%"
                  height="480"
                  src="https://www.youtube.com/embed/JCNqMMXObrk"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {/* <iframe
									style={{ marginBottom: "20px" }}
									src="https://drive.google.com/file/d/10vGiNyn4V1FtiroeBwtVP2sq2OCIIVEv/preview"
									width="100%"
									height="480"
									allow="autoplay"
								></iframe> */}
                <Typography style={{ textAlign: "center" }} variant="h5">
                  {/* Confirm school sponsorship */}
                  Is your schoolprotected by BullyVaxx? Use the query below to see.
                </Typography>
                <>
                  <TextField
                    {...params}
                    InputProps={{
                      // ...params.InputProps,
                      type: "text",
                      placeholder: "School Name",
                      // placeholder: "School Name and Zip Code…",
                      size: "small",
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      color: "secondary"
                      // onKeyUp: (e) => handleSearch(e),
                    }}
                    onChange={(e) => handleSearchInput(e)}
                  />
                  <TextField
                    {...params}
                    InputProps={{
                      // ...params.InputProps,
                      type: "text",
                      placeholder: "School Zip Code",
                      size: "small",
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      color: "secondary"
                      // onKeyUp: (e) => handleSearch(e),
                    }}
                    onChange={(e) => setSearchCode(e.target.value)}
                    // onChange={(e) => handleSearchInput(e)}
                  />
                  <div style={{ marginTop: "10px" }}>
                    <Button variant="contained" onClick={() => handleSeachK()}>
                      Confirm
                    </Button>
                  </div>
                </>
                {/* <Autocomplete
									freeSolo
									id="free-solo-2-demo"
									disableClearable
									options={[].map((option: any) => option.title)}
									renderInput={(params: any) => (
									
									)}
								/> */}
                {openModal && (
                  <GenericModal messageType={messageType} handleClose={handleModalClose}>
                    {modalContent}
                  </GenericModal>
                )}
              </Grid>
              <Grid item sm={3}></Grid>
            </Grid>
            <div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
          </Box>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Box sx={{ marginTop: "4%", padding: "2%" }}>
            <Typography variant="h4">Become a sponsor</Typography>

            {!canCheckout && (
              <Form
                initialValues={formSchema}
                buttonText="checkout"
                buttonSize="medium"
                submit={createUser}
              >
                <FormFieldWrapper>
                  Sponsor type: <br />
                  <FRadioButton
                    selectionChange={handleSponsorTypeSelection}
                    name="type"
                    options={["Individual", "Business or Group"]}
                  />
                </FormFieldWrapper>
                {sponsorType === "Individual" && (
                  <div>
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
                  </div>
                )}
                {sponsorType === "Business or Group" && (
                  <>
                    <FormFieldWrapper>
                      <InputField
                        size="small"
                        color="secondary"
                        fullWidth={true}
                        name="entity_name"
                        type="text"
                        variant="outlined"
                        label="Name of business or group"
                      />
                    </FormFieldWrapper>
                    {/* <FormFieldWrapper>
											<InputField
												size="small"
												color="secondary"
												fullWidth={true}
												name="description"
												type="text"
												variant="outlined"
												label="Business Type"
											/>
										</FormFieldWrapper> */}
                    <FormFieldWrapper>
                      <FormControl fullWidth>
                        <InputLabel id="description">Business Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={description}
                          label="Age"
                          onChange={handleChange}
                        >
                          {businessOptions &&
                            businessOptions.map((bus) => (
                              <MenuItem value={bus} style={{ textTransform: "capitalize" }}>
                                {bus}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </FormFieldWrapper>
                  </>
                )}
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

                {schoolsArray.map((school, index) => (
                  <div key={index}>
                    <FormFieldWrapper>
                      <InputField
                        size="small"
                        color="secondary"
                        fullWidth={true}
                        name={school?.name}
                        variant="outlined"
                        label={`Name of School #${index + 1}`}
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper>
                      <InputField
                        size="small"
                        color="secondary"
                        fullWidth={true}
                        name={school?.zip_code}
                        variant="outlined"
                        label={`Zip Code of School #${index + 1}`}
                      />
                    </FormFieldWrapper>
                  </div>
                ))}
                <div style={{ marginBottom: "2%", marginTop: "2%" }}>
                  <Button onClick={handleAddSchool} variant="contained" endIcon={<AddIcon />}>
                    ADD SCHOOL
                  </Button>
                </div>
              </Form>
            )}

            {canCheckout && (
              <>
                <StripeCheckout
                  stripeKey="pk_test_51KOluiEvT7coUybkV5V9bsEwzMG1GStiV16pTbXwRj0BIuWtNoIcE2PVF0ImnIfVCxV7h7d8IIHcd7d8CmnWqWtu00yMhvuQJZ"
                  token={handleToken}
                  amount={6900 * schoolCount}
                  name="School Payment"
                />
                {waitting && <p>Please wait while we confirm payment</p>}
              </>
            )}

            {existing.length > 0 ? (
              <div
                className="border rounded p-2"
                style={{ border: "1px solid grey", borderRadius: "2px", padding: "5px" }}
              >
                {existing.map((v: any, i: any) => (
                  <>
                    <p key={i}>{v?.message}</p>
                  </>
                ))}
              </div>
            ) : (
              ""
            )}
            {sponsorsOverflow.length > 0 && (
              <div
                className="border rounded p-2"
                style={{
                  border: "1px solid grey",
                  borderRadius: "2px",
                  padding: "5px",
                  marginTop: "10px"
                }}
              >
                {sponsorsOverflow.map((v: string, i: any) => (
                  <p key={i}>{v} </p>
                ))}
              </div>
            )}

            <div>
              <p>
                BullyVaxx sponsors elevate their business reputation to the very highest level by
                making it possible for thier community's schools to transition into bully-free
                schools
              </p>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default Sponsors
