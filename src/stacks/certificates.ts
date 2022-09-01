import { Construct } from "constructs";
import { TerraformResourceLifecycle, TerraformStack } from "cdktf";
import { Route53Record, Route53Zone, Route53ZoneConfig } from "@cdktf/provider-aws/lib/route53";
import { AcmCertificate, AcmCertificateConfig, AcmCertificateValidation } from "@cdktf/provider-aws/lib/acm";
import { DEFAULTS, DOMAINS } from "@/config";
import { buildAWSProvider } from "@/lib/providers"
import { buildS3Backend } from "@/lib/backends"

export class CertificatesStack extends TerraformStack {
	constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "certificates");

		buildAWSProvider(this, "certificates");

    DOMAINS.forEach((domainName: string) => {
      const hostedZone = new Route53Zone(this, `${domainName}-hostedZone`, <Route53ZoneConfig>{
        name: domainName
      });
  
      const certificate = new AcmCertificate(this, `${domainName}-certificate`, <AcmCertificateConfig>{
        domainName: hostedZone.name,
        subjectAlternativeNames: [`*.${hostedZone.name}`],
        validationMethod: "DNS",
        tags: DEFAULTS.tags,
        lifecycle: <TerraformResourceLifecycle>{
          createBeforeDestroy: true
        }
      });

      const recordValidation = new Route53Record(this, `${domainName}-certificate-record`, {
        zoneId: hostedZone.zoneId,
        allowOverwrite: true,
        name: "${each.value.name}",
        records: ["${each.value.record}"],
        ttl: 60,
        type: "${each.value.type}",
      });
      recordValidation.addOverride("for_each",
        `\${{
          for dvo in aws_acm_certificate.${certificate.friendlyUniqueId}.domain_validation_options : dvo.domain_name => {
            name   = dvo.resource_record_name
            record = dvo.resource_record_value
            type   = dvo.resource_record_type
          }
        }}`,
      );
      
      const certificateValidation = new AcmCertificateValidation(this, `${domainName}-certificate-validation`, {
        certificateArn: certificate.arn,
      });
      certificateValidation.addOverride("validation_record_fqdns", `\${[for record in aws_route53_record.${recordValidation.friendlyUniqueId} : record.fqdn]}`);
    })
  }
}