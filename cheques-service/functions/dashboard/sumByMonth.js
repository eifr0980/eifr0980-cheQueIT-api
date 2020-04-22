import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import { groupByMonth, sumGroupedCheques } from "./tools";

export async function main(event, context) {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1).toISOString();
  const lastDay = new Date(y, m + 7, -1).toISOString();
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    ProjectionExpression: "#date, amount",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
      ":firstDay": firstDay,
      ":lastDay": lastDay,
    },
    ExpressionAttributeNames: {
      "#date": "date",
    },
    FilterExpression: "#date BETWEEN :firstDay AND :lastDay",
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // sortCheques(result.Items);
    // Return the matching list of items in response body
    const ordered = sumGroupedCheques(groupByMonth(result.Items));
    console.log(ordered);
    return success(ordered);
  } catch (e) {
    return failure({ status: e });
  }
}
