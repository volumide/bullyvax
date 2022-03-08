import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./views/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey, red } from "@mui/material/colors";
import { CssBaseline } from "@mui/material";
import Footer from "./components/Footer";
import About from "./views/About";
import Faq from "./views/Faq";
import Sponsors from "./views/Sponsors";
import Reports from "./views/Reports";
import Login from "./views/Login";
import Admin from "./views/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./views/Signup";
import ManageReports from "./views/ManageReports";
import ManageUsers from "./views/ManageUsers";
import Sponsorships from "./views/Sponsorships";
import MessageToBullies from "./views/MessageToBullies";
import MessageToMoms from "./views/MessageToMoms";
import BullyPolicy from "./views/BullyPolicy";
import BullyingExperience from "./views/BullyingExperience";
import SchoolAdministrators from "./views/SchoolAdministrators";
import AsianAmericanStudents from "./views/AsianAmericanStudents";
import YouCanHelp from "./views/YouCanHelp";
import ContactUs from "./views/ContactUs";

const theme = createTheme({
	palette: {
		primary: {
			main: red[500],
		},
		secondary: {
			main: blueGrey[900],
		},
	},
	typography: {
		fontFamily: `'Padauk', sans-serif`,
		// fontSize: 16,
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: `
        @font-face {
          font-family: 'Padauk', sans-serif;
          font-style: normal;
          font-weight: 400;
        }
      `,
		},
	},
});

function App() {
	return (
		<Fragment>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<div style={{ width: "100%", background: "#FDFEFB" }}>
						<NavBar>
							<div style={{ minHeight: "50vh" }}>
								<Switch>
									<Route exact component={Home} path="/" />
									{/* <Route exact component={Success} path="/success" /> */}
									<Route exact component={About} path="/about" />
									<Route exact component={Faq} path="/faq" />
									<Route exact component={Sponsors} path="/sponsors/:id" />
									{/* <Route exact component={Sponsors} path="/success" /> */}
									{/* <Route exact component={Sponsors} path="/canceled" /> */}
									<ProtectedRoute exact component={Reports} path="/dashboard/forms" />
									<ProtectedRoute exact component={Admin} path="/dashboard/admin" />
									<Route exact component={Login} path="/login" />
									<Route exact component={Signup} path="/signup" />
									<ProtectedRoute exact component={ManageReports} path="/dashboard/reports" />
									<ProtectedRoute exact component={ManageUsers} path="/dashboard/users" />
									<ProtectedRoute exact component={Sponsorships} path="/dashboard/sponsorships" />
									<Route exact component={MessageToBullies} path="/bullies" />
									<Route exact component={MessageToMoms} path="/moms" />
									<Route exact component={BullyingExperience} path="/experience" />
									<Route exact component={SchoolAdministrators} path="/administrators" />
									<Route exact component={AsianAmericanStudents} path="/asian-american-students" />
									<Route exact component={ContactUs} path="/contact" />
									<Route exact component={BullyPolicy} path="/bully-policy" />
									<Route exact component={YouCanHelp} path="/you-can-help" />
								</Switch>
							</div>
						</NavBar>
						<div style={{ flexGrow: 1 }}>
							<Footer />
						</div>
					</div>
				</Router>
			</ThemeProvider>
		</Fragment>
	);
}

export default App;
