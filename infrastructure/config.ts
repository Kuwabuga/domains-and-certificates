export const AWS_REGION = process.env.AWS_REGION || "eu-west-1";
export const AWS_TERRAFORM_BUCKET = process.env.AWS_TERRAFORM_BUCKET;
export const ENVIRONMENT = process.env.ENVIRONMENT || "development";
export const SERVICE_NAME = process.env.SERVICE_NAME;

export const DEFAULTS = {
  comment: "Managed by Terraform CDK",
  tags: undefined
};

export const BACKEND = {
  bucket: AWS_TERRAFORM_BUCKET,
  baseKey: `${ENVIRONMENT}/${SERVICE_NAME}`,
  region: AWS_REGION,
  acl: "bucket-owner-full-control"
};