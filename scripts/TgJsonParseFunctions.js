function extractText(message) {
    const textEntities = message.text;
    let resultString = "";
    for (const textEntity of textEntities) {
        if (textEntity === null) continue;
        if (typeof textEntity === "object") {
            resultString += String(textEntity.text);
        }
        if (typeof textEntity === "string") {
            resultString += textEntity;
        }
    }
    return resultString;
} 

/*
function returns an object with 2 fields: name and id
name is tg name of a person
id is user's id in telegram
*/

function getAuthor (message) {
    return {name: message.from ?? undefined, id: message.id ?? undefined};
}

function getDate (message) {
    return new Date(message.date);
}

