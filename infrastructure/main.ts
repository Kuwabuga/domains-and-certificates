import { App } from "cdktf";
import { ParametersStack } from "@/stacks/parameters";
import { DomainsStack } from "@/stacks/domains";
import { CertificatesStack } from "@/stacks/certificates";

const app = new App();
new ParametersStack(app, "parameters-stack");
new DomainsStack(app, "domains-stack");
new CertificatesStack(app, "certificates-stack");
app.synth();
