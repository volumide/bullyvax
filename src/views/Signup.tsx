import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent } from "react";
import Form, { InputField } from "../components/Form";
import { FormFieldWrapper } from "./Home";
import Axios from 'axios';
import Backdrop from "@mui/material/Backdrop";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import GenericModal from "../components/Modal";

interface SignupProps {
}

const Signup: FunctionComponent<SignupProps> = () => {
    // const [states, setStates] = React.useState([] as SelectOption[]);
    // const [selectedState, setSelectedState] = React.useState('');
    // const [counties, setCounties] = React.useState([] as SelectOption[]);
    const [loading, setLoading] = React.useState(false);
    const [response, setResponse] = React.useState({} as any);
    const [modalContent, setModalContent] = React.useState('' as any);
    const [messageType, setMessageType] = React.useState('' as 'info' | 'warning' | 'error' | 'success' | 'danger');
    const [openModal, setOpenModal] = React.useState(false);

    const history = useHistory();

    // let statesUrl = 'https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:*&key=8ea19e5ad6a8d3f6f527ef60f677f2e6586178f1';

    let url: string;

    if (process.env.NODE_ENV === 'development') {
        url = `${process.env.REACT_APP_DEV_BACKEND}`;
    } else if (process.env.NODE_ENV === 'production') {
        url = `${process.env.REACT_APP_PRODUCTION}`;
    }

    // let getStates = async () => {
    //     setLoading(true);
    //     try {
    //         let res = await Axios({
    //             method: 'get',
    //             url: `${statesUrl}`,
    //         });

    //         console.log('res.data', res.data, states, loading);

    //         setStates(res.data.map((stateInfo: any[], index: number): SelectOption => {
    //             let state = {
    //                 label: stateInfo[1],
    //                 value: stateInfo[2]
    //             }

    //             if (index === 0) {
    //                 state.label = 'Choose your State';
    //                 state.value = '';
    //             }

    //             return state;
    //         }));

    //         setLoading(false);
    //     } catch (error: any) {
    //         console.log(error.response);
    //         setStates([]);
    //         setLoading(false);
    //     }
    // };

    // let getCounties = async (selectedState: string) => {
    //     setLoading(true);
    //     try {
    //         let res = await Axios({
    //             method: 'get',
    //             url: `https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:*&in=state:${selectedState}&key=8ea19e5ad6a8d3f6f527ef60f677f2e6586178f1`,
    //         });

    //         console.log('res.data', res.data, states, loading);

    //         setCounties(res.data.map((stateInfo: any[], index: number): SelectOption => {
    //             let state = {
    //                 label: stateInfo[1],
    //                 value: stateInfo[1]
    //             }

    //             if (index === 0) {
    //                 state.label = 'Choose your County';
    //                 state.value = '';
    //             }

    //             return state;
    //         }));
    //         setLoading(false);
    //     } catch (error: any) {
    //         console.log(error.response);
    //         setCounties([]);
    //         setLoading(false);
    //     }
    // };

    let submitDetails = async (reqBody: any) => {
        console.log(reqBody);
        // reqBody.state = selectedState;

        setLoading(true);
        try {
            let res = await Axios({
                method: 'post',
                url: `${url + '/users/create-user'}`,
                data: reqBody,
            });

            console.log('res.data', res.data, response, loading);

            setResponse(res.data);

            setLoading(false);
            setMessageType('success');
            setModalContent(<p>{res.data.message}</p>);
            setOpenModal(true);
            history.push('/login');
        } catch (error: any) {
            console.log(error.response);
            setResponse(error.response);
            setLoading(false);
            setMessageType('error');
            setModalContent(<p>Something went wrong!</p>);
            setOpenModal(true);
        }
    };

    // let handleSelection = (selected: SelectOption) => {
    //     setSelectedState(selected.value);
    // };

    // useEffect(() => {
    //     let abortController = new AbortController();
    //     getStates();
    //     return () => { abortController.abort(); };
    //     // eslint-disable-next-line
    // }, []);

    // useEffect(() => {
    //     let abortController = new AbortController();
    //     getCounties(selectedState);
    //     return () => { abortController.abort(); };
    //     // eslint-disable-next-line
    // }, [selectedState]);
    let handleModalClose = () => {
        setOpenModal(false);
    }


    return (
        <div style={{ width: '100%', marginTop: '10%' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Loader
                    type="Puff"
                    color="#f44336"
                    height={100}
                    width={100}
                    visible={loading}
                />
            </Backdrop>
            {openModal && <GenericModal messageType={messageType} handleClose={handleModalClose}>
                                    {modalContent}
                                </GenericModal>}
            <Grid container spacing={2}>
                <Grid item sm={4}></Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h4">Report a Bully or threat</Typography>
                    <Form initialValues={{ username: '', email: '', password: '', confirmPassword: '' }} buttonText="sign up" buttonSize="medium" submit={submitDetails}>
                        {/* <FormFieldWrapper>
                            <InputField size="small" color="secondary" selectionChange={handleSelection} isSelect={true} fullWidth={true} name="state" selectOptions={states} variant="outlined" label="Select your state" />
                        </FormFieldWrapper>
                        <FormFieldWrapper>
                            <InputField size="small" color="secondary" isSelect={true} fullWidth={true} name="county" selectOptions={counties} variant="outlined" label="Select your county" />
                        </FormFieldWrapper> */}
                        <FormFieldWrapper>
                            <InputField size="small" color="secondary" fullWidth={true} name="username" type="text" variant="outlined" label="Username" />
                        </FormFieldWrapper>
                        <FormFieldWrapper>
                            <InputField size="small" color="secondary" fullWidth={true} name="email" type="email" variant="outlined" label="Email" />
                        </FormFieldWrapper>
                        <FormFieldWrapper>
                            <InputField size="small" color="secondary" fullWidth={true} name="password" type="password" variant="outlined" label="Password" />
                        </FormFieldWrapper>
                        <FormFieldWrapper>
                            <InputField size="small" color="secondary" fullWidth={true} name="confirmPassword" type="password" variant="outlined" label="Confirm Password" />
                        </FormFieldWrapper>
                        {/* <Typography variant="body2" color="error">{response?.data?.message}</Typography> */}
                    </Form>
                    <Typography component={'p'}>If you already have an account, login <Link to="/login">here</Link>.</Typography>
                </Grid>
                <Grid item sm={4}></Grid>
            </Grid>
        </div>
    );
}

export default Signup;