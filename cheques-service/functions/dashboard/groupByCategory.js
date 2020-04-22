import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import { groupByCategory, sumGroupedCheques } from "./tools";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    ProjectionExpression: "category, amount",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    const grouped = sumGroupedCheques(groupByCategory(result.Items));

    return success(grouped);
  } catch (e) {
    return failure({ status: e });
  }
}
