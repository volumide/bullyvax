import React, { FunctionComponent, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import Form, { InputField, SelectOption } from "../components/Form";
import { FormFieldWrapper } from "./Home";
import Axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Loader from "react-loader-spinner";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// import Utils from '../utilities/Utils';
// import auth from '../utilities/Auth';
// import Loader from 'react-loader-spinner';
import htmlToDraft from "html-to-draftjs";
import GenericModal from "../components/Modal";

interface AdminProps {
	// history?: any;
}

const Admin: FunctionComponent<AdminProps> = (props: AdminProps) => {
	const [editorState, setEditorState] = React.useState();
	const [content, setContent] = React.useState();
	const [selectedPage, setSelectedPage] = React.useState("");
	const [openModal, setOpenModal] = React.useState(false);
	const [messageType, setMessageType] = React.useState("" as "info" | "warning" | "error" | "success" | "danger");
	const [modalContent, setModalContent] = React.useState("" as any);

	const handleEditorStateChange = (editorState: any) => {
		setEditorState(editorState);
		setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
	};

	const handleSelectionChange = (pageInfo: SelectOption) => {
		setSelectedPage(pageInfo.value);
	};

	const [response, setResponse] = React.useState({} as any);
	const [loading, setLoading] = React.useState(false);

	let url: string;

	if (process.env.NODE_ENV === "development") {
		url = `${process.env.REACT_APP_DEV_BACKEND}`;
	} else if (process.env.NODE_ENV === "production") {
		url = `${process.env.REACT_APP_PRODUCTION}`;
	}

	let addContent = async (reqBody: any) => {
		console.log(reqBody);
		reqBody.content = content;

		setLoading(true);
		try {
			let res = await Axios({
				method: "post",
				url: `${url + "/content/create"}`,
				data: reqBody,
			});

			setResponse(res.data);

			setLoading(false);
			setMessageType("success");
			setModalContent(<p>Content updated successfully!</p>);
			setOpenModal(true);
		} catch (error: any) {
			setResponse(error.response);
			setLoading(false);
			setMessageType("error");
			setModalContent(<p>Something went wrong!</p>);
			setOpenModal(true);
		}
	};

	let fetchContent = async (q: { page?: string; tab?: string }) => {
		setLoading(true);
		try {
			let res = await Axios({
				method: "get",
				url: `${url + "/content"}?page=${q.page}&tab=${q.tab}`,
			});

			setResponse(res.data);
			// setEditorState();
			// console.log('toDraft', convertToRaw());
			const contentBlock = htmlToDraft(res.data?.content);
			if (contentBlock) {
				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
				const editorState = EditorState.createWithContent(contentState) as any;
				setEditorState(editorState);
			}

			setLoading(false);
		} catch (error: any) {
			console.log(response);
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

	let handleModalClose = () => {
		setOpenModal(false);
	};

	return (
		<div style={{ width: "100%", marginTop: "10%", padding: "2%" }}>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<Loader type="Puff" color="#f44336" height={100} width={100} visible={loading} />
			</Backdrop>
			{openModal && (
				<GenericModal messageType={messageType} handleClose={handleModalClose}>
					{modalContent}
				</GenericModal>
			)}
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h4">Edit website content</Typography>
					<div style={{ width: "20%" }}>
						<Form initialValues={{ page: "", tab: "" }} buttonText="save" buttonSize="medium" submit={addContent}>
							<FormFieldWrapper>
								<InputField
									size="small"
									color="secondary"
									fullWidth={true}
									isSelect={true}
									name="page"
									selectionChange={handleSelectionChange}
									selectOptions={[
										{ label: "Home", value: "Home" },
										{ label: "About", value: "About" },
										{ label: "Faq", value: "Faq" },
										{ label: "Sponsors", value: "Sponsors" },
										{ label: "Message to Moms", value: "Message to Moms" },
										{ label: "Message to Bullies", value: "Message to Bullies" },
										{ label: "Bullying Experience", value: "Bullying Experience" },
										{ label: "School Administrators", value: "School Administrators" },
										{
											label: "Asian American Students",
											value: "Asian American Students",
										},
										{ label: "Contact Us", value: "Contact Us" },
										{
											label: "Bully Discipline Policy",
											value: "Bully Discipline Policy",
										},
										{
											label: "School Shooter",
											value: "School Shooter",
										},
										{
											label: "Request Report",
											value: "Request Report",
										},
										{
											label: "Bully Free",
											value: "Bully Free",
										},
									]}
									variant="outlined"
									label="Select page"
								/>
							</FormFieldWrapper>
						</Form>
					</div>
					<Editor
						editorState={editorState}
						// toolbarClassName="toolbarClassName"
						// wrapperClassName="wrapperClassName"
						// editorClassName="editorClassName"
						editorStyle={{ border: "1px solid gray", minHeight: "400px" }}
						onEditorStateChange={(e: any) => handleEditorStateChange(e)}
						handlePastedText={() => false}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default Admin;
