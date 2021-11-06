import axios from "axios";
import {backendUrl} from "./urls";
import Item from "./elements/item";

const newItem = () => {
    const addItemModal = document.getElementById("add-item-modal");
    addItemModal.addEventListener("show.bs.modal", (e) => {
        const button = e.relatedTarget;
        const groupId = button.getAttribute("data-group-id");
        const createNewItemBtn = document.getElementById("create-new-item-btn");
        createNewItemBtn.setAttribute("data-group-id", groupId);
    });

    const allInputs = addItemModal.querySelectorAll("input, textarea");

    const resetValidation = (input) => {
        if (input) {
            input.classList.remove("is-invalid");

            const invalidFeedbackId = input.getAttribute("aria-describedby");
            const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
            invalidFeedbackElem.innerText = "";
            invalidFeedbackElem.classList.remove("d-block");
        } else {
            allInputs.forEach((input) => {
                input.classList.remove("is-invalid");

                const invalidFeedbackId = input.getAttribute("aria-describedby");
                const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
                invalidFeedbackElem.innerText = "";
                invalidFeedbackElem.classList.remove("d-block");
            });
        }
    };

    const resetAllFields = () => {
        allInputs.forEach((input) => {
            input.value = "";
            resetValidation(input);
        });
    };

    addItemModal.addEventListener("hidden.bs.modal", () => {
        resetAllFields();
    });

    const validateAllFields = () => {
        let areValid = true;

        allInputs.forEach((input) => {
            if (input.value === "") {
                areValid = false;
                input.classList.add("is-invalid");

                if (input.getAttribute("id") === "new-item-label-input") {
                    const newItemQuantityInvalidFeedbackElem = document.getElementById("validationNewItemQuantityFeedback");
                    if (newItemQuantityInvalidFeedbackElem.innerText.length > 1) {
                        return;
                    }
                }

                const invalidFeedbackId = input.getAttribute("aria-describedby");
                const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
                invalidFeedbackElem.innerText = "Поле не може бути пустим."
                invalidFeedbackElem.classList.add("d-block");
            }
        });

        const newItemPriceInput = document.getElementById("new-item-price-input");
        const newItemPriceInputValue = parseFloat(parseFloat(newItemPriceInput.value).toFixed(2));
        if (!isNaN(newItemPriceInputValue) && newItemPriceInputValue <= 0) {
            newItemPriceInput.classList.add("is-invalid");
            const invalidFeedbackId = newItemPriceInput.getAttribute("aria-describedby");
            const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
            invalidFeedbackElem.innerText = "Мінімальна ціна — 1 грн."
            invalidFeedbackElem.classList.add("d-block");
        }

        const newItemQuantityInput = document.getElementById("new-item-quantity-input");
        const newItemQuantityInputValue = parseFloat(parseFloat(newItemQuantityInput.value).toFixed());
        if (!isNaN(newItemQuantityInputValue) && newItemQuantityInputValue < 0) {
            newItemQuantityInput.classList.add("is-invalid");
            const invalidFeedbackId = newItemQuantityInput.getAttribute("aria-describedby");
            const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
            invalidFeedbackElem.innerText = "Кількість товару не може бути від'ємною.";
            invalidFeedbackElem.classList.add("d-block");
        }

        const newItemLabelInput = document.getElementById("new-item-label-input");
        if (newItemLabelInput.value.length > 10) {
            newItemLabelInput.classList.add("is-invalid");
            const invalidFeedbackId = newItemLabelInput.getAttribute("aria-describedby");
            const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
            invalidFeedbackElem.innerText = "Максимальна довжина підпису — 10 символів.";
            invalidFeedbackElem.classList.add("d-block");
        }

        return areValid;
    };

    const createItemBtn = document.getElementById("create-new-item-btn");
    createItemBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        resetValidation();

        const areValid = validateAllFields();
        if (!areValid) {
            return;
        }

        const name = document.getElementById("new-item-name-input").value;
        const description = document.getElementById("new-item-descr-input").value;
        const manufacturer = document.getElementById("new-item-manuf-input").value;
        const price = parseFloat(parseFloat(document.getElementById("new-item-price-input").value).toFixed(2));
        const quantity = parseFloat(parseFloat(document.getElementById("new-item-quantity-input").value).toFixed(2));
        const label = document.getElementById("new-item-label-input").value;
        const groupId = parseInt(createItemBtn.getAttribute("data-group-id"));

        const postingObject = {
            name,
            description,
            manufacturer,
            price,
            quantity,
            label,
            groupId
        };

        let result;
        try {
            result = await axios.post(`${backendUrl}/items`, postingObject)
        } catch (error) {
            const newItemNameInput = document.getElementById("new-item-name-input");
            newItemNameInput.classList.add("is-invalid");

            const invalidFeedbackId = newItemNameInput.getAttribute("aria-describedby");
            const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
            invalidFeedbackElem.innerText = error.response.data.message;
            invalidFeedbackElem.classList.add("d-block");

            return;
        }

        const groupPane = document.getElementById(`list-${groupId}`);
        const emptyLabel = groupPane.querySelector(".empty-group");
        let groupItemsList;
        if (emptyLabel) {
            emptyLabel.remove();

            groupItemsList = document.createElement("div");
            groupItemsList.classList.add("row", "row-cols-1", "row-cols-md-3", "g-4", "group-items-list");

            groupPane.appendChild(groupItemsList);
        } else {
            groupItemsList = document.querySelector(`#list-${groupId} .group-items-list`);
        }

        groupItemsList.appendChild(new Item(result.data).getPreviewElement());

        const modal = bootstrap.Modal.getInstance(addItemModal);
        modal.hide();
    });
};

export default newItem;
