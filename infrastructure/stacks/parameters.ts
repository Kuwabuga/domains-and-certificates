import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { createRegionsParameter, createDomainsParameter } from "@/lib/ssm";

export class ParametersStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    buildS3Backend(this, "parameters");
    buildAWSProvider(this);
    createRegionsParameter(this);
    createDomainsParameter(this);
  }
}