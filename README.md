# Domains and Certificates

## Current status
[![Linting and Unit Tests](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/run_linting_and_tests.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/run_linting_and_tests.yml)<br>
[![Setup domains in Route53](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_domains.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_domains.yml)<br>
[![Setup & validate certificates using ACM](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_certificates.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_certificates.yml)<br>

## Description
This service is responsible for, based on the list of domains provided, to:
1. Create a hosted zone in Route53
2. After we setup the DNS servers and they propragated through our domain, setup the certificates, in the spicified AWS regions

## Technologies
It was used the Terraform CDK in order to define our infrastructure, written in TypeScript

## Workflow

1. Run the pipeline "Setup domains in Route53"
    - this will create all the hosted zones (domains) defined in the file `domains.ts`, for the given environment
2. After the hosted zones are created in Route53, map the domains DNS
    - go to your domain manager and set the custom DNS to match the ones given by Route53
3. Run the pipeline "Setup & validate certificates using ACM"
    - there should be one SSL certificate for each hosted zone defined in Route53, in each region specified in the file `domains.ts`
