import { DEFAULTS, AWS, BACKEND, DOMAINS } from "./config";
import { Construct } from "constructs";
import { App, S3Backend, S3BackendProps, TerraformResourceLifecycle, TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { Route53Record, Route53Zone, Route53ZoneConfig } from "@cdktf/provider-aws/lib/route53";
import { AcmCertificate, AcmCertificateConfig, AcmCertificateValidation } from "@cdktf/provider-aws/lib/acm";

class DomainsCertificatesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new S3Backend(this, <S3BackendProps>{
      bucket: BACKEND.bucket,
      key: BACKEND.key,
      region: BACKEND.region,
      acl: BACKEND.acl
    });

    new AwsProvider(this, "provider", {
      region: AWS.region,
    });

    DOMAINS.forEach((domainName: string) => {
      const hostedZone = new Route53Zone(this, `${domainName}-hostedZone`, <Route53ZoneConfig>{
        name: domainName,
        comment: DEFAULTS.comment
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

const app = new App();
new DomainsCertificatesStack(app, "domains-and-certificates-stack");
app.synth();
