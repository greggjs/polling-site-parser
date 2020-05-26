import AWS from "aws-sdk";
const { SNS } = AWS;

export const publishUpdates = async (updateTopic, site, updates) => {
  try {
    const sns = new SNS({ region: "us-west-2" });
    const message = `updates to site ${site} have occurred: ${formatUpdates(updates)}`
    console.log(message);

    await sns.publish({ Message: message, TopicArn: updateTopic }).promise();
    
    console.log(`published updates to ${updateTopic}`);
  } catch(err) {
    console.error(err);
  }
}

const formatUpdates = (updates) => {
  const added = [], removed = [];
  updates.forEach((update) => {
    switch(update.action) {
      case "ADDED":
        added.push(update.title);
        break;
      case "REMOVED":
        removed.push(update.title);
        break;
      default:
        break;
    }  
  })
  
  return `${added.length > 0 ? `\nAdded: ${added.reduce((acc, curr) => acc + `\n * ${curr}`, "")}` : ""}${removed.length > 0 ? `\nRemoved: ${removed.reduce((acc, curr) => acc + `\n * ${curr}`, "")}`: ""}`;
}
