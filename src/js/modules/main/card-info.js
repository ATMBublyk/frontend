import axios from "axios";
import {backendUrl} from "../links";
import handleInvalidToken from "./handle-invalid-token";

const GET_CARD_INFO_URL = `${backendUrl}/card-info`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const CARD_INFO_CLASS = "card-info";
const CARD_INFO_SPINNER_CLASS = "card-info-spinner";
const DISPLAY_NONE_CLASS = "d-none";

const cardInfo = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  let gotCardInfo = null;
  try {
    gotCardInfo = await axios.get(GET_CARD_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    gotCardInfo = gotCardInfo.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      console.log(error);
      return;
    }
  }

  const spinner = document.querySelector(`.${CARD_INFO_SPINNER_CLASS}`);
  spinner.classList.add(DISPLAY_NONE_CLASS);

  const cardHolder = gotCardInfo.name;
  const cardNumber = gotCardInfo.cardNumber.match(/.{1,4}/g).join(" ");
  const balance = gotCardInfo.balance;
  const bankName = gotCardInfo.bankName;

  const cardInfoElem = document.querySelector(`.${CARD_INFO_CLASS}`);
  cardInfoElem.innerHTML = `
                    <p>Card holder: <span class="card-info__holder">${cardHolder}</span></p>
                    <p>Card number: <span class="card-info__card-number">${cardNumber}</span></p>
                    <p>Bank: <span class="card-info__bank">${bankName}</span></p>
                    <p>Balance: <span class="card-info__balance">${balance}</span></p>
  `;

};

export default cardInfo;
