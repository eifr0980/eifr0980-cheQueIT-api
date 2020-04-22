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
    ProjectionExpression: "deposited",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    const deposited = await countDeposited(event);
    const scanned = result.Count;
    // Return the matching list of items in response body
    return success({ scanned, deposited });
  } catch (e) {
    return failure({ status: e });
  }
}

async function countDeposited(event) {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    ProjectionExpression: "deposited",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
      ":state": true,
    },
    ExpressionAttributeNames: {
      "#deposited": "deposited",
    },
    FilterExpression: "#deposited = :state",
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the Sum of amount of all scanned this month
    return result.Count;
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
