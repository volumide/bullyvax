import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent } from "react";
import Form, { InputField } from "../components/Form";
import { FormFieldWrapper } from "./Home";
import Axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import GenericModal from "../components/Modal";
import StripeCheckout from "react-stripe-checkout";

interface RequestReportForm {}

const RequestReportForm: FunctionComponent<RequestReportForm> = () => {
	const [loading, setLoading] = React.useState(false);
	const [response, setResponse] = React.useState({} as any);
	const [messageType, setMessageType] = React.useState("" as "info" | "warning" | "error" | "success" | "danger");
	const [openModal, setOpenModal] = React.useState(false);
	const [canPay, setCanPay] = React.useState(false);
	const [modalContent, setModalContent] = React.useState("" as any);

	const history = useHistory();
	let url: string;

	if (process.env.NODE_ENV === "development") {
		url = `${process.env.REACT_APP_DEV_BACKEND}`;
	} else if (process.env.NODE_ENV === "production") {
		url = `${process.env.REACT_APP_PRODUCTION}`;
	}

	const submitDetails = async (req: any) => {
		const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!req.email.match(regexEmail)) {
			setModalContent(<div>Invalid email</div>);
			setMessageType("warning");
			setOpenModal(true);
			setLoading(false);
			console.log("workring");
			return;
		}
		localStorage.setItem("request", JSON.stringify(req));
		setCanPay(true);
	};

	let handleModalClose = () => {
		setOpenModal(false);
	};

	async function handleToken(token: any) {
		console.log(token);
		const template = `In regard to your request for copies of bully reports, all students in BullyVaxx are identified by a BullyVaxx number, not by their name. In order to move forward with your request a bullyvaxx file and number must be created for the student that you have submitted. This assignment of a number and creation of a file must be done individually by one of our staff members and there is a $25 fee to cover our costs of providing this`;
		const quantity: number = 1;
		const price: number = 2500;
		const response = await Axios.post(`${url}/users/stripe/payment`, { token, quantity, price });
		// // setWaiting(true);
		const { status } = response.data;
		if (status === "succeeded") {
			const dataR: any = localStorage.getItem("request");
			const resData: any = JSON.parse(dataR);
			let data = {
				from: "info@bullyvaxx.com",
				to: resData.email,
				subject: "Bullying Report Request",
				text: "Bullying Report Request",
				html: template,
			};
			try {
				let res = await Axios({
					method: "post",
					url: `${url + "/mailing-service/send-mail"}`,
					data: data,
				});

				let res2 = await Axios({
					method: "post",
					url: `${url + "/users/report-request"}`,
					data: resData,
				});
				setModalContent(<div>Check your email for more information</div>);
				setMessageType("success");
				setOpenModal(true);
				setLoading(false);
				setCanPay(false);
				// console.log("workring");
				// console.log(res2);
			} catch (err) {
				console.log(err);
			}
		}
	}

	return (
		<div style={{ width: "100%", marginTop: "10%" }}>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
			</Backdrop>
			{openModal && (
				<GenericModal messageType={messageType} handleClose={handleModalClose}>
					{modalContent}
				</GenericModal>
			)}

			<Grid container spacing={2}>
				<Grid item sm={4}></Grid>
				<Grid item xs={12} sm={4}>
					<Typography variant="h4">Request Bully Report</Typography>
					{!canPay ? (
						<Form
							initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
							buttonText="Proceed to payment"
							buttonSize="medium"
							submit={submitDetails}
						>
							<FormFieldWrapper>
								<InputField size="small" color="secondary" fullWidth={true} name="schoolName" type="text" variant="outlined" label="School Name" />
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField size="small" color="secondary" fullWidth={true} name="zipCode" type="text" variant="outlined" label="Zip Code" />
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField size="small" color="secondary" fullWidth={true} name="bullyName" type="text" variant="outlined" label="Bully's Name" />
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField size="small" color="secondary" fullWidth={true} name="bullyGrade" type="text" variant="outlined" label="Bully's Grade" />
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField
									size="small"
									color="secondary"
									fullWidth={true}
									name="bullyTeacher"
									type="text"
									variant="outlined"
									label="Bully’s Home Room Teacher"
								/>
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField
									size="small"
									color="secondary"
									fullWidth={true}
									name="bullyGender"
									type="text"
									variant="outlined"
									label="Is Bully Male or Female"
								/>
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField
									size="small"
									color="secondary"
									fullWidth={true}
									name="bullyvaxNumber"
									type="text"
									variant="outlined"
									label="Bully’s BullyVaxx number (if you know it)"
								/>
							</FormFieldWrapper>
							<FormFieldWrapper>
								<InputField size="small" color="secondary" fullWidth={true} name="email" type="email" variant="outlined" label="Your Email Address" />
							</FormFieldWrapper>
							{/* <Typography variant="body2" color="error">{response?.data?.message}</Typography> */}
						</Form>
					) : (
						<StripeCheckout
							allowRememberMe
							stripeKey="pk_test_51KOluiEvT7coUybkV5V9bsEwzMG1GStiV16pTbXwRj0BIuWtNoIcE2PVF0ImnIfVCxV7h7d8IIHcd7d8CmnWqWtu00yMhvuQJZ"
							token={handleToken}
							amount={2500}
							name="Report Request"
							label="Request Report"
						/>
					)}

					{/* <Typography component={"p"}>
						If you already have an account, login <Link to="/login">here</Link>.
					</Typography> */}
				</Grid>
				<Grid item sm={4}></Grid>
			</Grid>
		</div>
	);
};
export default RequestReportForm;
