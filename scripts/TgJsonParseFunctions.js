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

/* returns false or an array of people who used this reaction on a message */

function isReactionFound (message, emoji) {
    let reactionsArray = message.reactions;
    let reactionsFrom = [];
    for (const reaction of reactionsArray) {
        if (reaction.emoji === emoji) {
            for (const recent of reaction.recent) {
                reactionsFrom.push(recent.from);
            }
            return reactionsFrom;
        }
    }
    return false;
}