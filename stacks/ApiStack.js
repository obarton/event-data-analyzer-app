import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
        authorizer: "iam",
        function: {
            permissions: [table],
            environment: {
            TABLE_NAME: table.tableName,
        },
      },
    },
    cors: true,
    routes: {
      "POST /events": "functions/create.main",
      "GET /events/{id}": "functions/get.main",
      "GET /events": "functions/list.main",
      "PUT /events/{id}": "functions/update.main",
      "DELETE /events/{id}": "functions/delete.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}