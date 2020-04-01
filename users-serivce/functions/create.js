import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      companyName: data.companyName,
      companyCode: data.companyCode,
      address: data.address,
      email: data.email
      bankNum: data.bankNum,
      bankAccountNum: data.bankAccountNum,
      bankBranch: data.bankBranch,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
