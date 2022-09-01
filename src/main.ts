import { App } from "cdktf";
import { DomainsStack } from "@/stacks/domains";
import { CertificatesStack } from "@/stacks/certificates";

const app = new App();
new DomainsStack(app, "domains-stack");
new CertificatesStack(app, "certificates-stack");
app.synth();
