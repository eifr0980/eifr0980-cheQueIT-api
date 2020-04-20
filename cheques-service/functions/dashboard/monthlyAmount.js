import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import { sumAmounts } from "./tools";

export async function main(event, context) {
  try {
    const scanned = await getSumAmountScannedMonth(event);
    const deposited = await getSumAmountDepositeMonth(event);

    return success({ scanned, deposited });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}

async function getSumAmountScannedMonth(event) {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1).getTime();
  const lastDay = Date.now();
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
    // Return the Sum of amount of all scanned this month
    const sumResult = sumAmounts(result.Items);

    return sumResult;
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}

async function getSumAmountDepositeMonth(event) {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1).toISOString();
  const lastDay = new Date(Date.now()).toISOString();
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
    ExpressionAttributeNames: {
      "#chequeDate": "date",
    },
    FilterExpression: "#chequeDate BETWEEN :firstDay AND :lastDay",
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the Sum of amount of all scanned this month
    const sumResult = sumAmounts(result.Items);
    return sumResult;
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
