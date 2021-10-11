# Lambda@Edge hostname redirect

Redirect any request to another hostname by using this function as Lambda@Edge.

## Developed with ❤️ by [GRRR](https://grrr.nl)

- GRRR is a [B Corp](https://grrr.nl/en/b-corp/)
- GRRR has a [tech blog](https://grrr.tech/)
- GRRR is [hiring](https://grrr.nl/en/jobs/)
- [@GRRRTech](https://twitter.com/grrrtech) tweets

## Usage

Create a `.env` (and/or `.env.staging` and `.env.production` if you like, or any stage you'd like).  
Note that the environment variables are used solely for deployment – a Lambda@Edge function cannot have environment variables.

Deploy the function to your AWS environment, publish a version, and use the ARN of the specific version in a `Viewer Request` event handler. This can be configured under *Behaviors* in your CloudFront distribution.

The role that executes this function should have the permissions as described in [the AWS documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html).

## Configure

Create the file `redirect_rules.json`, in which you can add one or multiple host-mappings, like so:

```js
{
  "rules": [
    {
      "origin": "www.example.com",
      "target": "example.com"
    },
    {
      "origin": "www.foo.com",
      "target": "com.bar.www"
    }
  ]
}
```

The hostname will be replaced 1:1, no magic is involved.

### Cache lifetime

Optionally, configure a `max-age` to determine the time this response will be cached:

```js
{
  "rules": [
    {
      "origin": "www.example.com",
      "target": "example.com",
      "max-age": 86400
    }
  ]
}
```

The above would cache the redirect 1 day. If omitted, a `Cache-Control` header of `max-age=0` (meaning no cache) will be set.

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
