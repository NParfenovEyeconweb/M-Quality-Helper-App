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
  const scriptTypeValue = scriptTypeElement.textContent;

  const startDateInput = document.getElementById("start-date-input");
  const startDateValue = startDateInput.value.trim();
  console.log(`startDateValue = ${startDateValue}`);

  const endDateInput = document.getElementById("end-date-input");
  const endDateValue = endDateInput.value.trim();
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
    return;
  }

  if (scriptTypeValue === "" || startDateValue === "" || endDateValue === "") {
    alert("Ошибка! Заполнены не все обязательные поля ввода.");
    console.log("data input error: some values are missing");
    return;
  }

  const startDate = isDateString(startDateValue);
  const endDate = isDateString(endDateValue);

  if (startDate === undefined || endDate === undefined) {
    alert(
      "Ошибка считывания даты. Пожалуйста, убедитесь, что дата указана в корректном формате."
    );
    console.log("date parse error");
    return;
  }

  if (scriptTypeValue === "Подсчет сообщений") {
    console.log(`script type: ${scriptTypeValue}`);
    countMessages(file, targetMessages, startDate, endDate)
      .then((resultMap) => {
        const tableId = "outputTable";
        const resultTableHtml = mapToHTMLTable(resultMap, tableId);
        console.log(resultTableHtml);
    
        const resultBlock = document.getElementById("form-block-result");
        const existingTable = document.getElementById(tableId); 
    
        if (existingTable) {
          existingTable.remove()
          console.log("Existing table removed");
        }

        resultBlock.innerHTML += resultTableHtml;
      })
      .catch((error) => {
        console.log("Promise error", error);
      });


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

function countMessages(file, targetMessages, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          const usersMap = new Map();
  
          const messages = jsonData.messages;
  
          for (const message of messages) {
            const messageText = extractText(message).trim();
            const messageAuthor = getAuthor(message).name;
            const messageDate = getDate(message);
  
            if (messageDate > startDate && messageDate < endDate) {
              for (const targetMessage of targetMessages) {
                if (messageText === targetMessage) {
                  if (!usersMap.has(messageAuthor)) {
                    usersMap.set(messageAuthor, 0);
                  }
                  usersMap.set(messageAuthor, usersMap.get(messageAuthor) + 1);
                  break;
                }
              }
            }
          }
  
          resolve(usersMap);
        } catch (error) {
          reject('Error parsing JSON');
        }
      };
  
      reader.onerror = () => reject('Error reading file');
      reader.readAsText(file);
  });
}

function mapToHTMLTable(map, tableId = 'mapTable') {
  let html = `<table id="${tableId}" border="1" style="border-collapse: collapse; width: 100%;">`;
  html += '<thead><tr><th>Пользователь</th><th>Кол-во сообщений</th></tr></thead>';
  html += '<tbody>';

  map.forEach((value, key, map) => {
    html += `<tr><td>${key}</td><td>${value}</td></tr>`;
  });

  html += '</tbody></table>';
  return html;
}