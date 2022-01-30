import { GridColDef } from "@mui/x-data-grid";
import React, { FunctionComponent, useEffect } from "react";
import DataTable from "../components/DataTable";
import Axios from 'axios';
import Backdrop from "@mui/material/Backdrop";
import Loader from "react-loader-spinner";

interface SponsorshipsProps {
    
}
 
const Sponsorships: FunctionComponent<SponsorshipsProps> = () => {
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [response, setResponse] = React.useState({} as any);

    let columns: GridColDef[] = [
        {
            field: 'sponsor_name',
            headerName: 'Sponsor',
            flex: 1
        },
        {
            field: 'school_name',
            headerName: 'School',
            flex: 1
        },
        {
            field: 'expiry',
            headerName: 'Expiry',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1
        },
        {
            field: '',
            headerName: 'Action',
            flex: 1,
            sortable: false
        }
    ];

    let url: string;
    if (process.env.NODE_ENV === 'development') {
        url = `${process.env.REACT_APP_DEV_BACKEND}`;
    } else if (process.env.NODE_ENV === 'production') {
        url = `${process.env.REACT_APP_PRODUCTION}`;
    }

    let fetchSponsorships = async () => {
        setLoading(true);
        try {
            let res = await Axios({
                method: 'get',
                url: `${url + '/sponsorships'}`,
            });

            console.log('res.data', res.data, response, loading);

            setResponse(res.data);
            setRows(res.data);

            setLoading(false);
        } catch (error: any) {
            console.log(error.response);
            setResponse(error.response);
            setLoading(false);
        }
    };

    useEffect(() => {
        let abortController = new AbortController();
        fetchSponsorships();
        return () => { abortController.abort(); };
        // eslint-disable-next-line
    }, []);

    return ( 
        <div style={{ width: '100%', marginTop: '10%', padding: '2%' }}>
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
            <DataTable defaultSortColumn="expiry" rowId={'sponsorship_id'} columns={columns} rows={rows}></DataTable>
        </div>
     );
}
 
export default Sponsorships;