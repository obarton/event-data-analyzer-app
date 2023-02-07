import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/StorageStack.js
import { Bucket, Table } from "@serverless-stack/resources";
function StorageStack({ stack, app }) {
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
      }
    ]
  });
  const table = new Table(stack, "Events", {
    fields: {
      userId: "string",
      eventId: "string"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "eventId" }
  });
  return {
    table,
    bucket
  };
}
__name(StorageStack, "StorageStack");

// stacks/ApiStack.js
import { Api, use } from "@serverless-stack/resources";
function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName
        }
      }
    },
    cors: true,
    routes: {
      "POST /events": "functions/create.main",
      "GET /events/{id}": "functions/get.main",
      "GET /events": "functions/list.main",
      "PUT /events/{id}": "functions/update.main",
      "DELETE /events/{id}": "functions/delete.main"
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return {
    api
  };
}
__name(ApiStack, "ApiStack");

// stacks/AuthStack.js
import * as iam from "aws-cdk-lib/aws-iam";
import { Cognito, use as use2 } from "@serverless-stack/resources";
function AuthStack({ stack, app }) {
  const { bucket } = use2(StorageStack);
  const { api } = use2(ApiStack);
  const auth = new Cognito(stack, "Auth", {
    login: ["email"]
  });
  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    })
  ]);
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId
  });
  return {
    auth
  };
}
__name(AuthStack, "AuthStack");

// stacks/FrontendStack.js
import { ReactStaticSite, use as use3 } from "@serverless-stack/resources";
function FrontendStack({ stack, app }) {
  const { api } = use3(ApiStack);
  const { auth } = use3(AuthStack);
  const { bucket } = use3(StorageStack);
  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.customDomainUrl || api.url,
      REACT_APP_REGION: app.region,
      REACT_APP_BUCKET: bucket.bucketName,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId
    }
  });
  stack.addOutputs({
    SiteUrl: site.url
  });
}
__name(FrontendStack, "FrontendStack");

// stacks/index.js
function main(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm"
    }
  });
  app.stack(StorageStack).stack(ApiStack).stack(AuthStack).stack(FrontendStack);
}
__name(main, "main");
export {
  main as default
};
//# sourceMappingURL=index.js.map
