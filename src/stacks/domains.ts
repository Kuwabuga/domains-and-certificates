import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { Route53Zone, Route53ZoneConfig } from "@cdktf/provider-aws/lib/route53";
import { DEFAULTS, DOMAINS, AWS } from "@/config";
import { buildAWSProvider } from "@/lib/providers"
import { buildS3Backend } from "@/lib/backends"

export class DomainsStack extends TerraformStack {
	constructor(scope: Construct, name: string) {
		super(scope, name);

		buildS3Backend(this, "domains");

		buildAWSProvider(this, "domains", AWS.region);

		DOMAINS.forEach((domainName: string) => {
			new Route53Zone(this, `${domainName}-hostedZone`, <Route53ZoneConfig>{
				name: domainName,
				comment: DEFAULTS.comment
			});
		})
	}
}