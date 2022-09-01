export const DEFAULTS = {
    comment: "Managed by Terraform CDK",
    tags: {
        "default": "default"
    }
}

export const AWS = {
    region: process.env.AWS_REGION || "us-east-1"
}

export const BACKEND = {
    bucket: process.env.AWS_TERRAFORM_BUCKET,
    key: `${process.env.SERVICE_NAME}/state.tf`,
    region: AWS.region,
    acl: "bucket-owner-full-control"
}

export const DOMAINS = [
    "kuwabuga.com"
]