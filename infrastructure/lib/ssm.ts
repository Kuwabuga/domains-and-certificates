import { Construct } from "constructs";
import { DataAwsSsmParameter, DataAwsSsmParameterConfig, SsmParameter, SsmParameterConfig } from "@cdktf/provider-aws/lib/ssm";
import { ENVIRONMENT, SERVICE_NAME } from "@/config";

const regionsParameter = `/${ENVIRONMENT}/${SERVICE_NAME}/regions`;
const domainsParameter = `/${ENVIRONMENT}/${SERVICE_NAME}/domains`;

export const createRegionsParameter = (scope: Construct, id = "regions"): SsmParameter => {
  return new SsmParameter(scope, `${id}-list-parameter`, <SsmParameterConfig>{
    name: regionsParameter,
    description: "List of regions to create a certificate for each domain on Route53",
    type: "StringList",
    value: "UPDATE ME!"
  });
};

export const createDomainsParameter = (scope: Construct, id = "domains"): SsmParameter => {
  return new SsmParameter(scope, `${id}-list-parameter`, <SsmParameterConfig>{
    name: domainsParameter,
    description: "List of domains ro create on Route53",
    type: "StringList",
    value: "UPDATE ME!"
  });
};

export const getRegionsParameter = (scope: Construct, id = "regions"): string[] => {
  const domains = new DataAwsSsmParameter(scope, `${id}-list-parameter`, <DataAwsSsmParameterConfig>{
    name: regionsParameter
  });
  return domains.value.replace(" ", "").split(",");
};

export const getDomainsParameter = (scope: Construct, id = "domains"): string[] => {
  const domains = new DataAwsSsmParameter(scope, `${id}-list-parameter`, <DataAwsSsmParameterConfig>{
    name: domainsParameter
  });
  return domains.value.replace(" ", "").split(",");
};

