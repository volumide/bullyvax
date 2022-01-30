import { GridColDef } from "@mui/x-data-grid";
import React, { FunctionComponent, useEffect } from "react";
import DataTable from "../components/DataTable";
import Axios from 'axios';

interface ManageUsersProps {
    
}
 
const ManageUsers: FunctionComponent<ManageUsersProps> = () => {
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [response, setResponse] = React.useState({} as any);

    let columns: GridColDef[] = [
        {
            field: 'last_name',
            headerName: 'Name',
            flex: 1
        },
        {
            field: 'permission',
            headerName: 'Permission',
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

    let fetchUsers = async () => {
        setLoading(true);
        try {
            let res = await Axios({
                method: 'get',
                url: `${url + '/users/fetch'}`,
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
        fetchUsers();
        return () => { abortController.abort(); };
        // eslint-disable-next-line
    }, []);
    
    return ( 
        <div style={{ width: '100%', marginTop: '10%', padding: '2%' }}>
            <DataTable defaultSortColumn="last_name" rowId="user_id" columns={columns} rows={rows}></DataTable>
        </div>
     );
}
 
export default ManageUsers;