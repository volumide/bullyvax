import Alert from "@mui/material/Alert";
import React, { FunctionComponent } from "react";

interface AlertSnackBarProps {
    severity: 'warning' | 'error' | 'info' | 'success';
    message: string;
}

const AlertSnackBar: FunctionComponent<AlertSnackBarProps> = (props: AlertSnackBarProps) => {
    return (
        <Alert variant="filled" severity={props.severity}>
            {props.message}
        </Alert>
    );
}

export default AlertSnackBar;