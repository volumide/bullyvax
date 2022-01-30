import React, { FunctionComponent } from "react";
import Form, { InputField } from "../components/Form";
import { FormFieldWrapper } from "./Home";
import Axios from "axios";
import Utils from "../utilities/Utils";
import auth from "../utilities/Auth";
import Loader from "react-loader-spinner";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import AlertSnackBar from "../components/Alert";

interface LoginProps {
	history: any;
}

const Login: FunctionComponent<LoginProps> = (props: LoginProps) => {
	const [response, setResponse] = React.useState({} as any);
	const [loading, setLoading] = React.useState(false);

	let url: string;

	if (process.env.NODE_ENV === "development") {
		url = `${process.env.REACT_APP_DEV_BACKEND}`;
	} else if (process.env.NODE_ENV === "production") {
		url = `${process.env.REACT_APP_PRODUCTION}`;
	}

	let login = async (reqBody: any) => {
		setLoading(true);
		try {
			let res = await Axios({
				method: "post",
				url: `${url + "/auth/login"}`,
				data: reqBody,
			});

			setResponse(res.data);
			// alert('Authentication successful!');
			let userRole;

			if (res.data && res.data.access_token) {
				localStorage.setItem("app_id", res.data.access_token);
				let decodedToken: any = Utils.decodeJWT(JSON.stringify(localStorage.getItem("app_id")));

				userRole = decodedToken.role;

				localStorage.setItem("user_id", userRole);
			}

			setLoading(false);

			if (userRole === "ADMIN") {
				auth.login(() => {
					props.history.push("/dashboard/admin");
				});
			} else if (userRole === "USER") {
				auth.login(() => {
					props.history.push(`/dashboard/forms`);
				});
			}
		} catch (error: any) {
			console.log(error.response);
			setResponse(error.response);
			setLoading(false);
		}
	};

	return (
		<div style={{ width: "100%", marginTop: "10%" }}>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
			</Backdrop>
			<Grid container spacing={2}>
				<Grid item sm={4}></Grid>
				<Grid item xs={12} sm={4}>
					<Typography variant="h4">Sign in to your account</Typography>
					<Form initialValues={{ username: "", password: "" }} buttonText="sign in" buttonSize="medium" submit={login}>
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
								name="password"
								type="password"
								variant="outlined"
								label="Confirm Password"
							/>
						</FormFieldWrapper>
						{/* <Typography variant="body2" color="error">{response?.data?.message}</Typography> */}
					</Form>
					{response?.data?.message && (
						<AlertSnackBar severity="error" message={response?.data?.message}></AlertSnackBar>
					)}
					<Typography component={"p"}>
						If you do not have an account, sign up <Link to="/signup">here</Link>.
					</Typography>
				</Grid>
				<Grid item sm={4}></Grid>
			</Grid>
		</div>
	);
};

export default Login;
