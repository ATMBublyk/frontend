import axios from "axios";
import {backendUrl} from "./urls";
import Group from "./elements/group";

const init = async () => {
    const groups = await axios.get(`${backendUrl}/groups`)

    if (groups.data.length === 0) {
        const noGroupsLabel = document.querySelector(".no-groups");
        noGroupsLabel.classList.remove("d-none");
    } else {
        groups.data.forEach((group, i) => {
            if (i === 0) {
                new Group(group, true).render();
            } else {
                new Group(group).render();
            }
        });
    }

};

export default init;
