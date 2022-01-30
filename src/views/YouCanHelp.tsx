import React, { FunctionComponent, useEffect } from "react";
import Form, { InputField } from "../components/Form";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import styled from "@mui/material/styles/styled";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Axios from "axios";

interface HomeProps {}

export const FeedbackDiv = styled("div")(({ theme }) => ({
	color: theme.palette.getContrastText(theme.palette.primary.main),
	backgroundColor: theme.palette.primary.main,
}));

export const Video = styled("video")(({ theme }) => ({
	width: "100%",
}));

const FeedbackForm = styled("div")(({ theme }) => ({
	width: "100%",
	background: "#FDFEFB",
	padding: "7%",
	borderRadius: "5px",
}));

export const FormFieldWrapper = styled("div")(({ theme }) => ({
	marginBottom: "3%",
}));

const YouCanHelp: FunctionComponent<HomeProps> = () => {
	const [loading, setLoading] = React.useState(false);
	const [response, setResponse] = React.useState({} as any);
	const [selectedPage] = React.useState("Home");

	let url: string;

	if (process.env.NODE_ENV === "development") {
		url = `${process.env.REACT_APP_DEV_BACKEND}`;
	} else if (process.env.NODE_ENV === "production") {
		url = `${process.env.REACT_APP_PRODUCTION}`;
	}

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

	useEffect(() => {
		let abortController = new AbortController();
		fetchContent({ page: selectedPage, tab: "" });
		return () => {
			abortController.abort();
		};
		// eslint-disable-next-line
	}, [selectedPage]);

	return (
		<div style={{ width: "100%" }}>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
			</Backdrop>

			<Box component={"div"} sx={{ width: "100%" }}>
				<Grid container spacing={2}>
					<Grid item sm={2}></Grid>
					<Grid item xs={12} sm={8}>
						<Box component={"div"} sx={{ width: "100%", p: 2 }}>
							<iframe
								src="https://drive.google.com/file/d/10njYg13U1U7kJww5KAT6R8SHvO3KXpj8/preview"
								width="100%"
								height="480"
								allow="autoplay"
							></iframe>
							{/* <Video controls>
								<source
									src="https://drive.google.com/file/d/1a1w6u12ynG0pZ_EGAx6rOP1SgcnrLbiC/preview"
									// type="video/mp4"
								/> */}
							{/* <source src="mov_bbb.ogg" type="video/ogg" /> */}
							{/* Your browser does not support HTML video. */}
							{/* </Video>
							//{" "} */}
						</Box>
						<div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
					</Grid>
					<Grid item sm={2}></Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default YouCanHelp;
