import handleLoggedIn from "./modules/login/handle-logged-in";
import loginHandler from "./modules/login/login-handler";
import setSessionIsExpiredMessage from "./modules/login/set-session-is-expired-message";

handleLoggedIn();
setSessionIsExpiredMessage();
loginHandler();
