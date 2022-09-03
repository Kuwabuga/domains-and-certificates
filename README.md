# Domains and Certificates

## Current status
[![Linting and Unit Tests](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/run_linting_and_tests.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/run_linting_and_tests.yml)<br>
[![Setup parameters in Parameter Store](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_parameters.yml/badge.svg)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_parameters.yml)<br>
[![Setup domains in Route53](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_domains.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_domains.yml)<br>
[![Setup & validate certificates using ACM](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_certificates.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_certificates.yml)<br>

## Description
This service is responsible for, based on the list of domains provided, to:
1. Create a hosted zone in Route53
2. After we setup the DNS servers and they propragated through our domain, setup the certificates, in the spicified AWS region (and us-east-1)

## Technologies
It was used the Terraform CDK in order to define our infrastructure, written in TypeScript

## Workflow

1. Run the pipeline "Setup parameters in Parameter Store"
2. Update the parameters values with the actual list of values
    - "domains" should include a list of hosted zones to be created in Route53
    - "regions" should contain a list of AWS regions that we want to generate SSL certificates for each of our domains
3. Run the pipeline "Setup domains in Route53"
4. After the hosted zones are created in Route53, map the domains DNS
    - go to your domain manager and set the custom DNS to match the ones given by Route53
5. Run the pipeline "Setup & validate certificates using ACM"
    - there should be one SSL certificate for each hosted zone defined in Route53, in each region specified
