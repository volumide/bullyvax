import React from "react";
import { Redirect, Route } from "react-router-dom";
import auth from "../utilities/Auth";

export interface ProtectedRouteProps {
	component: React.FunctionComponent<any>;
	exact: boolean;
	path: string;
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
	const isAuthenticated = auth.confirmAuth() || auth.confirmAdminAuth();
	return <Route {...rest} render={(props: any) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
};

export default ProtectedRoute;
