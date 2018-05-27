# terraform-npm
*An NPM executable package for HashiCorp's Terraform.*

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![terraform: v0.11.7](https://img.shields.io/badge/terraform-v0.11.7.0-6253f4.svg)](https://www.terraform.io) [![npm downloads](https://img.shields.io/npm/dw/hashicorp-terraform.svg?maxAge=3600)]()

### Preamble
I assembled [Terraform](https://terraform.io) into an NPM package in order for me to include it in other projects that depended on the executable. I wanted to be able to publish NPM modules with scripts like this:
```json
"scripts": {
  "plan": "terraform plan -out=my-tfplan"
}
```
But without having to worry about asking users to download Terraform externally.

### Installation
To use `terraform` as an NPM package, include it in your `package.json` dependencies:
```bash
# If you're using Yarn (recommended)
yarn add hashicorp-terraform

# If you're using NPM
npm install hashicorp-terraform
```

### Usage
This package cannot currently be used as a typical Node module, as it does not export any entry points; it only symlinks a binary. So, the recommended use case is to use it in your `package.json` scripts:
```json
"scripts": {
    "plan": "terraform plan -out=my-tfplan",
    "apply": "terraform apply",
    "execute": "terraform apply \"my-tfplan\"",
    "destroy": "terraform destroy"
}
```
