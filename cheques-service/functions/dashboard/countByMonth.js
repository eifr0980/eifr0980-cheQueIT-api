import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    ProjectionExpression: "#date",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
    },
    ExpressionAttributeNames: {
      "#date": "date",
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // sortCheques(result.Items);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: e });
  }
}

/* const sortCheques = (arr) => {
  const month = new Date().getMonth();
  arr.reduce((a, b) => {
    for (let index = 0; index < 6; index++) {
      let m = month + index;
      if (b.date.getMonth() == m) {
        a.m = b.amount;
      }
    }
  }, {});
  console.log(arr);
};
 */
