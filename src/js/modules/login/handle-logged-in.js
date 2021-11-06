import {mainPageUrl} from "../links";

const ACCESS_TOKEN_ITEM_NAME = "accessToken";

const handleLoggedIn = () => {
  const existingToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  if (existingToken) {
    window.location.href = mainPageUrl;
  }
};

export default handleLoggedIn;
