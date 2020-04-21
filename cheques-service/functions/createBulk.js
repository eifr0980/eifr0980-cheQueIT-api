import { v1 } from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  let result = [];
  try {
    for (let cheque of data) {
      const params = {
        TableName: process.env.tableName,
        Item: {
          userId: event.requestContext.identity.cognitoIdentityId,
          chequeId: v1(),
          chequeNum: cheque.chequeNum,
          amount: cheque.amount,
          date: cheque.date,
          deposited: cheque.deposited || false,
          category: cheque.category,
          frontScan: cheque.frontScan,
          backScan: cheque.backScan,
          createdAt: Date.now(),
        },
      };

      try {
        await dynamoDbLib.call("put", params);
        result.push(params.Item);
      } catch (e) {
        return failure({ status: false });
      }
    }
    return success(result);
  } catch (e) {}
}
