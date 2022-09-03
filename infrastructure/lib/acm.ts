import { Construct } from "constructs";
import { TerraformResourceLifecycle } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { DataAwsRoute53Zone, Route53Record } from "@cdktf/provider-aws/lib/route53";
import { AcmCertificate, AcmCertificateConfig, AcmCertificateValidation, AcmCertificateValidationConfig } from "@cdktf/provider-aws/lib/acm";
import { DEFAULTS } from "@/config";

export const createCertificate = (
  scope: Construct, 
  id = "default", 
  hostedZone: DataAwsRoute53Zone, 
  provider: AwsProvider | undefined = undefined
): AcmCertificate => {
  return new AcmCertificate(scope, `${id}-certificate`, <AcmCertificateConfig>{
    domainName: hostedZone.name,
    subjectAlternativeNames: [`*.${hostedZone.name}`],
    validationMethod: "DNS",
    tags: DEFAULTS.tags,
    lifecycle: <TerraformResourceLifecycle>{
      createBeforeDestroy: true
    },
    provider: provider
  });
};

export const validateCertificate = (
  scope: Construct,
  id = "default",
  certificate: AcmCertificate,
  recordValidation: Route53Record,
  provider: AwsProvider | undefined = undefined
): AcmCertificateValidation => {
  const certificateValidation = new AcmCertificateValidation(scope, `${id}-certificate-validation`, 
      <AcmCertificateValidationConfig>{
      	certificateArn: certificate.arn,
      	provider: provider
      }
  );
  certificateValidation.addOverride("validation_record_fqdns", `\${[for record in aws_route53_record.${recordValidation.friendlyUniqueId} : record.fqdn]}`);
  return certificateValidation;
};