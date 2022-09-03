import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";
import { AWS_REGION } from "@/config";

export const buildAWSProvider = (scope: Construct, id = "default", region = AWS_REGION) => {
  return new AwsProvider(scope, `${id}-aws-provider`, {
    region: region,
    alias: region
  });
};