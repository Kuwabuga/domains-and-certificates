import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";
import { AWS_REGION } from "@/config";

export const buildAWSProvider = (scope: Construct, id = "default", region = AWS_REGION) => {
  let alias = region;
  if (id == "default") {
    alias = undefined;
  }

  return new AwsProvider(scope, `aws-${id}-provider`, {
    region: region,
    alias: alias
  });
};