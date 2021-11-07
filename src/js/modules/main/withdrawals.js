import axios from "axios";
import {backendUrl} from "../links";
import handleInvalidToken from "./handle-invalid-token";
import moment from "moment";

const GET_WITHDRAWALS_URL = `${backendUrl}/withdrawals`;
const POST_WITHDRAWAL_URL = `${backendUrl}/withdrawal`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const WITHDRAWAL_LIST_CLASS = "withdrawal-list";
const WITHDRAWAL_ITEM_CLASS = "withdrawal-list__item";
const DATE_FORMAT = "DD.MM.YYYY kk:mm";
const WITHDRAWALS_SPINNER_CLASS = "withdrawals-spinner";
const DISPLAY_NONE_CLASS = "d-none";
const NO_WITHDRAWALS_LABEL_CLASS = "no-withdrawals-label";
const MAKE_WITHDRAWAL_FORM_CLASS = "make-withdrawal-form";
const AMOUNT_INPUT_ID = "withdrawal-amount";
const NUMBER_OF_DECIMAL_POINTS = 2;
const MAKE_WITHDRAWAL_SPINNER_CLASS = "make-withdrawal-spinner";
const MAKE_WITHDRAWAL_INVALID_CLASS = "make-withdrawal-invalid";

const sortWithdrawalsByDate = (gotWithdrawals) => {
  return gotWithdrawals.sort((withd1, withd2) => Date.parse(withd1.date) - Date.parse(withd2.date)).reverse();
};

const getWithdrawalItem = (withdrawalObj) => {
  const withdrawalItem = document.createElement("li");
  withdrawalItem.classList.add(WITHDRAWAL_ITEM_CLASS);

  const date = moment(withdrawalObj.date).format(DATE_FORMAT);
  withdrawalItem.innerHTML = `<p><span>-${withdrawalObj.amount} </span>${date}</p>`

  return withdrawalItem;
};

const getListOfWithdrawals = (gotWithdrawals) => {
  return gotWithdrawals.map((withdrawalObj) => getWithdrawalItem(withdrawalObj));
};

const setInvalidUi = (message, spinner) => {
  const invalidElem = document.querySelector(`.${MAKE_TRANSFER_INVALID_CLASS}`);
  invalidElem.innerText = message;
  invalidElem.classList.remove(DISPLAY_NONE_CLASS);

  spinner.classList.add(DISPLAY_NONE_CLASS);
};

const resetUi = (amountInput, spinner) => {
  amountInput.value = "";
  spinner.classList.add(DISPLAY_NONE_CLASS);

  const invalidElem = document.querySelector(`.${MAKE_WITHDRAWAL_INVALID_CLASS}`);
  invalidElem.innerText = "";

  if (!invalidElem.classList.contains(DISPLAY_NONE_CLASS)) {
    invalidElem.classList.add(DISPLAY_NONE_CLASS);
  }
};

const onMakeWithdrawalFormSubmit = async (e, accessToken) => {
  e.preventDefault();

  const amountInput = document.getElementById(AMOUNT_INPUT_ID);
  const amountValue = parseFloat(amountInput.value).toFixed(NUMBER_OF_DECIMAL_POINTS);

  const makeWithdrawalSpinner = document.querySelector(`.${MAKE_WITHDRAWAL_SPINNER_CLASS}`);
  makeWithdrawalSpinner.classList.remove(DISPLAY_NONE_CLASS);

  let makeWithdrawalResult = null;
  try {
    makeWithdrawalResult = await axios.post(POST_WITHDRAWAL_URL,
      {
        amount: amountValue
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    makeWithdrawalResult = makeWithdrawalResult.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      setInvalidUi(error.response.data.message, makeWithdrawalSpinner);
      return;
    }
  }

  resetUi(amountInput, makeWithdrawalSpinner);

  const noWithdrawalsLabel = document.querySelector(`.${NO_WITHDRAWALS_LABEL_CLASS}`)
  if (!noWithdrawalsLabel.classList.contains(DISPLAY_NONE_CLASS)) {
    noWithdrawalsLabel.classList.add(DISPLAY_NONE_CLASS);
  }

  const withdrawalList = document.querySelector(`.${WITHDRAWAL_LIST_CLASS}`)
  const newDepositItem = getWithdrawalItem(makeWithdrawalResult);
  withdrawalList.prepend(newDepositItem);
};

const withdrawals = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  let gotWithdrawals = [];
  try {
    gotWithdrawals = await axios.get(GET_WITHDRAWALS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    gotWithdrawals = gotWithdrawals.data
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      console.log(error);
      return;
    }
  }

  const spinner = document.querySelector(`.${WITHDRAWALS_SPINNER_CLASS}`);
  spinner.classList.add(DISPLAY_NONE_CLASS);

  if (gotWithdrawals.length === 0) {
    const noWithdrawalsLabel = document.querySelector(`.${NO_WITHDRAWALS_LABEL_CLASS}`)
    noWithdrawalsLabel.classList.remove(DISPLAY_NONE_CLASS);
  } else {
    const withdrawalList = document.querySelector(`.${WITHDRAWAL_LIST_CLASS}`);
    const sortedGotWithdrawals = sortWithdrawalsByDate(gotWithdrawals);
    const withdrawalItems = getListOfWithdrawals(sortedGotWithdrawals)
    withdrawalList.append(...withdrawalItems);
  }

  const makeWithdrawalForm = document.querySelector(`.${MAKE_WITHDRAWAL_FORM_CLASS}`);
  makeWithdrawalForm.addEventListener("submit", async (e) => await onMakeWithdrawalFormSubmit(e, accessToken));
};

export default withdrawals;
