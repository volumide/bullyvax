import React, { FunctionComponent } from "react";
import SweetAlert from "react-bootstrap-sweetalert";

interface GenericModalProps {
    children?: React.ReactNode;
    handleClose: () => void;
    messageType: 'info' | 'warning' | 'error' | 'success' | 'danger';
}

const GenericModal: FunctionComponent<GenericModalProps> = (props: GenericModalProps) => {
    const { children, handleClose, messageType } = props;
    // const handleClose = () => {};

    return (
        <>
        {messageType === 'info' && (<SweetAlert
            info
            title="Info"
            onConfirm={() => handleClose()}
            confirmBtnBsStyle="primary"
            showCloseButton={true}
        >
            {children}
        </SweetAlert>)}

        {messageType === 'warning' && (<SweetAlert
            warning
            title="Warning"
            onConfirm={() => handleClose()}
            confirmBtnBsStyle="primary"
            showCloseButton={true}
        >
            {children}
        </SweetAlert>)}

        {messageType === 'error' && (<SweetAlert
            error
            title="Error"
            onConfirm={() => handleClose()}
            confirmBtnBsStyle="primary"
            showCloseButton={true}
        >
            {children}
        </SweetAlert>)}

        {messageType === 'success' && (<SweetAlert
            success
            title="Success"
            onConfirm={() => handleClose()}
            confirmBtnBsStyle="primary"
            showCloseButton={true}
        >
            {children}
        </SweetAlert>)}
        </>
    );
}

export default GenericModal;