let dates = new Date();

let lastSevenDays = new Date(dates);
lastSevenDays.toDateString();
lastSevenDays.setDate(lastSevenDays.getDate() - 7);

let year = lastSevenDays.getFullYear();

let month = (date) => {
  const m = date.getMonth() + 1;
  if (m.toString().length === 1) {
    return `0${m}`;
  } else {
    return m;
  }
};
let date = ("0" + lastSevenDays.getDate()).slice(-2);

let complete_date = year + "-" + month(lastSevenDays) + "-" + date;

export {complete_date}