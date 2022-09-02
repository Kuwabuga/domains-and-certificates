# Domains and Certificates

## Current status
[![Linting and Unit Tests](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/run_linting_and_tests.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/run_linting_and_tests.yml)
[![Setup domains in Route53](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_domains.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_domains.yml)
[![Setup & validate certificates using ACM](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_certificates.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/domains-and-certificates/actions/workflows/setup_certificates.yml)

## Description
This service is responsible for, based on the list of domains provided, to:
1. Create a hosted zone in Route53
2. After we setup the DNS servers and they propragated through our domain, setup the certificates, in the spicified AWS region (and us-east-1)

## Technologies
It was used the Terraform CDK in order to define our infrastructure, written in TypeScript
