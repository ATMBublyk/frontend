import axios from "axios";
import {backendUrl, mainPageUrl} from "../links";

const CARD_NUMBER_INPUT = "login-card-number-input";
const PIN_INPUT = "login-pin-input";
const LOGIN_PATH = `${backendUrl}/login`;
const INVALID_INPUT_CLASS = "is-invalid";
const INVALID_MESSAGE_CLASS = "login-invalid";
const DISPLAY_NONE_CLASS = "d-none";

const setInvalidUi = (cardNumberObj, pinObj) => {
  cardNumberObj.classList.add(INVALID_INPUT_CLASS);
  pinObj.classList.add(INVALID_INPUT_CLASS);

  const invalidMessageObj = document.querySelector(`.${INVALID_MESSAGE_CLASS}`);
  invalidMessageObj.classList.remove(DISPLAY_NONE_CLASS);
};

const loginHandler = () => {
  const loginForm = document.querySelector(".login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cardNumber = document.getElementById(CARD_NUMBER_INPUT);
    const pin = document.getElementById(PIN_INPUT);

    try {
      const response = await axios.post(LOGIN_PATH, {
        cardNumber: cardNumber.value,
        pin: pin.value
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      window.location.href = mainPageUrl;
    } catch (error) {
      setInvalidUi(cardNumber, pin);
    }

  });
};

export default loginHandler;
