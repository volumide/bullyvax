import { Typography } from "@mui/material";
import React, { FunctionComponent } from "react";

interface FooterProps {
    
}
 
const Footer: FunctionComponent<FooterProps> = () => {
    return (
        <div style={{color: '#fff'}}>
            <svg style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 318"><path fill="#f44336" fillOpacity="1" d="M0,160L48,154.7C96,149,192,139,288,160C384,181,480,235,576,229.3C672,224,768,160,864,154.7C960,149,1056,203,1152,229.3C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            <div style={{height: '200px', background: '#f44336'}}>
                <Typography style={{textAlign: 'center'}}> &copy; All rights reserved, BullyVaxx, {new Date().getFullYear()}.</Typography>
            </div>
        </div>
    );
}
 
export default Footer;