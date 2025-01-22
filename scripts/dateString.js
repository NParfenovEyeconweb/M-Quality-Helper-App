/*
function that returns boolean value
it returns Date object if the given string is a correct dateString value
and false if it's not
correct dateStrings examples: 2025-01-25 00:00, 1984-01-01, 2024/12/31 23:59
*/

function isDateString(str) {
  if (str === undefined) return false;

  const strSplitHalf = str.split(" ");
  if (strSplitHalf.length === 0 || strSplitHalf.length > 2) {
    return false;
  }

  let hours = undefined;
  let minutes = undefined;

  if (strSplitHalf.length === 2) {
    const time = strSplitHalf[1];
    const timeRegex = /\d{2}:\d{2}/;

    if (time.length !== 5 || !timeRegex.test(time)) {
      return false;
    }

    hours = Number(time.split(":")[0]);
    minutes = Number(time.split(":")[1]);
    if (hours === undefined || minutes === undefined) {
      return false;
    }

    if (hours > 23 || hours < 0 || minutes > 59 || minutes < 0) {
      return false;
    }
  }

  const date = strSplitHalf[0];
  const separators = ["-", "/", "."];

  if (date.length != 10) {
    return false;
  }

  for (const separator of separators) {
    const dateRegex = createDateRegex(separator);
    if (dateRegex.test(date)) {
      const years = Number(date.split(separator)[0]);
      const months = Number(date.split(separator)[1]);
      const days = Number(date.split(separator)[2]);

      if (
        years >= 2000 &&
        years <= 2040 &&
        months >= 1 &&
        months <= 12 &&
        days >= 1 &&
        days <= 31
      ) {
        return new Date(years, months-1, days, hours ?? 0, minutes ?? 0);
      }
    }
  }
  return false;
}

function createDateRegex(separator) {
  return RegExp(`\\d{4}${separator}\\d{2}${separator}\\d{2}`);
}

