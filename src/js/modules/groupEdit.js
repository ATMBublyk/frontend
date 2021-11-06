import axios from "axios";
import {backendUrl} from "./urls";
import Group from "./elements/group";

const groupEdit = () => {
    let groupNameInput;
    let groupDescrInput;

    let cancelGroupNameAction;
    let cancelGroupDescrAction;

    const editGroupModal = document.getElementById("edit-group-modal");
    editGroupModal.addEventListener("show.bs.modal", async (e) => {
        const button = e.relatedTarget;
        const groupId = button.getAttribute("data-group-id");

        let foundGroup;
        try {
            foundGroup = await axios.get(`${backendUrl}/groups/${groupId}`);
        } catch (error) {
            console.log(error);
        }
        foundGroup = new Group(foundGroup.data);

        const editGroupBody = document.querySelector(".edit-group-body");
        editGroupBody.innerHTML = `
                <form>
                    <div class="mb-3">
                        <label for="group-name-input" class="col-form-label fw-bold pt-0">Назва</label>
                        <div class="d-flex align-items-center">
                            <input type="text" class="form-control item-card-field" id="group-name-input"
                                   disabled value="${foundGroup.name}" aria-describedby="validationGroupNameFeedback">
                            <button class="edit-conf-btn ms-3" id="edit-group-name-btn" type="button">
                                <span class="edit-icon"></span>
                            </button>
                            <div class="d-flex ms-3 d-none" id="conf-cancel-group-name-block">
                                <button class="edit-conf-btn" id="conf-group-name-btn" type="submit">
                                    <span class="confirm-icon"></span>
                                </button>
                                <button class="edit-conf-btn ms-2" id="cancel-group-name-btn" type="button">
                                    <span class="cancel-icon"></span>
                                </button>
                            </div>
                        </div>
                       <div id="validationGroupNameFeedback" class="invalid-feedback"></div> 
                    </div>
                </form>
                <form>
                    <div class="mb-3">
                        <label for="group-descr-input" class="col-form-label fw-bold">Опис</label>
                        <div class="d-flex align-items-start">
                            <textarea class="form-control item-card-field" id="group-descr-input" rows="5" disabled aria-describedby="validationGroupDescrFeedback">${foundGroup.description}</textarea>
                            <button class="edit-conf-btn ms-3 mt-2" id="edit-group-descr-btn" type="button">
                                <span class="edit-icon"></span>
                            </button>
                            <div class="d-flex ms-3 d-none mt-2" id="conf-cancel-group-descr-block">
                                <button class="edit-conf-btn" id="conf-group-descr-btn" type="submit">
                                    <span class="confirm-icon"></span>
                                </button>
                                <button class="edit-conf-btn ms-2" id="cancel-group-descr-btn" type="button">
                                    <span class="cancel-icon"></span>
                                </button>
                            </div>
                        </div>
                       <div id="validationGroupDescrFeedback" class="invalid-feedback"></div> 
                    </div>
                </form>
                <div class="d-grid gap-2 col-3 mx-auto mt-5">
                    <button type="button" class="btn btn-outline-danger" data-bs-target="#delete-group-modal"
                            data-bs-toggle="modal" data-bs-dismiss="modal" data-group-id="${groupId}">Видалити
                    </button>
                </div>
            `

        groupNameInput = document.getElementById("group-name-input");
        const editGroupNameBtn = document.getElementById("edit-group-name-btn");
        const confCancelGroupNameBlock = document.getElementById("conf-cancel-group-name-block");
        const confGroupNameBtn = document.getElementById("conf-group-name-btn");
        const cancelGroupNameBtn = document.getElementById("cancel-group-name-btn");

        groupDescrInput = document.getElementById("group-descr-input");
        const editGroupDescrBtn = document.getElementById("edit-group-descr-btn");
        const confCancelGroupDescrBlock = document.getElementById("conf-cancel-group-descr-block");
        const confGroupDescrBtn = document.getElementById("conf-group-descr-btn");
        const cancelGroupDescrBtn = document.getElementById("cancel-group-descr-btn");

        const resetGroupNameStyles = () => {
            const groupNameInputValidationFeedback = document.getElementById("validationGroupNameFeedback");

            groupNameInput.classList.remove("is-invalid");
            groupNameInputValidationFeedback.innerText = "";
            groupNameInputValidationFeedback.classList.remove("d-block");

            groupNameInput.toggleAttribute("disabled");
            confCancelGroupNameBlock.classList.toggle("d-none");
            editGroupNameBtn.classList.toggle("d-none");
        };

        const confGroupNameAction = async (e) => {
            if (e) {
                e.preventDefault();
            }

            const groupNameInputValidationFeedback = document.getElementById("validationGroupNameFeedback");

            if (groupNameInput.value.length === 0) {
                groupNameInput.classList.add("is-invalid");
                groupNameInputValidationFeedback.classList.add("d-block");
                groupNameInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (groupNameInput.value === foundGroup.name) {
                resetGroupNameStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/groups/${groupId}`, {
                    "name": groupNameInput.value
                });
            } catch (error) {
                if (error.response) {
                    groupNameInput.classList.add("is-invalid");
                    groupNameInputValidationFeedback.classList.add("d-block");
                    groupNameInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            foundGroup.name = groupNameInput.value;
            const groupLinkElem = document.querySelector(`a[aria-control='list-${groupId}']`)
            groupLinkElem.innerText = groupNameInput.value;

            resetGroupNameStyles();
        };

        groupNameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                confGroupNameAction();
            }
        });

        editGroupNameBtn.addEventListener("click", (e) => {
            groupNameInput.toggleAttribute("disabled");
            editGroupNameBtn.classList.toggle("d-none");
            confCancelGroupNameBlock.classList.toggle("d-none");
        });

        confGroupNameBtn.addEventListener("click", e => confGroupNameAction(e));

        cancelGroupNameAction = () => {
            groupNameInput.value = foundGroup.name;
            resetGroupNameStyles();
        };

        cancelGroupNameBtn.addEventListener("click", cancelGroupNameAction);

        const resetGroupDescrStyles = () => {
            const groupDescrInputValidationFeedback = document.getElementById("validationGroupDescrFeedback");

            groupDescrInput.classList.remove("is-invalid");
            groupDescrInputValidationFeedback.innerText = "";
            groupDescrInputValidationFeedback.classList.remove("d-block");

            groupDescrInput.toggleAttribute("disabled");
            confCancelGroupDescrBlock.classList.toggle("d-none");
            editGroupDescrBtn.classList.toggle("d-none");
        };

        editGroupDescrBtn.addEventListener("click", (e) => {
            groupDescrInput.toggleAttribute("disabled");
            editGroupDescrBtn.classList.toggle("d-none");
            confCancelGroupDescrBlock.classList.toggle("d-none");
        });

        const confGroupDescrAction = async (e) => {
            if (e) {
                e.preventDefault();
            }

            const groupDescrInputValidationFeedback = document.getElementById("validationGroupDescrFeedback");

            if (groupDescrInput.value.length === 0) {
                groupDescrInput.classList.add("is-invalid");
                groupDescrInputValidationFeedback.classList.add("d-block");
                groupDescrInputValidationFeedback.innerText = "Поле не може бути пустим."
                return;
            } else if (groupDescrInput.value === foundGroup.name) {
                resetGroupDescrStyles();
                return;
            }

            try {
                await axios.patch(`${backendUrl}/groups/${groupId}`, {
                    "description": groupDescrInput.value
                });
            } catch (error) {
                if (error.response) {
                    groupDescrInput.classList.add("is-invalid");
                    groupDescrInputValidationFeedback.classList.add("d-block");
                    groupDescrInputValidationFeedback.innerText = error.response.data.message;
                    return;
                }
            }

            foundGroup.description = groupDescrInput.value;
            const groupDescrParagraph = document.querySelector(`#list-${groupId} .group-descr-par`);
            groupDescrParagraph.innerText = groupDescrInput.value;

            resetGroupDescrStyles();
        };

        confGroupDescrBtn.addEventListener("click", (e) => confGroupDescrAction(e));

        cancelGroupDescrAction = () => {
            groupDescrInput.value = foundGroup.description;
            resetGroupDescrStyles();
        };

        cancelGroupDescrBtn.addEventListener("click", cancelGroupDescrAction);

        const deleteGroupModal = document.getElementById("delete-group-modal");
        const deleteGroupModalContent = document.querySelector(".delete-group-modal-content");
        deleteGroupModal.addEventListener("show.bs.modal", (e) => {
            deleteGroupModalContent.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title fs-4">Видалення групи</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Ви впевнені, що хочете видалити групу <strong>"${foundGroup.name}"</strong>? Всі товари групи також будуть
                    видалені.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" data-bs-target="#edit-group-modal" data-bs-toggle="modal"
                        data-bs-dismiss="modal" data-group-id="${groupId}">Назад
                </button>
                <button type="button" class="btn btn-danger" id="conf-delete-group-btn" data-group-id="${groupId}" data-bs-dismiss="modal">Так, видалити</button>
            </div>
            `;

            const confDeleteGroupBtn = document.getElementById("conf-delete-group-btn");
            confDeleteGroupBtn.addEventListener("click", (e) => {
                const groupId = e.target.getAttribute("data-group-id");
                axios.delete(`${backendUrl}/groups/${groupId}`);

                const listGroupItem = document.querySelector(`.list-group-item[aria-control='list-${groupId}']`);
                listGroupItem.remove();

                const groupPane = document.getElementById(`list-${groupId}`);
                groupPane.remove();

                const firstGroupLink = document.querySelector(".all-groups-list a:first-child");
                if (firstGroupLink) {
                    new bootstrap.Tab(firstGroupLink).show();
                } else {
                    const noGroupsLabel = document.querySelector(".no-groups");
                    noGroupsLabel.classList.remove("d-none");
                }
            });


        });
    });


    const groupEditModal = document.getElementById("edit-group-modal");
    groupEditModal.addEventListener("hidden.bs.modal", () => {
        if (!groupNameInput.hasAttribute("disabled")) {
            cancelGroupNameAction();
        }

        if (!groupDescrInput.hasAttribute("disabled")) {
            cancelGroupDescrAction();
        }
    });
};

export default groupEdit;
