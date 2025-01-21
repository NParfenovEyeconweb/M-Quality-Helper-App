const startScriptButton = document.getElementById("start-script-button");

startScriptButton.addEventListener("click", () => {
  console.log("startScriptButton clicked");

  const inputWrapper = document.getElementById("message-input-wrapper");

  let targetMessages = [];
  for (const inputMessage of inputWrapper.children) {
    if (inputMessage.value === "") continue;
    targetMessages.push(inputMessage.value);
  }
  console.log(`targetMessages succesfully retrieved: ${targetMessages}`);

  const scriptTypeElement = document.getElementById("script-name");
  const scriptTypeValue = scriptTypeElement.value;

  const startDateInput = document.getElementById("start-date-input");
  const startDateValue = startDateInput.value;
  console.log(`startDateValue = ${startDateValue}`);

  const endDateInput = document.getElementById("end-date-input");
  const endDateValue = endDateInput.value;
  console.log(`endDateValue = ${endDateValue}`);

  const fileInput = document.getElementById("file-input");
  const files = fileInput.files;

  if (files.length != 1) {
    alert(
      "Ошибка добавления файла. Пожалуйста, убедитесь, что вы добавили файл."
    );
    console.log(`file input error`);
    return;
  }

  const file = files[0];

  const fileName = file.name;
  const fileExtension = fileName.split(".").pop();
  if (fileExtension.toLowerCase() !== "json") {
    alert("Ошибка добавления файла. Расширение файла не .json");
  }

  if (scriptTypeValue === "" || startDateValue === "" || endDateValue === "") {
    alert("Ошибка! Заполнены не все обязательные поля ввода.");
    console.log("data input error: some values are missing");
  }

  if (!isDateString(startDateValue) || isDateString(endDateValue)) {
    alert(
      "Ошибка считывания даты. Пожалуйста, убедитесь, что дата указана в корректном формате."
    );
    console.log("date parse error");
  }

  if (scriptTypeValue === "Подсчет сообщений") {
    console.log(`script type: ${scriptTypeValue}`);
  }

  /* needed function is called with a file as an argument */

  console.log(`file input recieved correctly`);
});

/* resetButton - a button that resets all the input values on the page*/

const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", () => {
  console.log("resetButton clicked");

  const inputs = document.querySelectorAll("input");
  for (let input of inputs) {
    input.value = "";
    console.log(`${input.name} cleared`);
  }
});

/* addMessageButton - a button that adds an input field for an extra message */

const addMessageButton = document.getElementById("add-message-button");

addMessageButton.addEventListener("click", () => {
  const inputWrapper = document.getElementById("message-input-wrapper");

  if (inputWrapper.childElementCount >= 16) {
    alert("Лимит в 16 сообщений уже достигнут!");
    console.log("input adding error: reached limit");
    return;
  }

  const newMessageInput = createTextInput("message-text", "Введите сообщениe");

  inputWrapper.appendChild(newMessageInput);
});

const deleteMessageButton = document.getElementById("delete-message-button");

deleteMessageButton.addEventListener("click", () => {
  const inputWrapper = document.getElementById("message-input-wrapper");

  if (inputWrapper.childElementCount === 1) {
    alert("Удаление невозможно. Используется всего 1 сообщение для поиска.");
    console.log("input deletion error: only one input field exists");
    return;
  }

  const lastInput = inputWrapper.lastElementChild;
  lastInput.remove();
});

/*
function that returns an input type="text" element 
with specified name and placeholder values
*/

function createTextInput(nameValue, placeholder) {
  const newTextInput = document.createElement("input");
  newTextInput.type = "text";
  newTextInput.classList.add("form-input");
  newTextInput.name = nameValue;
  newTextInput.placeholder = placeholder;

  return newTextInput;
}

/* 
function for the first type of script that counts specific messages
using json exported telegram chat
*/

function countMessages(file, messages) {
  return;
}
