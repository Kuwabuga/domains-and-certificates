import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { getRegionsParameter, getDomainsParameter } from "@/lib/ssm";
import { getHostedZone, validateRecord } from "@/lib/route53";
import { createCertificate, validateCertificate } from "@/lib/acm";

export class CertificatesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "certificates");

    const regions = getRegionsParameter(this);
    const domains = getDomainsParameter(this);
    const providers: AwsProvider[] = [];

    regions.forEach(region => {
      providers.push(buildAWSProvider(this, region));
    });

    domains.forEach((domainName, index) => {
      const hostedZone = getHostedZone(this, `${index}`, domainName);
      providers.forEach((provider, index) => {
        const id = `${index}`;
        const certificate = createCertificate(this, id, hostedZone, provider);
        const recordValidation = validateRecord(this, id, hostedZone, certificate, provider);
        validateCertificate(this, id, certificate, recordValidation, provider);
      });
    });
  }
}