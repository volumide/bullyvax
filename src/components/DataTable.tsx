import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import React, { FunctionComponent } from "react";

interface DataTableProps {
    columns: GridColDef[];
    rows: any[];
    defaultSortColumn: string;
    rowId: string;
}

// export interface 
 
const DataTable: FunctionComponent<DataTableProps> = ({columns, rows, defaultSortColumn, rowId}) => {
    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {
          field: defaultSortColumn,
          sort: 'asc',
        },
      ]);
    
      return (
        <div style={{ height: 400, width: '100%' }}>
          {columns && rows && <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            disableExtendRowFullWidth
            getRowId={(row) => row[rowId]}
          />}
        </div>
      );
}
 
export default DataTable;