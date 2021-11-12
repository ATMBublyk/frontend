import axios from "axios";
import { backendUrl } from "../links";
import handleInvalidToken from "./handle-invalid-token";
import moment from "moment";

const GET_TRANSFERS_URL = `${backendUrl}/transfers`;
const POST_TRANSFER_URL = `${backendUrl}/transfer`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const TRANSFER_LIST_CLASS = "transfer-list";
const TRANSFER_ITEM_CLASSES = [
  "transfer-list__item",
  "d-flex",
  "flex-column",
  "align-items-start",
];
const DATE_FORMAT = "DD.MM.YYYY HH:mm";
const TRANSFERS_SPINNER_CLASS = "transfers-spinner";
const DISPLAY_NONE_CLASS = "d-none";
const NO_TRANSFERS_LABEL_CLASS = "no-transfers-label";
const MAKE_TRANSFER_FORM_CLASS = "make-transfer-form";
const AMOUNT_INPUT_ID = "transfer-amount";
const DESTINATION_CARD_INPUT_ID = "transfer-destination-card";
const NUMBER_OF_DECIMAL_POINTS = 2;
const MAKE_TRANSFER_SPINNER_CLASS = "make-transfer-spinner";
const MAKE_TRANSFER_INVALID_CLASS = "make-transfer-invalid";

const AMOUNT_COLOR_CLASS = {
  GREEN: "transfer-list__item-amount--green",
  RED: "transfer-list__item-amount--red",
};

const TRANSFER_TYPE = {
  SINGLE: "Single",
  REGULAR: "Regular",
  AUTO: "Auto",
  NOT_MINE: "Not mine",
};

const sortTransfersByDate = (gotTransfers) => {
  return gotTransfers
    .sort((tran1, tran2) => Date.parse(tran1.date) - Date.parse(tran2.date))
    .reverse();
};

const getTransferType = (transferObj) => {
  if (transferObj.isRegular) {
    return TRANSFER_TYPE.REGULAR;
  }

  if (transferObj.isAuto) {
    return TRANSFER_TYPE.AUTO;
  }

  if (transferObj.isMyPayment) {
    return TRANSFER_TYPE.SINGLE;
  }

  return TRANSFER_TYPE.NOT_MINE;
};

const getTransferItem = (transferObj) => {
  const transferItem = document.createElement("li");
  transferItem.classList.add(...TRANSFER_ITEM_CLASSES);

  const date = moment.utc(transferObj.date).local().format(DATE_FORMAT);
  const transferType = getTransferType(transferObj);
  const amountColorClass = transferObj.isMyPayment
    ? AMOUNT_COLOR_CLASS.RED
    : AMOUNT_COLOR_CLASS.GREEN;
  const amountSign = amountColorClass === AMOUNT_COLOR_CLASS.RED ? "-" : "+";
  const amountDirection =
    amountColorClass === AMOUNT_COLOR_CLASS.RED ? "to" : "from";
  const cardNumber = transferObj.card.match(/.{1,4}/g).join(" ");
  const amount = parseFloat(transferObj.amount).toFixed(
    NUMBER_OF_DECIMAL_POINTS
  );

  if (transferType === TRANSFER_TYPE.NOT_MINE) {
    transferItem.innerHTML = `
                        <p class="transfer-list__item-date">${date}</p>
                        <p class="transfer-list__item-info"><span class="transfer-list__item-amount  ${amountColorClass}">${amountSign}${amount} </span> ${amountDirection} ${cardNumber}</p>
    `;
  } else {
    transferItem.innerHTML = `
                        <p class="transfer_list__transfer-type">${transferType}</p>
                        <p class="transfer-list__item-date">${date}</p>
                        <p class="transfer-list__item-info"><span class="transfer-list__item-amount  ${amountColorClass}">${amountSign}${amount} </span> ${amountDirection} ${cardNumber}</p>
                        `;
  }

  return transferItem;
};

const getListOfTransfers = (gotTransfers) => {
  return gotTransfers.map((depositObj) => getTransferItem(depositObj));
};

const setInvalidUi = (message, spinner) => {
  const invalidElem = document.querySelector(`.${MAKE_TRANSFER_INVALID_CLASS}`);
  invalidElem.innerText = message;
  invalidElem.classList.remove(DISPLAY_NONE_CLASS);

  spinner.classList.add(DISPLAY_NONE_CLASS);
};

const resetUi = (amountInput, destinationCard, spinner) => {
  amountInput.value = "";
  destinationCard.value = "";
  spinner.classList.add(DISPLAY_NONE_CLASS);

  const invalidElem = document.querySelector(`.${MAKE_TRANSFER_INVALID_CLASS}`);
  invalidElem.innerText = "";

  if (!invalidElem.classList.contains(DISPLAY_NONE_CLASS)) {
    invalidElem.classList.add(DISPLAY_NONE_CLASS);
  }
};

const onMakeTransferFormSubmit = async (e, accessToken) => {
  e.preventDefault();

  const amountInput = document.getElementById(AMOUNT_INPUT_ID);
  const amountValue = parseFloat(amountInput.value).toFixed(
    NUMBER_OF_DECIMAL_POINTS
  );

  const destinationCardInput = document.getElementById(
    DESTINATION_CARD_INPUT_ID
  );
  const destinationCardValue = destinationCardInput.value;

  const makeTransferSpinner = document.querySelector(
    `.${MAKE_TRANSFER_SPINNER_CLASS}`
  );
  makeTransferSpinner.classList.remove(DISPLAY_NONE_CLASS);

  let makeTransferResult = null;
  try {
    makeTransferResult = await axios.post(
      POST_TRANSFER_URL,
      {
        destinationCard: destinationCardValue,
        amount: amountValue,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    makeTransferResult = makeTransferResult.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      setInvalidUi(error.response.data.message, makeTransferSpinner);
      return;
    }
  }

  resetUi(amountInput, destinationCardInput, makeTransferSpinner);

  const noTransfersLabel = document.querySelector(
    `.${NO_TRANSFERS_LABEL_CLASS}`
  );
  if (!noTransfersLabel.classList.contains(DISPLAY_NONE_CLASS)) {
    noTransfersLabel.classList.add(DISPLAY_NONE_CLASS);
  }

  const transferList = document.querySelector(`.${TRANSFER_LIST_CLASS}`);
  const newTransferItem = getTransferItem(makeTransferResult);
  transferList.prepend(newTransferItem);
};

const transfers = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  let gotTransfers = [];
  try {
    gotTransfers = await axios.get(GET_TRANSFERS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    gotTransfers = gotTransfers.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      console.log(error);
      return;
    }
  }

  const spinner = document.querySelector(`.${TRANSFERS_SPINNER_CLASS}`);
  spinner.classList.add(DISPLAY_NONE_CLASS);

  if (gotTransfers.length === 0) {
    const noTransfersLabel = document.querySelector(
      `.${NO_TRANSFERS_LABEL_CLASS}`
    );
    noTransfersLabel.classList.remove(DISPLAY_NONE_CLASS);
  } else {
    const transferList = document.querySelector(`.${TRANSFER_LIST_CLASS}`);
    const sortedGotTransfers = sortTransfersByDate(gotTransfers);
    const transferItems = getListOfTransfers(sortedGotTransfers);
    transferList.append(...transferItems);
  }

  const makeTransferForm = document.querySelector(
    `.${MAKE_TRANSFER_FORM_CLASS}`
  );
  makeTransferForm.addEventListener(
    "submit",
    async (e) => await onMakeTransferFormSubmit(e, accessToken)
  );
};

export default transfers;
