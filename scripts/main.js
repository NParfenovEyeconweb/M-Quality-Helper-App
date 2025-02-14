const startScriptButton = document.getElementById("start-script-button");

const selectElement = document.getElementById("script-select");
const searchTypeFormBlock = document.getElementById("form-search-type");

startScriptButton.addEventListener("click", () => {
  console.log("startScriptButton clicked");

  const inputWrapper = document.getElementById("message-input-wrapper");

  let targetMessages = [];
  let targetReactions = [];
  if (selectElement.value === "count-messages") {
    for (const inputMessage of inputWrapper.children) {
      if (inputMessage.value === "") continue;
      targetMessages.push(inputMessage.value);
    }
    console.log(`targetMessages succesfully retrieved: ${targetMessages}`);
  } else if (selectElement.value === "count-reactions") {
    for (const inputReaction of inputWrapper.children) {
      if (inputReaction.value === "") continue;
      targetReactions.push(inputReaction.value);
    }
  }

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

  const tableId = "outputTable";
  const copyTableButtonId = "copyTable-btn";

  if (selectElement.value === "count-messages") {
    console.log(`script type: ${scriptTypeValue}`);
    countMessages(file, targetMessages, startDate, endDate)
      .then((resultMap) => {
        
        const resultTableHtml = mapToHTMLTable(resultMap, tableId);
        console.log(resultTableHtml);

        const resultBlock = document.getElementById("outputTable-block");
        const existingTable = document.getElementById(tableId);

        if (existingTable) {
          existingTable.remove();
          console.log("Existing table removed");
        }

        resultBlock.innerHTML += resultTableHtml;

        const existingButton = document.getElementById(copyTableButtonId);
        if (existingButton) {
          existingButton.remove();
          console.log("Existing button removed");
        }

        const copyTableButton = createTableCopyButton(tableId, copyTableButtonId);
        const copyButtonParentId = "tableCopyBtn-block";
        const copyButtonParent = document.getElementById(copyButtonParentId);
        copyButtonParent.appendChild(copyTableButton);
      })
      .catch((error) => {
        console.log("Promise error", error);
      });
  } else if (selectElement.value === "count-reactions") {
    countReactions(file, targetReactions, startDate, endDate)
      .then((resultMap) => {
        const resultTableHtml = mapToHTMLTable(resultMap, tableId);
        console.log(resultTableHtml);
        const resultBlock = document.getElementById("outputTable-block");
        const existingTable = document.getElementById(tableId);

        if (existingTable) {
          existingTable.remove();
          console.log("Existing table removed");
        }

        resultBlock.innerHTML += resultTableHtml;

        const existingButton = document.getElementById(copyTableButtonId);
        if (existingButton) {
          existingButton.remove();
          console.log("Existing button removed");
        }

        const copyTableButton = createTableCopyButton(tableId, copyTableButtonId);
        const copyButtonParentId = "tableCopyBtn-block";
        const copyButtonParent = document.getElementById(copyButtonParentId);
        copyButtonParent.appendChild(copyTableButton);
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

/* code for select menu */

selectElement.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  const taskNameElement = document.getElementById("form-task-name");
  const taskDescriptionElement = document.getElementById(
    "form-task-description"
  );
  const scriptNameElement = document.getElementById("script-name");

  if (selectedValue === "count-messages") {
    scriptNameElement.innerHTML = `Подсчет сообщений`;
    taskNameElement.innerHTML = `
      <h3 class="form-block-text">Сообщения для подсчета:</h3>
    `;
    taskDescriptionElement.innerHTML = `
      Сообщения для подсчета необходимо вводить полностью! <br>Например,
      для подсчета сообщений "завершено" нужно ввести это слово полностью. <br>
      Сообщения "завершено!" или "завершено, спасибо!" при этом в подсчете
      участвовать не будут.`;
  } else if (selectedValue === "count-reactions") {
    scriptNameElement.innerHTML = `Подсчет реакций`;
    taskNameElement.innerHTML = `
      <h3 class="form-block-text">Реакции для подсчета:</h3>
    `;
    taskDescriptionElement.innerHTML = "";
  }
});

/* file selection handling */

const fileInput = document.getElementById("file-input");
const fileNameDisplay = document.getElementById("file-name");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    fileNameDisplay.textContent = file.name;
  } else {
    fileNameDisplay.textContent = "Файл не выбран";
  }
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
        reject("Error parsing JSON");
      }
    };

    reader.onerror = () => reject("Error reading file");
    reader.readAsText(file);
  });
}

function mapToHTMLTable(map, tableId = "mapTable") {
  let html = `<table id="${tableId}" border="1" style="border-collapse: collapse; width: 100%;">`;
  html +=
    "<thead><tr><th>Пользователь</th><th>Кол-во сообщений</th></tr></thead>";
  html += "<tbody>";

  map.forEach((value, key, map) => {
    html += `<tr><td>${key}</td><td>${value}</td></tr>`;
  });

  html += "</tbody></table>";
  return html;
}

function countReactions(file, targetReactions, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        const usersMap = new Map();
        const messages = jsonData.messages;
        for (const message of messages) {
          const messageAuthor = getAuthor(message).name;
          const messageDate = getDate(message);

          if (messageDate > startDate && messageDate < endDate) {
            for (const emoji of targetReactions) {
              if (isReactionFound(message, emoji)) {
                const authorsArray = isReactionFound(message, emoji);
                for (const author of authorsArray) {
                  if (!usersMap.has(author)) {
                    usersMap.set(author, 0);
                  }
                  usersMap.set(author, usersMap.get(author) + 1);
                }
              }
            }
          }
        }
        resolve(usersMap);
      } catch (error) {
        reject("Error parsing JSON");
      }
    };
    reader.onerror = () => reject("Error reading file");
    reader.readAsText(file);
  });
}

/**
 * Creates a button that copies specified table to the clipboard.
 * @param {string} tableId - id of the table which the button should copy
 * @param {string} copyTableButtonId - id that will be used for this button
 * @returns 
 */

// Function to add a copy button to a table and handle copying its contents
function createTableCopyButton(tableId, copyTableButtonId) {
  // Get the target table
  const table = document.getElementById(tableId);
  if (!table) {
      console.error(`Table with id "${tableId}" not found`);
      return;
  }

  // Create the copy button
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Скопировать таблицу';
  copyButton.className = copyTableButtonId;
  
  copyButton.style.cursor = 'pointer';

  // Function to convert table data to a clean string
  function tableToString(table) {
      // Get all rows including header
      const rows = Array.from(table.rows);
      
      // Convert each row to text
      return rows.map(row => {
          // Get all cells in this row
          const cells = Array.from(row.cells);
          // Convert cells to text and join with tabs
          return cells.map(cell => cell.textContent.trim()).join('\t');
      }).join('\n'); // Join rows with newlines
  }

  // Add click handler
  copyButton.addEventListener('click', async () => {
      try {
          // Convert table to string
          const tableText = tableToString(table);
          
          // Copy to clipboard using the modern Clipboard API
          await navigator.clipboard.writeText(tableText);
          
          // Provide user feedback
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Скопировано!';
          
          // Reset button text after 2 seconds
          setTimeout(() => {
              copyButton.textContent = originalText;
          }, 2000);
          
      } catch (err) {
          console.error('Failed to copy table:', err);
          copyButton.textContent = 'Не удалось скопировать!';
          
          // Reset button text after 2 seconds
          setTimeout(() => {
              copyButton.textContent = 'Скопировать таблицу';
          }, 2000);
      }
  });

  return copyButton;
}