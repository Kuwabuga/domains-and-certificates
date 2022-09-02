import { Construct } from "constructs";
import { TerraformResourceLifecycle, TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { DataAwsRoute53Zone, DataAwsRoute53ZoneConfig, Route53Record, Route53RecordConfig } from "@cdktf/provider-aws/lib/route53";
import { AcmCertificate, AcmCertificateConfig, AcmCertificateValidation, AcmCertificateValidationConfig } from "@cdktf/provider-aws/lib/acm";
import { DEFAULTS, DOMAINS, AWS } from "@/config";
import { buildAWSProvider } from "@/lib/providers";
import { buildS3Backend } from "@/lib/backends";

export class CertificatesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "certificates");

    const us = buildAWSProvider(this, "us-certificates", AWS.administrativeRegion);
    const europe = buildAWSProvider(this, "eu-certificates", AWS.region);

    DOMAINS.forEach((domainName: string) => {
      const hostedZone = new DataAwsRoute53Zone(this, `${domainName}-hostedZone`, <DataAwsRoute53ZoneConfig>{
        name: domainName
      });

      this.buildValidationResources(domainName, AWS.administrativeRegion, hostedZone, us);
      this.buildValidationResources(domainName, AWS.region, hostedZone, europe);
    });
  }

  buildValidationResources(domainName: string, region: string, hostedZone: DataAwsRoute53Zone, provider: AwsProvider): void {
    const certificate = new AcmCertificate(this, `${domainName}-${region}-certificate`, 
      <AcmCertificateConfig>{
      	domainName: hostedZone.name,
      	subjectAlternativeNames: [`*.${hostedZone.name}`],
      	validationMethod: "DNS",
      	tags: DEFAULTS.tags,
      	lifecycle: <TerraformResourceLifecycle>{
      		createBeforeDestroy: true
      	},
      	provider: provider
      }
    );

    const recordValidation = new Route53Record(this, `${domainName}-${region}-certificate-record`, 
      <Route53RecordConfig>{
      	zoneId: hostedZone.zoneId,
      	allowOverwrite: true,
      	name: "${each.value.name}",
      	records: ["${each.value.record}"],
      	ttl: 60,
      	type: "${each.value.type}",
      	provider: provider
      }
    );
    recordValidation.addOverride("for_each",
      `\${{
        for dvo in aws_acm_certificate.${certificate.friendlyUniqueId}.domain_validation_options : dvo.domain_name => {
          name   = dvo.resource_record_name
          record = dvo.resource_record_value
          type   = dvo.resource_record_type
        }
      }}`,
    );

    const certificateValidation = new AcmCertificateValidation(this, `${domainName}-${region}-certificate-validation`, 
      <AcmCertificateValidationConfig>{
      	certificateArn: certificate.arn,
      	provider: provider
      }
    );
    certificateValidation.addOverride("validation_record_fqdns", `\${[for record in aws_route53_record.${recordValidation.friendlyUniqueId} : record.fqdn]}`);
  }
}