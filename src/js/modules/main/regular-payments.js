import axios from "axios";
import { backendUrl } from "../links";
import handleInvalidToken from "./handle-invalid-token";
import moment from "moment";
import dateForDateTimeInputValue from "../utils/date-for-datetime-input-value";

const GET_REGULAR_PAYMENTS_URL = `${backendUrl}/regular-transfers`;
const POST_PUT_DELETE_REGULAR_PAYMENT_URL = `${backendUrl}/regular-transfer`;
const ACCESS_TOKEN_ITEM_NAME = "accessToken";
const REGULAR_PAYMENT_LIST_CLASS = "regular-payments__card-list";
const REGULAR_PAYMENT_CARD_CLASS = "regular-payments__card";
const NO_REGULAR_PAYMENTS_LABEL_CLASS = "no-regular-payments-label";
const REGULAR_PAYMENTS_SPINNER_CLASS = "regular-payments-spinner";
const DISPLAY_NONE_CLASS = "d-none";
const REGULAR_PAYMENT_ITEM_CLASSES = ["col"];
const NUMBER_OF_DECIMAL_POINTS = 2;
const DATE_FORMAT = "DD.MM.YYYY HH:mm";
const ADD_REGULAR_PAYMENT_FORM_CLASS = "add-regular-payment-form";
const DESTINATION_CARD_INPUT_ID = "add-regular-payment-destination-card";
const AMOUNT_INPUT_ID = "add-regular-payment-amount";
const ADD_REGULAR_PAYMENT_PERIODICITY_CHECKED_RADIO_SELECTOR =
  ".add-regular-payment-modal__periodicity-radio:checked";
const EDIT_REGULAR_PAYMENT_PERIODICITY_CHECKED_RADIO_SELECTOR =
  ".edit-regular-payment-modal__periodicity-radio:checked";
const FIRST_PERIODICITY_RADIO_SELECTOR =
  ".add-regular-payment-modal__periodicity-radio:first-child";
const FIRST_PAYMENT_DATE_INPUT_ID = "add-regular-payment-first-payment-date";
const ADD_REGULAR_PAYMENT_SPINNER_CLASS = "add-regular-payment-spinner";
const EDIT_REGULAR_PAYMENT_SPINNER_CLASS = "edit-regular-payment-spinner";
const MINUTES_FROM_CURRENT_TIME_TO_ADD = 30;
const ADD_REGULAR_PAYMENT_INVALID_CLASS = "add-regular-payment-invalid";
const EDIT_REGULAR_PAYMENT_INVALID_CLASS = "edit-regular-payment-invalid";
const ADD_REGULAR_PAYMENT_MODAL_ID = "add-regular-payment-modal";
const REGULAR_PAYMENT_CARD_PERIODICITY_CLASS =
  "regular-payments__card-periodicity";
const REGULAR_PAYMENT_CARD_DATE_CLASS = "regular-payments__card-date";
const REGULAR_PAYMENT_CARD_AMOUNT_CLASS = "regular-payments__card-amount";
const REGULAR_PAYMENT_CARD_DESTINATION_CARD_CLASS =
  "regular-payments__card-destination-card";
const EDIT_REGULAR_PAYMENT_MODAL_ID = "edit-regular-payment-modal";
const EDIT_REGULAR_PAYMENT_DESTINATION_CARD =
  "edit-regular-payment-destination-card";
const EDIT_REGULAR_PAYMENT_AMOUNT = "edit-regular-payment-amount";
const EDIT_REGULAR_PAYMENT_DATE_ID = "edit-regular-payment-first-payment-date";
const EDIT_REGULAR_PAYMENT_PERIODICITY_COMMON_PART =
  "edit-regular-payment-periodicity-";
const EDIT_REGULAR_PAYMENT_SAVE_BTN = "edit-regular-payment-modal__save-btn";
const EDIT_REGULAR_PAYMENT_PERIODICITY_RADIO_CLASS =
  "edit-regular-payment-modal__periodicity-radio";
const EDIT_REGULAR_PAYMENT_TITLE_CLASS = "edit-regular-payment-modal__title";
const REGULAR_PAYMENT_CARD_EDIT_BTN = "regular-payments__card-edit-btn";
const REMOVE_REGULAR_PAYMENT_BTN_CLASS =
  "edit-regular-payment-modal__remove-btn";
const REMOVE_REGULAR_PAYMENT_MODAL_ID = "remove-regular-payment-modal";
const REMOVE_REGULAR_PAYMENT_CONFIRMATIVE_QUESTION_ITEM_CLASS =
  "remove-regular-payment-modal__confirmative-question";
const REMOVE_REGULAR_PAYMENT_REMOVE_FORM_CLASS =
  "remove-regular-payment-modal__remove-form";
const REMOVE_REGULAR_PAYMENT_CANCEL_BTN_CLASS =
  "remove-regular-payment-modal__cancel-btn";
const REMOVE_REGULAR_PAYMENT_SPINNER_CLASS = "remove-regular-payment-spinner";
const REMOVE_REGULAR_PAYMENT_CLOSE_BTN_CLASS =
  "remove-regular-payment-modal__close-btn";

const ACTION = {
  ADD: "add",
  UPDATE: "update",
};

const setInvalidUi = (action, message, spinner, invalidClass) => {
  const invalidElem = document.querySelector(`.${invalidClass}`);
  invalidElem.innerText = message;
  invalidElem.classList.remove(DISPLAY_NONE_CLASS);

  spinner.classList.add(DISPLAY_NONE_CLASS);
};

const resetUi = (
  action,
  {
    destinationCardItem,
    amountItem,
    firstPeriodicityRadioItem,
    periodicityCheckedRadioSelector,
    firstPaymentDateItem,
    regularPaymentSpinner,
    invalidItemClass,
  }
) => {
  if (action === ACTION.ADD) {
    destinationCardItem.value = "";

    amountItem.value = "";

    const checkedPeriodicityRadio = document.querySelector(
      periodicityCheckedRadioSelector
    );

    checkedPeriodicityRadio.checked = false;

    firstPeriodicityRadioItem.checked = true;

    firstPaymentDateItem.value = dateForDateTimeInputValue(
      moment().add(MINUTES_FROM_CURRENT_TIME_TO_ADD, "minutes").toDate()
    );
  }

  regularPaymentSpinner.classList.add(DISPLAY_NONE_CLASS);

  const invalidElem = document.querySelector(`.${invalidItemClass}`);
  invalidElem.innerText = "";

  if (!invalidElem.classList.contains(DISPLAY_NONE_CLASS)) {
    invalidElem.classList.add(DISPLAY_NONE_CLASS);
  }
};

const updateCardItem = (cardToUpdate, regularPaymentObj) => {
  const destinationCard = regularPaymentObj.destinationCard
    .match(/.{1,4}/g)
    .join(" ");
  const amount = parseFloat(regularPaymentObj.amount).toFixed(
    NUMBER_OF_DECIMAL_POINTS
  );
  const periodicity =
    regularPaymentObj.periodicity[0].toUpperCase() +
    regularPaymentObj.periodicity.substring(1).toLowerCase();

  const firstPaymentDateForDatetimeLocal = dateForDateTimeInputValue(
    moment.utc(regularPaymentObj.firstPaymentDate).local().toDate()
  );

  const firstPaymentDate = moment
    .utc(regularPaymentObj.firstPaymentDate)
    .local()
    .format(DATE_FORMAT);

  const cardToUpdateDestinationCardItem = cardToUpdate.querySelector(
    `.${REGULAR_PAYMENT_CARD_DESTINATION_CARD_CLASS}`
  );
  cardToUpdateDestinationCardItem.innerText = destinationCard;

  const cardToUpdateAmountItem = cardToUpdate.querySelector(
    `.${REGULAR_PAYMENT_CARD_AMOUNT_CLASS}`
  );
  cardToUpdateAmountItem.innerText = amount;

  const cardToUpdatePeriodicityItem = cardToUpdate.querySelector(
    `.${REGULAR_PAYMENT_CARD_PERIODICITY_CLASS}`
  );
  cardToUpdatePeriodicityItem.innerText = periodicity;

  const cardToUpdateFirstPaymentDate = cardToUpdate.querySelector(
    `.${REGULAR_PAYMENT_CARD_DATE_CLASS}`
  );
  cardToUpdateFirstPaymentDate.innerText = firstPaymentDate;
  cardToUpdateFirstPaymentDate.dataset.datetimeLocal =
    firstPaymentDateForDatetimeLocal;
};

const onRegularPaymentFormSubmit = async (
  e,
  accessToken,
  action,
  {
    regularPaymentList,
    regularPaymentId,
    destinationCardItem,
    amountItem,
    firstPaymentDateItem,
    regularPaymentSpinner,
    periodicityCheckedRadioSelector,
    regularPaymentModalId,
  }
) => {
  e.preventDefault();

  const destinationCardValue = destinationCardItem.value;

  const amountItemValue = parseFloat(amountItem.value).toFixed(
    NUMBER_OF_DECIMAL_POINTS
  );

  const periodicityItem = document.querySelector(
    periodicityCheckedRadioSelector
  );
  const periodicityItemValue = periodicityItem.value;

  let firstPaymentDateItemValue = new Date(
    firstPaymentDateItem.value
  ).toISOString();
  firstPaymentDateItemValue = firstPaymentDateItemValue.substr(
    0,
    firstPaymentDateItemValue.length - 1
  );

  regularPaymentSpinner.classList.remove(DISPLAY_NONE_CLASS);

  let gotRegularPayment;
  const method = action === ACTION.ADD ? "post" : "put";
  let url = POST_PUT_DELETE_REGULAR_PAYMENT_URL;
  if (action === ACTION.UPDATE) {
    url = `${url}/${regularPaymentId}`;
  }

  try {
    gotRegularPayment = await axios[method](
      url,
      {
        destinationCard: destinationCardValue,
        amount: amountItemValue,
        periodicity: periodicityItemValue,
        firstPaymentDate: firstPaymentDateItemValue,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    gotRegularPayment = gotRegularPayment.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      switch (action) {
        case ACTION.ADD:
          setInvalidUi(
            action,
            error.response.data.message,
            regularPaymentSpinner,
            ADD_REGULAR_PAYMENT_INVALID_CLASS
          );
          break;
        case ACTION.UPDATE:
          setInvalidUi(
            action,
            error.response.data.message,
            regularPaymentSpinner,
            EDIT_REGULAR_PAYMENT_INVALID_CLASS
          );
      }
      return;
    }
  }

  const regularPaymentModal = bootstrap.Modal.getInstance(
    document.getElementById(regularPaymentModalId)
  );

  regularPaymentModal.hide();

  switch (action) {
    case ACTION.ADD:
      const newRegularPaymentItem = getRegularPaymentItem(
        gotRegularPayment,
        accessToken,
        regularPaymentList
      );
      regularPaymentList.append(newRegularPaymentItem);

      const noRegularPaymentsLabel = document.querySelector(
        `.${NO_REGULAR_PAYMENTS_LABEL_CLASS}`
      );
      if (!noRegularPaymentsLabel.classList.contains(DISPLAY_NONE_CLASS)) {
        noRegularPaymentsLabel.classList.add(DISPLAY_NONE_CLASS);
      }

      break;
    case ACTION.UPDATE:
      const cardToUpdate = document.querySelector(
        `.${REGULAR_PAYMENT_CARD_CLASS}`
      );
      updateCardItem(cardToUpdate, gotRegularPayment);

      break;
  }
};

const getRegularPaymentItem = (
  regularPaymentObj,
  accessToken,
  regularPaymentList
) => {
  const regularPaymentItem = document.createElement("div");
  regularPaymentItem.classList.add(...REGULAR_PAYMENT_ITEM_CLASSES);

  const id = regularPaymentObj.id;
  const destinationCard = regularPaymentObj.destinationCard
    .match(/.{1,4}/g)
    .join(" ");
  const amount = parseFloat(regularPaymentObj.amount).toFixed(
    NUMBER_OF_DECIMAL_POINTS
  );
  const periodicity =
    regularPaymentObj.periodicity[0].toUpperCase() +
    regularPaymentObj.periodicity.substring(1).toLowerCase();

  const firstPaymentDateForDatetimeLocal = dateForDateTimeInputValue(
    moment.utc(regularPaymentObj.firstPaymentDate).local().toDate()
  );

  const firstPaymentDate = moment
    .utc(regularPaymentObj.firstPaymentDate)
    .local()
    .format(DATE_FORMAT);

  regularPaymentItem.innerHTML = `
                        <div class="card regular-payments__card" data-id="${id}">
                            <div class="card-body regular-payments__card-body d-flex flex-column align-items-start justify-content-between">
                                <div class="regular-payments__card-info d-flex flex-column align-items-start">
                                    <p class="regular-payments__card-periodicity">${periodicity}</p>
                                    <p class="regular-payments__card-date" data-datetime-local="${firstPaymentDateForDatetimeLocal}">Starting from ${firstPaymentDate}</p>
                                    <p class="regular-payments__card-amount-block"><span class="regular-payments__card-amount">${amount}</span> to <span class="regular-payments__card-destination-card">${destinationCard}</span></p>
                                </div>

                                <button type="button" class="btn btn-outline-primary regular-payments__card-edit-btn">Edit</button>
                            </div>
                        </div>
  `;

  const editBtn = regularPaymentItem.querySelector(
    `.${REGULAR_PAYMENT_CARD_EDIT_BTN}`
  );
  editBtn.addEventListener("click", (e) =>
    onEditRegularPayment(e, accessToken, regularPaymentList)
  );

  return regularPaymentItem;
};

const getRegularPaymentItems = (
  gotRegularPayments,
  accessToken,
  regularPaymentList
) => {
  return gotRegularPayments.map((regularPaymentObj) =>
    getRegularPaymentItem(regularPaymentObj, accessToken, regularPaymentList)
  );
};

const setDefaultFirstPaymentDate = () => {
  const firstPaymentDateItem = document.getElementById(
    FIRST_PAYMENT_DATE_INPUT_ID
  );

  firstPaymentDateItem.value = dateForDateTimeInputValue(
    moment().add(MINUTES_FROM_CURRENT_TIME_TO_ADD, "minutes").toDate()
  );
};

const onEditRegularPaymentInput = (
  e,
  saveBtn,
  defaultValue,
  isRadio = false
) => {
  if (isRadio) {
    if (e.target.value !== defaultValue) {
      saveBtn.removeAttribute("disabled");
    } else {
      if (!saveBtn.hasAttribute("disabled")) {
        saveBtn.setAttribute("disabled", "disabled");
      }
    }
  } else {
    const currentValue =
      typeof defaultValue == "number"
        ? parseFloat(e.target.value)
        : e.target.value;
    if (currentValue !== defaultValue) {
      saveBtn.removeAttribute("disabled");
    } else {
      if (!saveBtn.hasAttribute("disabled")) {
        saveBtn.setAttribute("disabled", "disabled");
      }
    }
  }
};

const onRemoveRegularPayment = (
  accessToken,
  regularPaymentId,
  destinationCardModalInput,
  amountModalInput
) => {
  const modal = document.getElementById(REMOVE_REGULAR_PAYMENT_MODAL_ID);
  const modalClone = modal.cloneNode(true);
  modal.parentNode.replaceChild(modalClone, modal);

  const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalClone);

  const confirmativeQuestionItem = document.querySelector(
    `.${REMOVE_REGULAR_PAYMENT_CONFIRMATIVE_QUESTION_ITEM_CLASS}`
  );

  const destinationCard = destinationCardModalInput.value
    .match(/.{1,4}/g)
    .join(" ");
  const amount = amountModalInput.value;

  confirmativeQuestionItem.innerHTML = `Are you sure you want to remove the regular payment of <strong>${amount}</strong> to <strong>${destinationCard}</strong>?`;

  const removeForm = document.querySelector(
    `.${REMOVE_REGULAR_PAYMENT_REMOVE_FORM_CLASS}`
  );

  const spinner = document.querySelector(
    `.${REMOVE_REGULAR_PAYMENT_SPINNER_CLASS}`
  );

  const deleteUrl = `${POST_PUT_DELETE_REGULAR_PAYMENT_URL}/${regularPaymentId}`;
  removeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    spinner.classList.remove(DISPLAY_NONE_CLASS);

    try {
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      if (error.response.status === 401) {
        handleInvalidToken();
        return;
      } else {
        console.log(error);
      }
    }

    spinner.classList.add(DISPLAY_NONE_CLASS);

    const removedPaymentCard = document.querySelector(
      `.${REGULAR_PAYMENT_CARD_CLASS}[data-id="${regularPaymentId}"]`
    );
    removedPaymentCard.parentNode.remove();

    const numberOfExistingRegularPayments = document.querySelectorAll(
      `.${REGULAR_PAYMENT_CARD_CLASS}`
    ).length;
    if (numberOfExistingRegularPayments === 0) {
      const noRegularPaymentsLabel = document.querySelector(
        `.${NO_REGULAR_PAYMENTS_LABEL_CLASS}`
      );
      noRegularPaymentsLabel.classList.remove(DISPLAY_NONE_CLASS);
    }

    bootstrapModal.hide();
  });
  const bootstrapEditRegularPaymentModal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(EDIT_REGULAR_PAYMENT_MODAL_ID)
  );

  const cancelBtn = document.querySelector(
    `.${REMOVE_REGULAR_PAYMENT_CANCEL_BTN_CLASS}`
  );
  cancelBtn.addEventListener("click", () => {
    bootstrapModal.hide();
    bootstrapEditRegularPaymentModal.show();
  });

  const closeModalBtn = document.querySelector(
    `.${REMOVE_REGULAR_PAYMENT_CLOSE_BTN_CLASS}`
  );
  closeModalBtn.addEventListener("click", () => {
    bootstrapModal.hide();
    bootstrapEditRegularPaymentModal.show();
  });

  bootstrapEditRegularPaymentModal.hide();
  bootstrapModal.show();
};

const onEditRegularPayment = (e, accessToken, regularPaymentList) => {
  const cardItem = e.target.parentNode.parentNode;
  const regularPaymentId = cardItem.dataset.id;

  const firstPaymentDate = cardItem.querySelector(
    `.${REGULAR_PAYMENT_CARD_DATE_CLASS}`
  ).dataset.datetimeLocal;

  const destinationCard = parseInt(
    cardItem
      .querySelector(`.${REGULAR_PAYMENT_CARD_DESTINATION_CARD_CLASS}`)
      .innerText.replaceAll(" ", "")
  );

  const amount = parseFloat(
    cardItem.querySelector(`.${REGULAR_PAYMENT_CARD_AMOUNT_CLASS}`).innerText
  );

  const periodicity = cardItem
    .querySelector(`.${REGULAR_PAYMENT_CARD_PERIODICITY_CLASS}`)
    .innerText.toLowerCase();

  const editRegularPaymentModal = document.getElementById(
    EDIT_REGULAR_PAYMENT_MODAL_ID
  );
  const editRegularPaymentModalClone = editRegularPaymentModal.cloneNode(true);
  editRegularPaymentModal.parentNode.replaceChild(
    editRegularPaymentModalClone,
    editRegularPaymentModal
  );

  const bootstrapEditRegularPaymentModal = bootstrap.Modal.getOrCreateInstance(
    editRegularPaymentModalClone
  );

  const saveBtn = document.querySelector(`.${EDIT_REGULAR_PAYMENT_SAVE_BTN}`);

  const titleModal = document.querySelector(
    `.${EDIT_REGULAR_PAYMENT_TITLE_CLASS}`
  );
  titleModal.dataset.id = regularPaymentId;

  const destinationCardModalInput = document.getElementById(
    EDIT_REGULAR_PAYMENT_DESTINATION_CARD
  );
  destinationCardModalInput.value = destinationCard;
  destinationCardModalInput.addEventListener("input", (e) =>
    onEditRegularPaymentInput(e, saveBtn, destinationCard)
  );

  const amountModalInput = document.getElementById(EDIT_REGULAR_PAYMENT_AMOUNT);
  amountModalInput.value = amount;
  amountModalInput.addEventListener("input", (e) =>
    onEditRegularPaymentInput(e, saveBtn, amount)
  );

  const periodicityModalRadio = document.getElementById(
    `${EDIT_REGULAR_PAYMENT_PERIODICITY_COMMON_PART}${periodicity}`
  );
  periodicityModalRadio.checked = true;
  const allPeriodicityRadioBtns = document.querySelectorAll(
    `.${EDIT_REGULAR_PAYMENT_PERIODICITY_RADIO_CLASS}`
  );
  allPeriodicityRadioBtns.forEach((radio) => {
    radio.addEventListener("change", (e) =>
      onEditRegularPaymentInput(e, saveBtn, periodicityModalRadio.value, true)
    );
  });

  const firstPaymentDateModalInput = document.getElementById(
    EDIT_REGULAR_PAYMENT_DATE_ID
  );

  const minDatetime = dateForDateTimeInputValue(new Date());
  firstPaymentDateModalInput.setAttribute("min", minDatetime);

  firstPaymentDateModalInput.value = firstPaymentDate;
  firstPaymentDateModalInput.addEventListener("input", (e) => {
    onEditRegularPaymentInput(e, saveBtn, firstPaymentDate);
  });

  const regularPaymentSpinner = document.querySelector(
    `.${EDIT_REGULAR_PAYMENT_SPINNER_CLASS}`
  );
  saveBtn.addEventListener(
    "click",
    async (e) =>
      await onRegularPaymentFormSubmit(e, accessToken, ACTION.UPDATE, {
        regularPaymentList,
        regularPaymentId,
        destinationCardItem: destinationCardModalInput,
        amountItem: amountModalInput,
        firstPaymentDateItem: firstPaymentDateModalInput,
        regularPaymentSpinner,
        periodicityCheckedRadioSelector:
          EDIT_REGULAR_PAYMENT_PERIODICITY_CHECKED_RADIO_SELECTOR,
        regularPaymentModalId: EDIT_REGULAR_PAYMENT_MODAL_ID,
      })
  );

  editRegularPaymentModalClone.addEventListener("hidden.bs.modal", () =>
    resetUi(ACTION.UPDATE, {
      regularPaymentSpinner,
      invalidItemClass: EDIT_REGULAR_PAYMENT_INVALID_CLASS,
    })
  );

  const removeRegularPaymentBtn = document.querySelector(
    `.${REMOVE_REGULAR_PAYMENT_BTN_CLASS}`
  );
  removeRegularPaymentBtn.addEventListener("click", () =>
    onRemoveRegularPayment(
      accessToken,
      regularPaymentId,
      destinationCardModalInput,
      amountModalInput
    )
  );

  bootstrapEditRegularPaymentModal.show();
};

const regularPayments = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM_NAME);

  let gotRegularPayments = [];
  try {
    gotRegularPayments = await axios.get(GET_REGULAR_PAYMENTS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    gotRegularPayments = gotRegularPayments.data;
  } catch (error) {
    if (error.response.status === 401) {
      handleInvalidToken();
      return;
    } else {
      console.log(error);
      return;
    }
  }

  const spinner = document.querySelector(`.${REGULAR_PAYMENTS_SPINNER_CLASS}`);
  spinner.classList.add(DISPLAY_NONE_CLASS);

  const regularPaymentList = document.querySelector(
    `.${REGULAR_PAYMENT_LIST_CLASS}`
  );
  if (gotRegularPayments.length === 0) {
    const noRegularPaymentsLabel = document.querySelector(
      `.${NO_REGULAR_PAYMENTS_LABEL_CLASS}`
    );
    noRegularPaymentsLabel.classList.remove(DISPLAY_NONE_CLASS);
  } else {
    const regularPaymentItems = getRegularPaymentItems(
      gotRegularPayments,
      accessToken,
      regularPaymentList
    );
    regularPaymentList.append(...regularPaymentItems);
  }

  setDefaultFirstPaymentDate();

  const destinationCardItem = document.getElementById(
    DESTINATION_CARD_INPUT_ID
  );

  const amountItem = document.getElementById(AMOUNT_INPUT_ID);

  const firstPaymentDateItem = document.getElementById(
    FIRST_PAYMENT_DATE_INPUT_ID
  );

  const firstPeriodicityRadioItem = document.querySelector(
    FIRST_PERIODICITY_RADIO_SELECTOR
  );

  const addRegularPaymentSpinner = document.querySelector(
    `.${ADD_REGULAR_PAYMENT_SPINNER_CLASS}`
  );

  const addRegularPaymentForm = document.querySelector(
    `.${ADD_REGULAR_PAYMENT_FORM_CLASS}`
  );

  addRegularPaymentForm.addEventListener(
    "submit",
    async (e) =>
      await onRegularPaymentFormSubmit(e, accessToken, ACTION.ADD, {
        regularPaymentList,
        destinationCardItem,
        amountItem,
        firstPaymentDateItem,
        regularPaymentSpinner: addRegularPaymentSpinner,
        periodicityCheckedRadioSelector:
          ADD_REGULAR_PAYMENT_PERIODICITY_CHECKED_RADIO_SELECTOR,
        regularPaymentModalId: ADD_REGULAR_PAYMENT_MODAL_ID,
      })
  );

  const addRegularPaymentModal = document.getElementById(
    ADD_REGULAR_PAYMENT_MODAL_ID
  );
  addRegularPaymentModal.addEventListener("hidden.bs.modal", () =>
    resetUi(ACTION.ADD, {
      destinationCardItem,
      amountItem,
      firstPaymentDateItem,
      firstPeriodicityRadioItem,
      periodicityCheckedRadioSelector:
        ADD_REGULAR_PAYMENT_PERIODICITY_CHECKED_RADIO_SELECTOR,
      regularPaymentSpinner: addRegularPaymentSpinner,
      invalidItemClass: ADD_REGULAR_PAYMENT_INVALID_CLASS,
    })
  );
};

export default regularPayments;
