import axios from "axios";
import {backendUrl} from "./urls";
import Item from "./elements/item";
// import {Modal} from "bootstrap";

const itemCard = () => {
    let itemNameInput;
    let itemDescrInput;
    let itemManufInput;
    let itemPriceInput;
    let itemLabelInput;

    let cancelItemNameAction;
    let cancelItemDescrAction;
    let cancelItemManufAction;
    let cancelItemPriceAction;
    let cancelItemLabelAction;

    let itemCard;

    const itemCardModal = document.getElementById("item-card-modal");
    itemCardModal.addEventListener("show.bs.modal", async (e) => {

        const button = e.relatedTarget;

        if (button.getAttribute("data-source") === "search") {
            const backToSearchBtn = document.querySelector(".back-to-search-btn");
            backToSearchBtn.classList.remove("d-none");
        }

        const itemId = button.parentNode.getAttribute("data-item-id")

        itemCard = await axios.get(`${backendUrl}/items/${itemId}`);
        itemCard = new Item(itemCard.data);

        const itemCardBody = document.querySelector(".item-card-body");
        itemCardBody.innerHTML = `               <div class="row">
                    <div class="col-7">
                        <form>
                            <div class="mb-3">
                                <label for="item-name-input" class="col-form-label fw-bold pt-0">Назва</label>
                                <div class="d-flex align-items-center">
                                    <input type="text" class="form-control item-card-field" id="item-name-input"
                                           value="${itemCard.name}" disabled aria-describedby="validationItemNameFeedback">
                                    <button class="edit-conf-btn ms-3" id="edit-item-name-btn" type="button">
                                        <span class="edit-icon"></span>
                                    </button>
                                    <div class="d-flex ms-3 d-none" id="conf-cancel-item-name-block">
                                        <button class="edit-conf-btn" id="conf-item-name-btn" type="submit">
                                            <span class="confirm-icon"></span>
                                        </button>
                                        <button class="edit-conf-btn ms-2" id="cancel-item-name-btn" type="button">
                                            <span class="cancel-icon"></span>
                                        </button>
                                    </div>
                                </div>
                               <div id="validationItemNameFeedback" class="invalid-feedback"></div> 
                            </div>
                        </form>
                        <form>
                            <div class="mb-3">
                                <label for="item-descr-input" class="col-form-label fw-bold">Опис</label>
                                <div class="d-flex align-items-start">
                                        <textarea class="form-control item-card-field" id="item-descr-input" rows="5"
                                                  disabled aria-describedby="validationItemDescrFeedback">${itemCard.description}</textarea>
                                    <button class="edit-conf-btn ms-3 mt-2" id="edit-item-descr-btn" type="button">
                                        <span class="edit-icon"></span>
                                    </button>
                                    <div class="d-flex ms-3 d-none mt-2" id="conf-cancel-item-descr-block">
                                        <button class="edit-conf-btn" id="conf-item-descr-btn" type="submit">
                                            <span class="confirm-icon"></span>
                                        </button>
                                        <button class="edit-conf-btn ms-2" id="cancel-item-descr-btn" type="button">
                                            <span class="cancel-icon"></span>
                                        </button>
                                    </div>
                                </div>
                               <div id="validationItemDescrFeedback" class="invalid-feedback"></div> 
                            </div>
                        </form>
                        <form>
                            <div class="mb-3">
                                <label for="item-manuf-input" class="col-form-label fw-bold">Виробник</label>
                                <div class="d-flex align-items-center">
                                    <input type="text" class="form-control item-card-field" id="item-manuf-input"
                                           value="${itemCard.manufacturer}" disabled aria-describedby="validationItemManufFeedback">
                                    <button class="edit-conf-btn ms-3" id="edit-item-manuf-btn" type="button">
                                        <span class="edit-icon"></span>
                                    </button>
                                    <div class="d-flex ms-3 d-none" id="conf-cancel-item-manuf-block">
                                        <button class="edit-conf-btn" id="conf-item-manuf-btn" type="submit">
                                            <span class="confirm-icon"></span>
                                        </button>
                                        <button class="edit-conf-btn ms-2" id="cancel-item-manuf-btn" type="button">
                                            <span class="cancel-icon"></span>
                                        </button>
                                    </div>
                                </div>
                               <div id="validationItemManufFeedback" class="invalid-feedback"></div> 
                            </div>
                        </form>
                        <form>
                            <div class="mb-3">
                                <label for="item-price-input" class="col-form-label fw-bold">Ціна (грн)</label>
                                <div class="d-flex align-items-center">
                                    <input type="number" class="form-control item-card-field" id="item-price-input"
                                           value="${itemCard.price}" min="1" disabled aria-describedby="validationItemPriceFeedback">
                                    <button class="edit-conf-btn ms-3" id="edit-item-price-btn" type="button">
                                        <span class="edit-icon"></span>
                                    </button>
                                    <div class="d-flex ms-3 d-none" id="conf-cancel-item-price-block">
                                        <button class="edit-conf-btn" id="conf-item-price-btn" type="submit">
                                            <span class="confirm-icon"></span>
                                        </button>
                                        <button class="edit-conf-btn ms-2" id="cancel-item-price-btn" type="button">
                                            <span class="cancel-icon"></span>
                                        </button>
                                    </div>
                                </div>
                               <div id="validationItemPriceFeedback" class="invalid-feedback"></div> 
                            </div>
                        </form>
                    </div>
                    <div class="col-5 ps-3">
                        <div class="d-flex align-items-baseline">
                            <p class="fs-6 mb-0 me-2"><b>Кількість:</b> <span class="item-card-quantity">${itemCard.quantity}</span></p>
                            <input type="text" class="form-control item-card-field w-25" id="item-quantity-input"
                               value="${itemCard.label}" disabled aria-describedby="validationItemLabelFeedback">
                            <button class="edit-conf-btn ms-3" id="edit-item-quantity-btn" type="button">
                                <span class="edit-icon"></span>
                            </button>
                            <div class="ms-3 d-none" id="conf-cancel-item-quantity-block">
                                <button class="edit-conf-btn" id="conf-item-quantity-btn" type="submit">
                                    <span class="confirm-icon"></span>
                                </button>
                                <button class="edit-conf-btn ms-2" id="cancel-item-quantity-btn" type="button">
                                    <span class="cancel-icon"></span>
                                </button>
                            </div>
                        </div>
                       <div id="validationItemLabelFeedback" class="invalid-feedback"></div> 
                        <form class="mt-3 mb-3">
                            <div class="input-group">
                                <input type="number" class="form-control" placeholder="(${itemCard.label})" id="increase-quantity-input"
                                       aria-label="додати товар на склад" aria-describedby="додати товар на склад" min="1">
                                <button class="btn btn-outline-success" type="submit" id="increase-quantity-btn">Додати</button>
                            </div>
                           <div id="validationIncreaseQuantityFeedback" class="invalid-feedback"></div> 
                        </form>
                        <form class="mb-3">
                            <div class="input-group">
                                <input type="number" class="form-control" placeholder="(${itemCard.label})" id="decrease-quantity-input"
                                       aria-label="списати товар зі складу" aria-describedby="списати товар зі складу" min="1">
                                <button class="btn btn-outline-success" type="submit" id="decrease-quantity-btn">Списати
                                </button>
                            </div>
                           <div id="validationDecreaseQuantityFeedback" class="invalid-feedback"></div> 
                        </form>
                    </div>
                </div>
                <div class="d-grid gap-2 col-2 mx-auto mt-5">
                    <button type="button" class="btn btn-outline-danger" data-bs-target="#delete-item-modal"
                            data-bs-toggle="modal" data-bs-dismiss="modal" data-item-id="${itemCard.id}">Видалити
                    </button>
                </div>`;

        itemNameInput = document.getElementById("item-name-input");
        const editItemNameBtn = document.getElementById("edit-item-name-btn");
        const confCancelItemNameBlock = document.getElementById("conf-cancel-item-name-block");
        const confItemNameBtn = document.getElementById("conf-item-name-btn");
        const cancelItemNameBtn = document.getElementById("cancel-item-name-btn");

        itemDescrInput = document.getElementById("item-descr-input");
        const editItemDescrBtn = document.getElementById("edit-item-descr-btn");
        const confCancelItemDescrBlock = document.getElementById("conf-cancel-item-descr-block");
        const confItemDescrBtn = document.getElementById("conf-item-descr-btn");
        const cancelItemDescrBtn = document.getElementById("cancel-item-descr-btn");

        itemManufInput = document.getElementById("item-manuf-input");
        const editItemManufBtn = document.getElementById("edit-item-manuf-btn");
        const confCancelItemManufBlock = document.getElementById("conf-cancel-item-manuf-block");
        const confItemManufBtn = document.getElementById("conf-item-manuf-btn");
        const cancelItemManufBtn = document.getElementById("cancel-item-manuf-btn");

        itemPriceInput = document.getElementById("item-price-input");
        const editItemPriceBtn = document.getElementById("edit-item-price-btn");
        const confCancelItemPriceBlock = document.getElementById("conf-cancel-item-price-block");
        const confItemPriceBtn = document.getElementById("conf-item-price-btn");
        const cancelItemPriceBtn = document.getElementById("cancel-item-price-btn");

        itemLabelInput = document.getElementById("item-quantity-input");
        const editItemLabelBtn = document.getElementById("edit-item-quantity-btn");
        const confCancelItemLabelBlock = document.getElementById("conf-cancel-item-quantity-block");
        const confItemLabelBtn = document.getElementById("conf-item-quantity-btn");
        const cancelItemLabelBtn = document.getElementById("cancel-item-quantity-btn");

        const increaseQuantityInput = document.getElementById("increase-quantity-input");
        const decreaseQuantityInput = document.getElementById("decrease-quantity-input");
        const increaseQuantityBtn = document.getElementById("increase-quantity-btn");
        const decreaseQuantityBtn = document.getElementById("decrease-quantity-btn");

        const resetItemNameStyles = () => {
            const itemNameInputValidationFeedback = document.getElementById("validationItemNameFeedback");

            itemNameInput.classList.remove("is-invalid");
            itemNameInputValidationFeedback.innerText = "";
            itemNameInputValidationFeedback.classList.remove("d-block");

            itemNameInput.toggleAttribute("disabled");
            confCancelItemNameBlock.classList.toggle("d-none");
            editItemNameBtn.classList.toggle("d-none");
        };

        const confItemNameAction = async (e) => {
            if (e) {
                e.preventDefault();
            }

            const itemNameInputValidationFeedback = document.getElementById("validationItemNameFeedback");

            if (itemNameInput.value.length === 0) {
                itemNameInput.classList.add("is-invalid");
                itemNameInputValidationFeedback.classList.add("d-block");
                itemNameInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (itemNameInput.value === itemCard.name) {
                resetItemNameStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "name": itemNameInput.value
                });
            } catch (error) {
                if (error.response) {
                    itemNameInput.classList.add("is-invalid");
                    itemNameInputValidationFeedback.classList.add("d-block");
                    itemNameInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.name = itemNameInput.value;
            const itemPreviewNameElement = document.querySelector(`div[data-item-id='${itemCard.id}'] .card-title`)
            itemPreviewNameElement.innerText = itemNameInput.value;

            resetItemNameStyles();
        };

        itemNameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                confItemNameAction();
            }
        });

        editItemNameBtn.addEventListener("click", (e) => {
            itemNameInput.toggleAttribute("disabled");
            editItemNameBtn.classList.toggle("d-none");
            confCancelItemNameBlock.classList.toggle("d-none");
        });

        confItemNameBtn.addEventListener("click", (e) => confItemNameAction(e));

        cancelItemNameAction = () => {
            itemNameInput.value = itemCard.name;
            resetItemNameStyles();
        };

        cancelItemNameBtn.addEventListener("click", cancelItemNameAction);

        const resetItemDescrStyles = () => {
            const itemDescrInputValidationFeedback = document.getElementById("validationItemDescrFeedback");

            itemDescrInput.classList.remove("is-invalid");
            itemDescrInputValidationFeedback.innerText = "";
            itemDescrInputValidationFeedback.classList.remove("d-block");

            itemDescrInput.toggleAttribute("disabled");
            confCancelItemDescrBlock.classList.toggle("d-none");
            editItemDescrBtn.classList.toggle("d-none");
        };

        editItemDescrBtn.addEventListener("click", (e) => {
            itemDescrInput.toggleAttribute("disabled");
            editItemDescrBtn.classList.toggle("d-none");
            confCancelItemDescrBlock.classList.toggle("d-none");
        });

        const confItemDescrAction = async (e) => {
            e.preventDefault();

            const itemDescrInputValidationFeedback = document.getElementById("validationItemDescrFeedback");

            if (itemDescrInput.value.length === 0) {
                itemDescrInput.classList.add("is-invalid");
                itemDescrInputValidationFeedback.classList.add("d-block");
                itemDescrInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (itemDescrInput.value === itemCard.name) {
                resetItemDescrStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "description": itemDescrInput.value
                });
            } catch (error) {
                if (error.response) {
                    itemDescrInput.classList.add("is-invalid");
                    itemDescrInputValidationFeedback.classList.add("d-block");
                    itemDescrInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.description = itemDescrInput.value;

            resetItemDescrStyles();
        };

        confItemDescrBtn.addEventListener("click", (e) => confItemDescrAction(e));

        cancelItemDescrAction = () => {
            itemDescrInput.value = itemCard.description;
            resetItemDescrStyles();
        };

        cancelItemDescrBtn.addEventListener("click", cancelItemDescrAction);

        const resetItemManufStyles = () => {
            const itemManufInputValidationFeedback = document.getElementById("validationItemManufFeedback");

            itemManufInput.classList.remove("is-invalid");
            itemManufInputValidationFeedback.innerText = "";
            itemManufInputValidationFeedback.classList.remove("d-block");

            itemManufInput.toggleAttribute("disabled");
            confCancelItemManufBlock.classList.toggle("d-none");
            editItemManufBtn.classList.toggle("d-none");
        };

        const confItemManufAction = async (e) => {
            if (e) {
                e.preventDefault();
            }
            const itemManufInputValidationFeedback = document.getElementById("validationItemManufFeedback");

            if (itemManufInput.value.length === 0) {
                itemManufInput.classList.add("is-invalid");
                itemManufInputValidationFeedback.classList.add("d-block");
                itemManufInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (itemManufInput.value === itemCard.manufacturer) {
                resetItemManufStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "manufacturer": itemManufInput.value
                });
            } catch (error) {
                if (error.response) {
                    itemManufInput.classList.add("is-invalid");
                    itemManufInputValidationFeedback.classList.add("d-block");
                    itemManufInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.manufacturer = itemManufInput.value;

            resetItemManufStyles();
        };

        itemManufInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                confItemManufAction();
            }
        });

        editItemManufBtn.addEventListener("click", (e) => {
            itemManufInput.toggleAttribute("disabled");
            editItemManufBtn.classList.toggle("d-none");
            confCancelItemManufBlock.classList.toggle("d-none");
        });

        confItemManufBtn.addEventListener("click", e => confItemManufAction(e));

        cancelItemManufAction = () => {
            itemManufInput.value = itemCard.manufacturer;
            resetItemManufStyles();
        };

        cancelItemManufBtn.addEventListener("click", cancelItemManufAction);

        const resetItemPriceStyles = () => {
            const itemPriceInputValidationFeedback = document.getElementById("validationItemPriceFeedback");

            itemPriceInput.classList.remove("is-invalid");
            itemPriceInputValidationFeedback.innerText = "";
            itemPriceInputValidationFeedback.classList.remove("d-block");

            itemPriceInput.toggleAttribute("disabled");
            confCancelItemPriceBlock.classList.toggle("d-none");
            editItemPriceBtn.classList.toggle("d-none");
        };

        const confItemPriceAction = async (e) => {
            if (e) {
                e.preventDefault();
            }

            const itemPriceInputValidationFeedback = document.getElementById("validationItemPriceFeedback");

            if (itemPriceInput.value.length === 0) {
                itemPriceInput.classList.add("is-invalid");
                itemPriceInputValidationFeedback.classList.add("d-block");
                itemPriceInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (parseFloat(itemPriceInput.value) <= 0) {
                itemPriceInput.classList.add("is-invalid");
                itemPriceInputValidationFeedback.classList.add("d-block");
                itemPriceInputValidationFeedback.innerText = "Мінімальна ціна — 1 грн."
                return;
            } else if (itemPriceInput.value === itemCard.price) {
                resetItemPriceStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "price": itemPriceInput.value
                });
            } catch (error) {
                if (error.response) {
                    itemPriceInput.classList.add("is-invalid");
                    itemPriceInputValidationFeedback.classList.add("d-block");
                    itemPriceInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.price = itemPriceInput.value;
            const itemPreviewPriceElement = document.querySelector(`div[data-item-id='${itemCard.id}'] .card-price`)
            itemPreviewPriceElement.innerText = itemPriceInput.value;

            resetItemPriceStyles();
        };

        itemPriceInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                confItemPriceAction();
            }
        });

        editItemPriceBtn.addEventListener("click", (e) => {
            itemPriceInput.toggleAttribute("disabled");
            editItemPriceBtn.classList.toggle("d-none");
            confCancelItemPriceBlock.classList.toggle("d-none");
        });

        confItemPriceBtn.addEventListener("click", e => confItemPriceAction(e));

        cancelItemPriceAction = () => {
            itemPriceInput.value = itemCard.price;
            resetItemPriceStyles();
        };

        cancelItemPriceBtn.addEventListener("click", cancelItemPriceAction);

        const resetItemLabelStyles = () => {
            const itemLabelInputValidationFeedback = document.getElementById("validationItemLabelFeedback");

            itemLabelInput.classList.remove("is-invalid");
            itemLabelInputValidationFeedback.innerText = "";
            itemLabelInputValidationFeedback.classList.remove("d-block");

            itemLabelInput.toggleAttribute("disabled");
            confCancelItemLabelBlock.classList.toggle("d-none");
            editItemLabelBtn.classList.toggle("d-none");
        };

        const confItemLabelAction = async (e) => {
            if (e) {
                e.preventDefault();
            }

            const itemLabelInputValidationFeedback = document.getElementById("validationItemLabelFeedback");

            if (itemLabelInput.value.length === 0) {
                itemLabelInput.classList.add("is-invalid");
                itemLabelInputValidationFeedback.classList.add("d-block");
                itemLabelInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (itemLabelInput.value.length > 10) {
                itemLabelInput.classList.add("is-invalid");
                itemLabelInputValidationFeedback.classList.add("d-block");
                itemLabelInputValidationFeedback.innerText = "Максимальна довжина підпису — 10 символів."
                return;
            } else if (itemLabelInput.value === itemCard.price) {
                resetItemLabelStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "label": itemLabelInput.value
                });
            } catch (error) {
                if (error.response) {
                    itemLabelInput.classList.add("is-invalid");
                    itemLabelInputValidationFeedback.classList.add("d-block");
                    itemLabelInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.label = itemLabelInput.value;
            increaseQuantityInput.setAttribute("placeholder", `(${itemLabelInput.value})`);
            decreaseQuantityInput.setAttribute("placeholder", `(${itemLabelInput.value})`);
            const itemPreviewLabelElement = document.querySelector(`div[data-item-id='${itemCard.id}'] .card-label`)
            itemPreviewLabelElement.innerText = itemLabelInput.value;

            resetItemLabelStyles();
        };

        itemLabelInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                confItemLabelAction();
            }
        });

        editItemLabelBtn.addEventListener("click", (e) => {
            itemLabelInput.toggleAttribute("disabled");
            editItemLabelBtn.classList.toggle("d-none");
            confCancelItemLabelBlock.classList.toggle("d-none");
        });

        confItemLabelBtn.addEventListener("click", e => confItemLabelAction(e));

        cancelItemLabelAction = () => {
            itemLabelInput.value = itemCard.label;
            resetItemLabelStyles();
        };

        cancelItemLabelBtn.addEventListener("click", cancelItemLabelAction);

        const resetIncreaseQuantityStyles = () => {
            const increaseQuantityInputValidationFeedback = document.getElementById("validationIncreaseQuantityFeedback");

            increaseQuantityInput.classList.remove("is-invalid");
            increaseQuantityInputValidationFeedback.innerText = "";
            increaseQuantityInputValidationFeedback.classList.remove("d-block");

            increaseQuantityInput.value = "";
        };

        increaseQuantityBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const itemIncreaseQuantityValidationFeedback = document.getElementById("validationIncreaseQuantityFeedback");

            if (increaseQuantityInput.value.length === 0) {
                increaseQuantityInput.classList.add("is-invalid");
                itemIncreaseQuantityValidationFeedback.classList.add("d-block");
                itemIncreaseQuantityValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (parseFloat(increaseQuantityInput.value) <= 0) {
                increaseQuantityInput.classList.add("is-invalid");
                itemIncreaseQuantityValidationFeedback.classList.add("d-block");
                itemIncreaseQuantityValidationFeedback.innerText = "Мінімально можна додати 1 одиницю товару.";
                return;
            }


            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "increase": parseFloat(parseFloat(increaseQuantityInput.value).toFixed(2))
                });
            } catch (error) {
                if (error.response) {
                    increaseQuantityInput.classList.add("is-invalid");
                    itemIncreaseQuantityValidationFeedback.classList.add("d-block");
                    itemIncreaseQuantityValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.quantity += parseFloat(parseFloat(increaseQuantityInput.value).toFixed(2));
            itemCard.quantity = parseFloat(parseFloat(itemCard.quantity).toFixed(2));
            const itemCardQuantity = document.querySelector(".item-card-quantity");
            itemCardQuantity.innerText = itemCard.quantity;
            const itemPreviewQuantityElement = document.querySelector(`div[data-item-id='${itemCard.id}'] .card-quantity`)
            itemPreviewQuantityElement.innerText = itemCard.quantity;

            resetIncreaseQuantityStyles();
        });

        const resetDecreaseQuantityStyles = () => {
            const decreaseQuantityInputValidationFeedback = document.getElementById("validationDecreaseQuantityFeedback");

            decreaseQuantityInput.classList.remove("is-invalid");
            decreaseQuantityInputValidationFeedback.innerText = "";
            decreaseQuantityInputValidationFeedback.classList.remove("d-block");

            decreaseQuantityInput.value = "";
        };

        decreaseQuantityBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const itemDecreaseQuantityValidationFeedback = document.getElementById("validationDecreaseQuantityFeedback");

            if (decreaseQuantityInput.value.length === 0) {
                decreaseQuantityInput.classList.add("is-invalid");
                itemDecreaseQuantityValidationFeedback.classList.add("d-block");
                itemDecreaseQuantityValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (parseFloat(decreaseQuantityInput.value) <= 0) {
                decreaseQuantityInput.classList.add("is-invalid");
                itemDecreaseQuantityValidationFeedback.classList.add("d-block");
                itemDecreaseQuantityValidationFeedback.innerText = "Мінімально можна списати 1 одиницю товару.";
                return;
            } else if (itemCard.quantity - parseFloat(parseFloat(decreaseQuantityInput.value).toFixed(2)) < 0) {
                decreaseQuantityInput.classList.add("is-invalid");
                itemDecreaseQuantityValidationFeedback.classList.add("d-block");
                itemDecreaseQuantityValidationFeedback.innerText = "Кількість товару не може бути від'ємною.";
                return;
            }

            try {
                await axios.patch(`${backendUrl}/items/${itemCard.id}`, {
                    "decrease": parseFloat(parseFloat(decreaseQuantityInput.value).toFixed(2))
                });
            } catch (error) {
                if (error.response) {
                    decreaseQuantityInput.classList.add("is-invalid");
                    itemDecreaseQuantityValidationFeedback.classList.add("d-block");
                    itemDecreaseQuantityValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            itemCard.quantity -= parseFloat(parseFloat(decreaseQuantityInput.value).toFixed(2));
            itemCard.quantity = parseFloat(parseFloat(itemCard.quantity).toFixed(2));
            const itemCardQuantity = document.querySelector(".item-card-quantity");
            itemCardQuantity.innerText = itemCard.quantity;
            const itemPreviewQuantityElement = document.querySelector(`div[data-item-id='${itemCard.id}'] .card-quantity`)
            itemPreviewQuantityElement.innerText = itemCard.quantity;

            resetDecreaseQuantityStyles();
        })
    });

    const deleteItemModal = document.getElementById("delete-item-modal");
    deleteItemModal.addEventListener("show.bs.modal", (e) => {
       const button = e.relatedTarget;
       const deleteItemModalContent = document.querySelector(".delete-item-modal-content");
       deleteItemModalContent.innerHTML = `<div class="modal-header">
                <h2 class="modal-title fs-4">Видалення товару</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Ви впевнені, що хочете видалити товар <strong>"${itemCard.name}"</strong>?</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" data-bs-target="#item-card-modal" data-bs-toggle="modal"
                        data-bs-dismiss="modal" data-item-id="${itemCard.id}">Назад
                </button>
                <button type="button" class="btn btn-danger" id="conf-delete-item-btn" data-item-id="${itemCard.id}" data-bs-dismiss="modal">Так, видалити</button>
            </div>`;

       const deleteItemBtn = document.getElementById("conf-delete-item-btn");
       deleteItemBtn.addEventListener("click", (e) => {
           const itemId = e.target.getAttribute("data-item-id");
           axios.delete(`${backendUrl}/items/${itemId}`);

           const itemPreviewElement = document.querySelector(`div[data-item-id='${itemCard.id}']`).parentNode.parentNode;
           if (itemPreviewElement.parentNode.childElementCount === 1) {
               const noItemsLabel = document.createElement("p");
               noItemsLabel.innerText = "В групі поки що немає товарів.";
               noItemsLabel.classList.add("text-center", "fs-4", "empty-group");

               itemPreviewElement.parentNode.parentNode.appendChild(noItemsLabel);
               itemPreviewElement.parentNode.remove();
           } else {
               itemPreviewElement.remove();
           }
       });
    });

    itemCardModal.addEventListener("hidden.bs.modal", () => {
        if (!itemNameInput.hasAttribute("disabled")) {
            cancelItemNameAction();
        }

        if (!itemDescrInput.hasAttribute("disabled")) {
            cancelItemDescrAction();
        }

        if (!itemManufInput.hasAttribute("disabled")) {
            cancelItemManufAction();
        }

        if (!itemPriceInput.hasAttribute("disabled")) {
            cancelItemPriceAction();
        }

        const backToSearchBtn = document.querySelector(".back-to-search-btn");
        backToSearchBtn.classList.add("d-none");
    });
};

export default itemCard;
