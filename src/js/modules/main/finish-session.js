import axios from "axios";
import handleInvalidToken from "./handle-invalid-token";
import {backendUrl, loginPageUrl} from "../links";

const FINISH_SESSION_FORM_CLASS = "finish-session-form";
const LOGOUT_URL = `${backendUrl}/logout`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";

const finishSession = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  const finishSessionForm = document.querySelector(`.${FINISH_SESSION_FORM_CLASS}`);
  finishSessionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await axios.post(LOGOUT_URL, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch (error) {
      if (error.response.status === 401) {
        handleInvalidToken();
        return;
      } else {
        console.log(error);
        return;
      }
    }

    localStorage.removeItem(ACCESS_TOKEN_ITEM_NAME);
    window.location.href = loginPageUrl;
  });
};

export default finishSession;
