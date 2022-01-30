import { Box } from "@mui/system";
import React, { FunctionComponent, useEffect } from "react";
import Form, { FRadioButton, InputField, SelectOption } from "../components/Form";
import { FormFieldWrapper } from "./Home";
import Axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import SearchIcon from "@mui/icons-material/Search";
import GenericModal from "../components/Modal";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Loader from "react-loader-spinner";

interface SponsorsProps {}

interface SchoolInfo {
	name: string;
	zip_code: string;
}

const Sponsors: FunctionComponent<SponsorsProps> = () => {
	const [states, setStates] = React.useState([] as SelectOption[]);
	// const [counties, setCounties] = React.useState([] as SelectOption[]);
	const [loading, setLoading] = React.useState(false);
	// const [selectedState, setSelectedState] = React.useState('');
	const [response, setResponse] = React.useState({} as any);
	const [selectedPage] = React.useState("Sponsors");
	const [canCheckout, setCanCheckout] = React.useState(false);
	const [sponsorType, setSponsorType] = React.useState("Individual");
	const [userDetails, setUserDetails] = React.useState({} as any);
	const [sponsorshipPrice] = React.useState(84);
	const [openModal, setOpenModal] = React.useState(false);
	const [schoolsArray, setSchoolsArray] = React.useState([
		{ name: "school1_name", zip_code: "school1_zip_code" },
		{ name: "school2_name", zip_code: "school2_zip_code" },
		{ name: "school3_name", zip_code: "school3_zip_code" },
	] as SchoolInfo[]);
	const [formSchema, setFormSchema] = React.useState({
		type: "Individual",
		entity_name: "",
		first_name: "",
		last_name: "",
		state: "",
		county: "",
		email: "",
		username: "",
		school1_name: "",
		school1_zip_code: "",
		school2_name: "",
		school2_zip_code: "",
		school3_name: "",
		school3_zip_code: "",
		quantity: schoolsArray.length,
		schoolsArray,
	});
	const [modalContent, setModalContent] = React.useState("" as any);
	const [messageType, setMessageType] = React.useState("" as "info" | "warning" | "error" | "success" | "danger");
	const [searchTerm, setSearchTerm] = React.useState("");

	let statesUrl = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:*&key=8ea19e5ad6a8d3f6f527ef60f677f2e6586178f1";
	let url: string;

	if (process.env.NODE_ENV === "development") {
		url = `${process.env.REACT_APP_DEV_BACKEND}`;
	} else if (process.env.NODE_ENV === "production") {
		url = `${process.env.REACT_APP_PRODUCTION}`;
	}

	// let handleSelection = (selected: SelectOption) => {
	//     setSelectedState(selected.value);
	// };

	let handleSponsorTypeSelection = (selected: string) => {
		setSponsorType(selected);
	};

	let getStates = async () => {
		setLoading(true);
		try {
			let res = await Axios({
				method: "get",
				url: `${statesUrl}`,
			});

			console.log("res.data", res.data, states, loading);

			setStates(
				res.data.map((stateInfo: any[], index: number): SelectOption => {
					let state = {
						label: stateInfo[1],
						value: stateInfo[2],
					};

					if (index === 0) {
						state.label = "Choose your State";
						state.value = "";
					}

					return state;
				})
			);

			setLoading(false);
		} catch (error: any) {
			console.log(error.response);
			setStates([]);
			setLoading(false);
		}
	};

	// let getCounties = async (selectedState: string) => {
	//     setLoading(true);
	//     try {
	//         let res = await Axios({
	//             method: 'get',
	//             url: `https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:*&in=state:${selectedState}&key=8ea19e5ad6a8d3f6f527ef60f677f2e6586178f1`,
	//         });

	//         console.log('res.data', res.data, states, loading);

	//         // setCounties(res.data.map((stateInfo: any[], index: number): SelectOption => {
	//         //     let state = {
	//         //         label: stateInfo[1],
	//         //         value: stateInfo[1]
	//         //     }

	//         //     if (index === 0) {
	//         //         state.label = 'Choose your County';
	//         //         state.value = '';
	//         //     }

	//         //     return state;
	//         // }));
	//         setLoading(false);
	//     } catch (error: any) {
	//         console.log(error.response);
	//         // setCounties([]);
	//         setLoading(false);
	//     }
	// };

	let fetchContent = async (q: { page?: string; tab?: string }) => {
		setLoading(true);
		try {
			let res = await Axios({
				method: "get",
				url: `${url + "/content"}?page=${q.page}&tab=${q.tab}`,
			});

			console.log("res.data", res.data, response, loading);

			setResponse(res.data);

			setLoading(false);
		} catch (error: any) {
			console.log(error.response);
			setResponse(error.response);
			setLoading(false);
		}
	};

	let createUser = async (reqBody: any) => {
		setUserDetails(reqBody);

		setLoading(true);
		try {
			let res = await Axios({
				method: "post",
				url: `${url + "/users/create-user"}`,
				data: reqBody,
			});

			createSponsorship(reqBody);
			setResponse(res.data);
			setCanCheckout(true);

			setLoading(false);
			setMessageType("success");
			setModalContent(<p>{res.data.message}</p>);
			setOpenModal(true);
		} catch (error: any) {
			console.log(error.response);
			setResponse(error.response);
			setLoading(false);
			setMessageType("error");
			setModalContent(<p>{error?.response?.data?.message}</p>);
			setOpenModal(true);
		}
	};

	let createSponsorship = async (reqBody: any) => {
		setUserDetails(reqBody);

		setLoading(true);
		try {
			let res = await Axios({
				method: "post",
				url: `${url + "/sponsorships"}`,
				data: reqBody,
			});

			setResponse(res.data);
			setCanCheckout(false);

			setLoading(false);
			setMessageType("success");
			setModalContent(<p>Sponsorships purchase successful!</p>);
			setOpenModal(true);
			setSchoolsArray([
				{ name: "school1_name", zip_code: "school1_zip_code" },
				{ name: "school2_name", zip_code: "school2_zip_code" },
				{ name: "school3_name", zip_code: "school3_zip_code" },
			]);
			setFormSchema({
				type: "Individual",
				entity_name: "",
				first_name: "",
				last_name: "",
				state: "",
				county: "",
				email: "",
				username: "",
				school1_name: "",
				school1_zip_code: "",
				school2_name: "",
				school2_zip_code: "",
				school3_name: "",
				school3_zip_code: "",
				quantity: schoolsArray.length,
				schoolsArray,
			});
			setUserDetails({});
		} catch (error: any) {
			console.log(error.response);
			setResponse(error.response);
			setLoading(false);
			setMessageType("error");
			setModalContent(<p>Something went wrong!</p>);
			setOpenModal(true);
		}
	};

	useEffect(() => {
		let abortController = new AbortController();
		fetchContent({ page: selectedPage, tab: "" });
		return () => {
			abortController.abort();
		};
		// eslint-disable-next-line
	}, [selectedPage]);
	useEffect(() => {
		let abortController = new AbortController();
		getStates();
		return () => {
			abortController.abort();
		};
		// eslint-disable-next-line
	}, []);

	// useEffect(() => {
	//     let abortController = new AbortController();
	//     getCounties(selectedState);
	//     return () => { abortController.abort(); };
	//     // eslint-disable-next-line
	// }, [selectedState]);

	let buySponsorship = (userInfo: any) => {
		createSponsorship({ userInfo, form: userDetails });
	};

	let handleSearch = async (e: any) => {
		if (searchTerm && e.key === "Enter") {
			setLoading(true);
			try {
				let res = await Axios({
					method: "get",
					url: `${url + "/sponsorships"}?zip_name=${searchTerm}`,
				});

				console.log("res.data", res.data, response, loading);

				setResponse(res.data);

				setLoading(false);
				if (res.data?.length === 0) {
					setModalContent(
						<div>
							Your school is currently not protected by BullyVaxx. All that is needed for your school to
							become protected is a individual or business to step up and become the sponsor for the school.
							Real estate agents, new and used auto dealerships, personal injury attorneys, restaurants and
							church youth groups all make great sponsors for BullyVaxx. Please contact any of these
							businesses/groups that you are connected to and get your school protected. To sponsor a school
							please click <Link to="/sponsors">HERE</Link>.
						</div>
					);
				} else {
					setModalContent(
						<div>
							Yes, your school is protected by BullyVaxx, to file a bully or threat report please click{" "}
							<Link to="/login">HERE</Link>.
						</div>
					);
				}

				setMessageType("info");
				setOpenModal(true);
			} catch (error: any) {
				console.log(error.response);
				setResponse(error.response);
				setLoading(false);
			}
		}
	};

	let handleModalClose = () => {
		setOpenModal(false);
	};

	let handleAddSchool = () => {
		let nextSchool = schoolsArray.length + 1;
		let updatedSchools: SchoolInfo[] = [...schoolsArray, { name: `school${nextSchool}_name`, zip_code: `school${nextSchool}_zip_code` }];
		let updatedFormSchema = { ...formSchema, [`school${nextSchool}_name`]: "", [`school${nextSchool}_zip_code`]: "" };
		setFormSchema(updatedFormSchema);
		setSchoolsArray(updatedSchools);
		console.log("updatedFormSchema", updatedFormSchema);
	};

	let handleSearchInput = (e: any) => {
		setSearchTerm(e?.target?.value);
	};

	return (
		<div style={{ width: "100%" }}>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
			</Backdrop>
			<Grid container spacing={2}>
				<Grid item sm={8} xs={12}>
					<Box sx={{ marginTop: "4%", padding: "2%" }}>
						<Grid container spacing={2}>
							<Grid item sm={3}></Grid>
							<Grid item sm={6} xs={12}>
								<iframe
									style={{ marginBottom: "20px" }}
									src="https://drive.google.com/file/d/1iKCArPFREazQhPIEy1lJTGGmzZFRX-ny/preview"
									width="100%"
									height="480"
									allow="autoplay"
								></iframe>
								<Typography style={{ textAlign: "center" }} variant="h5">
									Confirm school sponsorship
								</Typography>
								<Autocomplete
									freeSolo
									id="free-solo-2-demo"
									disableClearable
									options={[].map((option: any) => option.title)}
									renderInput={(params: any) => (
										<TextField
											{...params}
											InputProps={{
												...params.InputProps,
												type: "search",
												placeholder: "School Name and Zip Code…",
												size: "small",
												startAdornment: (
													<InputAdornment position="start">
														<SearchIcon />
													</InputAdornment>
												),
												color: "secondary",
												onKeyUp: (e) => handleSearch(e),
											}}
											onChange={(e) => handleSearchInput(e)}
										/>
									)}
								/>
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
								{/* <FormFieldWrapper>
                                <InputField size="small" color="secondary" selectionChange={handleSelection} isSelect={true} fullWidth={true} name="state" selectOptions={states} variant="outlined" label="Select your state" />
                            </FormFieldWrapper>
                            <FormFieldWrapper>
                                <InputField size="small" color="secondary" isSelect={true} fullWidth={true} name="county" selectOptions={counties} variant="outlined" label="Select your county" />
                            </FormFieldWrapper> */}
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
								{/* <FormFieldWrapper>
                                <InputField size="small" color="secondary" fullWidth={true} name="quantity" type="number" variant="outlined" label="Number of sponsorships" />
                            </FormFieldWrapper> */}
							</Form>
						)}
						{canCheckout && (
							<div>
								<Typography variant="h5">
									Total: ${sponsorshipPrice * userDetails?.quantity}
								</Typography>
								<PayPalButton
									amount={sponsorshipPrice * userDetails?.quantity}
									// shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
									onSuccess={() => buySponsorship(response)}
									options={{ clientId: "sb" }}
								/>
							</div>
						)}
					</Box>
				</Grid>
			</Grid>
		</div>
	);
};

export default Sponsors;
