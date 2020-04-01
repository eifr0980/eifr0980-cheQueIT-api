import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression:
      "SET companyName = :companyName, companyCode = :companyCode, address = :address, email = :email, bankNum = :bankNum, bankAccountNum = :bankAccountNum, bankBranch = :bankBranch",
    ExpressionAttributeValues: {
      ":bankBranch": data.bankBranch || null,
      ":bankAccountNum": data.bankAccountNum || null,
      ":bankNum": data.bankNum || null,
      ":email": data.email || null,
      ":address": data.address || null,
      ":companyCode": data.companyCode || null,
      ":companyName": data.companyName || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
