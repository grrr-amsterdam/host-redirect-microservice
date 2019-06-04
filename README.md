# Lambda@Edge hostname redirect

Redirect any request to another hostname by using this function as Lambda@Edge.  

## Usage

Create a `.env` (and/or `.env.staging` and `.env.production` if you like, or any stage you'd like).

Deploy the function to your AWS environment, publish a version, and use the ARN of the specific version in a `Viewer Request` event handler. This can be configured under *Behaviors* in your CloudFront distribution.

The role that executes this function should have the permissions as described in [the AWS documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html).

## Configure

Configure one or multiple host-mappings, in your `.env` file, as follows:

```
REDIRECT_ORIGIN_1=www.example.com
REDIRECT_TARGET_1=example.com

REDIRECT_ORIGIN_2=www.foo.bar
REDIRECT_TARGET_2=www.bar.foo
```

## Deploy

You can use stages to deploy to `development`, `staging` and `production` (default: `development`).

### Prerequisites

1. You have the AWS cli tool installed.
2. You have configured a profile for this service.
3. You have created `.env.staging` and `.env.production` files, based on `.env.example` (or any stages you wish to deploy).
4. Make sure the value for `AWS_PROFILE` in the applicable `.env` file corresponds to the profile you created in step 2.

### Deploy a stage

```
npx serverless deploy --stage=staging --env=staging
```

Replace `staging` with any other stage, but make sure the corresponding `.env.{stage}` file exists.
`.env` is used when stage = `development`, which is the default.
