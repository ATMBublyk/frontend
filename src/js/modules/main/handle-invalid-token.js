import {loginPageUrl} from "../links";

const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const SESSION_IS_EXPIRED_ITEM_NAME = "sessionIsExpired";

const handleInvalidToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_ITEM_NAME);
  localStorage.setItem(SESSION_IS_EXPIRED_ITEM_NAME, "true");
  window.location.href = loginPageUrl;
};

export default handleInvalidToken;
