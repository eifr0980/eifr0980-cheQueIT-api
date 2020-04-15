import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import { sumAmounts } from "./tools";

export async function main(event, context) {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1).getTime();
  const lastDay = new Date(y, m + 1, 0).getTime();
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    ProjectionExpression: "amount",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
      ":firstDay": firstDay,
      ":lastDay": lastDay,
    },
    FilterExpression: "createdAt BETWEEN :firstDay AND :lastDay",
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    const sumResult = sumAmounts(result.Items);
    // Return the matching list of items in response body
    return success({ totalAmount: sumResult });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
