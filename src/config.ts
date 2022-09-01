export const DEFAULTS = {
	comment: "Managed by Terraform CDK",
	tags: undefined
}

export const AWS = {
	region: process.env.AWS_REGION || "us-east-1"
}

export const BACKEND = {
	bucket: process.env.AWS_TERRAFORM_BUCKET,
	baseKey: `${process.env.SERVICE_NAME}`,
	region: AWS.region,
	acl: "bucket-owner-full-control"
}

export const DOMAINS = [
	"kuwabuga.com"
]