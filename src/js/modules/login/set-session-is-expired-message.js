const DISPLAY_NONE_CLASS = "d-none";
const SESSION_IS_EXPIRED_ITEM_NAME = "sessionIsExpired";
const SESSION_IS_EXPIRED_MESSAGE_CLASS = "login-form__expired_session";

const setSessionIsExpiredMessage = () => {
  const sessionIsExpiredMessageObj = document.querySelector(`.${SESSION_IS_EXPIRED_MESSAGE_CLASS}`);

  if (localStorage.getItem(SESSION_IS_EXPIRED_ITEM_NAME)) {
    sessionIsExpiredMessageObj.classList.remove(DISPLAY_NONE_CLASS);
    localStorage.removeItem(SESSION_IS_EXPIRED_ITEM_NAME);
  } else {
    if (!sessionIsExpiredMessageObj.classList.contains(DISPLAY_NONE_CLASS)) {
      sessionIsExpiredMessageObj.classList.add(DISPLAY_NONE_CLASS);
    }
  }
};

export default setSessionIsExpiredMessage;
