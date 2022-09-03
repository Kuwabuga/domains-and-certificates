import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { getRegionsParameter, getDomainsParameter } from "@/lib/ssm";
import { getHostedZone, validateRecord } from "@/lib/route53";
import { createCertificate, validateCertificate } from "@/lib/acm";
import { AWS_REGION } from "@/config";

export class CertificatesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "certificates");
    const defaultProvider = buildAWSProvider(this);

    let regions = getRegionsParameter(this);
    const domains = getDomainsParameter(this);

    const providers: AwsProvider[] = [];
    if (regions.includes(AWS_REGION)) {
      regions = regions.filter(region => region !== AWS_REGION);
      providers.push(defaultProvider);
    }

    regions.forEach((region, index) => {
      providers.push(buildAWSProvider(this, `${index}`, region));
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