import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { getDomainsParameter } from "@/lib/ssm";
import { createHostedZone } from "@/lib/route53";

export class DomainsStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "domains");
    buildAWSProvider(this);

    const domains = getDomainsParameter(this);
    domains.forEach((domainName: string) => {
      createHostedZone(this, domainName);
    });
  }
}