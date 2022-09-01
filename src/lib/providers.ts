import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";
import { AWS } from "@/config";

export const buildAWSProvider = (scope: Construct, id: string) => {
	return new AwsProvider(scope, `${id}-aws-provider`, {
		region: AWS.region,
	});
}