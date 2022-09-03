import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";
import { DataAwsRoute53Zone, DataAwsRoute53ZoneConfig, Route53Record, Route53RecordConfig, Route53Zone, Route53ZoneConfig } from "@cdktf/provider-aws/lib/route53";
import { AcmCertificate } from "@cdktf/provider-aws/lib/acm";
import { DEFAULTS } from "@/config";

export const createHostedZone = (scope: Construct, domainName: string): Route53Zone => {
  return new Route53Zone(scope, `${domainName}-hostedZone`, <Route53ZoneConfig>{
    name: domainName,
    comment: DEFAULTS.comment
  });
};

export const getHostedZone = (scope: Construct, domainName: string): DataAwsRoute53Zone => {
  return new DataAwsRoute53Zone(scope, `${domainName}-hostedZone`, <DataAwsRoute53ZoneConfig>{
    name: domainName
  });
};

export const validateRecord = (
  scope: Construct, 
  id = "default", 
  hostedZone: DataAwsRoute53Zone, 
  certificate: AcmCertificate, 
  provider: AwsProvider | undefined = undefined
): Route53Record => {
  const recordValidation = new Route53Record(scope, `${id}-record-validation`, <Route53RecordConfig>{
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
  return recordValidation;
};