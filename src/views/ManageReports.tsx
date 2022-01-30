import { GridColDef } from "@mui/x-data-grid";
import React, { FunctionComponent } from "react";
import DataTable from "../components/DataTable";

interface ManageReportsProps {
    
}
 
const ManageReports: FunctionComponent<ManageReportsProps> = () => {
    const [rows] = React.useState([]);
    let columns: GridColDef[] = [
        {
            field: 'sponsor_name',
            headerName: 'Student',
            flex: 1
        },
        {
            field: 'school_name',
            headerName: 'School',
            flex: 1
        },
        {
            field: 'expiry',
            headerName: 'Date',
            flex: 1
        },
        {
            field: '',
            headerName: 'Action',
            flex: 1,
            sortable: false
        }
    ];
    
    return ( 
        <div style={{ width: '100%', marginTop: '10%', padding: '2%' }}>
        {/* <Backdrop
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
        </Backdrop> */}
        <DataTable defaultSortColumn="expiry" rowId={'sponsorship_id'} columns={columns} rows={rows}></DataTable>
    </div>
     );
}
 
export default ManageReports;