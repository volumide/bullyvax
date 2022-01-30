import Axios from "axios";

class Auth {
	isAuthenticated: boolean;
	constructor() {
		this.isAuthenticated = false;
	}

	login(cb: any) {
		this.isAuthenticated = true;

		cb();

		Axios.interceptors.request.use((config: any) => {
			const token = localStorage.getItem("app_id");
			config.headers["Authorization"] = `Bearer ${token}`;

			return config;
		});
	}

	logout(cb: any) {
		this.isAuthenticated = false;
		cb();
	}

	confirmAuth() {
		let authStatus = localStorage.getItem("app_id");
		let userRole = localStorage.getItem("user_id");
		this.isAuthenticated = true;
		if (authStatus && userRole === "USER") {
			this.isAuthenticated = true;
		} else {
			this.isAuthenticated = false;
		}
		return this.isAuthenticated;
	}

	confirmAdminAuth() {
		let authStatus = localStorage.getItem("app_id");
		let userRole = localStorage.getItem("user_id");

		if (authStatus && userRole === "ADMIN") {
			this.isAuthenticated = true;
		} else {
			this.isAuthenticated = false;
		}
		return this.isAuthenticated;
	}
}

export default new Auth();
