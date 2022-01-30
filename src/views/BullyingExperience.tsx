import React, { FunctionComponent, useEffect } from "react";
import Axios from 'axios';

interface BullyingExperienceProps {

}

const BullyingExperience: FunctionComponent<BullyingExperienceProps> = () => {
    const [response, setResponse] = React.useState({} as any);
    const [loading, setLoading] = React.useState(false);
    const [selectedPage] = React.useState('Bullying Experience');

    let url: string;

    if (process.env.NODE_ENV === 'development') {
        url = `${process.env.REACT_APP_DEV_BACKEND}`;
    } else if (process.env.NODE_ENV === 'production') {
        url = `${process.env.REACT_APP_PRODUCTION}`;
    }

    let fetchContent = async (q: { page?: string; tab?: string; }) => {
        setLoading(true);
        try {
            let res = await Axios({
                method: 'get',
                url: `${url + '/content'}?page=${q.page}&tab=${q.tab}`,
            });

            console.log('res.data', res.data, response, loading);

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
        fetchContent({ page: selectedPage, tab: '' });
        return () => { abortController.abort(); };
        // eslint-disable-next-line
    }, [selectedPage]);

    return (
        <div style={{ width: '100%' }}>
            <div style={{width: '60%', marginLeft: 'auto', marginRight: 'auto'}}>
                If you are the parent/guardian of a student who has been bullied we
                are interested in your story. We are especially interested in situations
                where the parents/guardians have made every effort to work with
                school administrators to get the abuse stopped but the bullying
                continued. Please use the form below to share your story.
                _______________ email address
                Tell us about your experience and please include any advice you may
                have for us to make our system work even better for you:
            </div>
            <div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
        </div>
    );
}

export default BullyingExperience;