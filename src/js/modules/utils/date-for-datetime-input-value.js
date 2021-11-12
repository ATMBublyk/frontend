const dateForDateTimeInputValue = (date) =>
  new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000)
    .toISOString()
    .slice(0, 16);

export default dateForDateTimeInputValue;
