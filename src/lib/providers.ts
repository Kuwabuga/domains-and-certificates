import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";

export const buildAWSProvider = (scope: Construct, id: string, region: string) => {
	return new AwsProvider(scope, `${id}-aws-provider`, {
		region: region,
	});
}