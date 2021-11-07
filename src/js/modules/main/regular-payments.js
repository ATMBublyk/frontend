import axios from "axios";
import {backendUrl} from "../links";
import handleInvalidToken from "./handle-invalid-token";

const GET_REGULAR_PAYMENTS_URL = `${backendUrl}/regular-transfers`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const REGULAR_PAYMENT_LIST_CLASS = "regular-payments__card-list";
const NO_REGULAR_PAYMENTS_LABEL_CLASS = "no-regular-payments-label";

const regularPayments = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  let gotRegularPayments = [];
  try {
    gotRegularPayments = axios.get(GET_REGULAR_PAYMENTS_URL, {
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

  const regularPaymentList = document.querySelector(`.${REGULAR_PAYMENT_LIST_CLASS}`);
  if (gotRegularPayments.length === 0) {
    const noRegularPaymentsLabel = document.querySelector(NO_REGULAR_PAYMENTS_LABEL_CLASS);
  } else {

  }
};
