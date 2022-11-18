import React, { FunctionComponent, useEffect } from "react";
import Axios from "axios";

interface ContactUsProps {}

const BullyFree: FunctionComponent<ContactUsProps> = () => {
	const [loading, setLoading] = React.useState(false);
	const [selectedPage] = React.useState("Bully Free");
	// const [selectedPage] = React.useState("Bully Free");
	const [response, setResponse] = React.useState({} as any);

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

	let content =
		"What is a Bully-Free School? It is a school where repeat or habitual bullies cannot operate. Students will always have disagreements and arguements but the bullycides, school shooters and long term harm comes from habitual bulllies constantly persecuting their victims. The BullyVaxx offers a Bully Discipline oilicy that very quickly exposes repeat  bullies and removes them from the scj=hool if they don't immediately stop abusing others.";

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
			<div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
		</div>
	);
};

export default BullyFree;
