import axios from "axios";
import {backendUrl} from "../links";
import handleInvalidToken from "./handle-invalid-token";
import moment from "moment";

const GET_DEPOSITS_URL = `${backendUrl}/deposits`;
const POST_DEPOSIT_URL = `${backendUrl}/deposit`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const DEPOSIT_LIST_CLASS = "deposit-list";
const DEPOSIT_ITEM_CLASS = "deposit-list__item";
const DATE_FORMAT = "DD.MM.YYYY kk:mm";
const DEPOSITS_SPINNER_CLASS = "deposits-spinner";
const DISPLAY_NONE_CLASS = "d-none";
const NO_DEPOSITS_LABEL_CLASS = "no-deposits-label";
const MAKE_DEPOSIT_FORM_CLASS = "make-deposit-form";
const AMOUNT_INPUT_ID = "deposit-amount";
const NUMBER_OF_DECIMAL_POINTS = 2;
const MAKE_DEPOSIT_SPINNER_CLASS = "make-deposit-spinner";
const MAKE_DEPOSIT_INVALID_CLASS = "make-deposit-invalid";

const sortDepositsByDate = (gotDeposits) => {
  return gotDeposits.sort((dep1, dep2) => Date.parse(dep1.date) - Date.parse(dep2.date)).reverse();
};

const getDepositItem = (depositObj) => {
  const depositItem = document.createElement("li");
  depositItem.classList.add(DEPOSIT_ITEM_CLASS);

  const date = moment(depositObj.date).format(DATE_FORMAT);
  depositItem.innerHTML = `<p><span>+${depositObj.amount} </span>${date}</p>`

  return depositItem;
};

const getListOfDeposits = (gotDeposits) => {
  return gotDeposits.map((depositObj) => getDepositItem(depositObj));
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

  const invalidElem = document.querySelector(`.${MAKE_DEPOSIT_INVALID_CLASS}`);
  invalidElem.innerText = "";

  if (!invalidElem.classList.contains(DISPLAY_NONE_CLASS)) {
    invalidElem.classList.add(DISPLAY_NONE_CLASS);
  }
};

const onMakeDepositFormSubmit = async (e, accessToken) => {
  e.preventDefault();

  const amountInput = document.getElementById(AMOUNT_INPUT_ID);
  const amountValue = parseFloat(amountInput.value).toFixed(NUMBER_OF_DECIMAL_POINTS);

  const makeDepositSpinner = document.querySelector(`.${MAKE_DEPOSIT_SPINNER_CLASS}`);
  makeDepositSpinner.classList.remove(DISPLAY_NONE_CLASS);

  let makeDepositResult = null;
  try {
    makeDepositResult = await axios.post(POST_DEPOSIT_URL,
      {
        amount: amountValue
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    makeDepositResult = makeDepositResult.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      setInvalidUi(error.response.data.message, makeDepositSpinner);
      return;
    }
  }

  resetUi(amountInput, makeDepositSpinner);

  const noDepositsLabel = document.querySelector(`.${NO_DEPOSITS_LABEL_CLASS}`)
  if (!noDepositsLabel.classList.contains(DISPLAY_NONE_CLASS)) {
    noDepositsLabel.classList.add(DISPLAY_NONE_CLASS);
  }

  const depositList = document.querySelector(`.${DEPOSIT_LIST_CLASS}`)
  const newDepositItem = getDepositItem(makeDepositResult);
  depositList.prepend(newDepositItem);
};

const deposits = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  let gotDeposits = [];
  try {
    gotDeposits = await axios.get(GET_DEPOSITS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    gotDeposits = gotDeposits.data
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      console.log(error);
      return;
    }
  }

  const spinner = document.querySelector(`.${DEPOSITS_SPINNER_CLASS}`);
  spinner.classList.add(DISPLAY_NONE_CLASS);

  if (gotDeposits.length === 0) {
    const noDepositsLabel = document.querySelector(`.${NO_DEPOSITS_LABEL_CLASS}`)
    noDepositsLabel.classList.remove(DISPLAY_NONE_CLASS);
  } else {
    const depositList = document.querySelector(`.${DEPOSIT_LIST_CLASS}`);
    const sortedGotDeposits = sortDepositsByDate(gotDeposits);
    const depositItems = getListOfDeposits(sortedGotDeposits)
    depositList.append(...depositItems);
  }

  const makeDepositForm = document.querySelector(`.${MAKE_DEPOSIT_FORM_CLASS}`);
  makeDepositForm.addEventListener("submit", async (e) => await onMakeDepositFormSubmit(e, accessToken));
};

export default deposits;
