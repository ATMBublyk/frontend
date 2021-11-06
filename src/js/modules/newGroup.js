import axios from "axios";
import {backendUrl} from "./urls";
import Group from "./elements/group";

const newGroup = () => {
    const newGroupModal = document.getElementById("add-group-modal");
    const allInputs = newGroupModal.querySelectorAll("input, textarea");

    const validateAllFields = () => {
        let areValid = true;

        allInputs.forEach((input) => {
            if (input.value.length === 0) {
                areValid = false;

                input.classList.add("is-invalid");

                const invalidFeedbackId = input.getAttribute("aria-describedby");
                const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
                invalidFeedbackElem.innerText = "Поле не може бути пустим.";
                invalidFeedbackElem.classList.add("d-block");
            }

        });

        return areValid;
    };

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

    const createNewGroupBtn = document.getElementById("create-new-group-btn");
    createNewGroupBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        resetValidation();

        const areValid = validateAllFields();
        if (!areValid) {
            return;
        }

        const name = document.getElementById("new-group-name-input").value;
        const description = document.getElementById("new-group-descr-input").value;

        const postingObject = {
            name,
            description
        };

        let result;
        try {
            result = await axios.post(`${backendUrl}/groups`, postingObject);
        } catch (error) {
            const newGroupNameInput = document.getElementById("new-group-name-input");
            newGroupNameInput.classList.add("is-invalid");

            const invalidFeedbackId = newGroupNameInput.getAttribute("aria-describedby");
            const invalidFeedbackElem = document.getElementById(invalidFeedbackId);
            invalidFeedbackElem.innerText = error.response.data.message;
            invalidFeedbackElem.classList.add("d-block");

            return;
        }

        let isFirstGroup = false;

        if (!document.querySelector(".list-group-item")) {
            isFirstGroup = true;
            const noGroupsLabel = document.querySelector(".no-groups");
            noGroupsLabel.classList.add("d-none");
        }

        result.data.items = [];
        new Group(result.data).render();

        if (isFirstGroup) {
            const firstGroupLink = document.querySelector(".all-groups-list a:first-child");
            new bootstrap.Tab(firstGroupLink).show();
        }

        const modal = bootstrap.Modal.getInstance(newGroupModal);
        modal.hide();
    });

    newGroupModal.addEventListener("hidden.bs.modal", () => {
        resetAllFields();
    });
};

export default newGroup;
