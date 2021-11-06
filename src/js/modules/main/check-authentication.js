import {loginPageUrl} from "../links";

const ACCESS_TOKEN_ITEM_NAME = "accessToken";

const checkAuthentication = () => {
  const existingAccessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  if (!existingAccessToken) {
    window.location.href = loginPageUrl;
  }
};

export default checkAuthentication;
