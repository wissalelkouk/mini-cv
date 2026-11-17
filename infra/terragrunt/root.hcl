generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<PROVIDER
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  endpoints {
    s3       = "http://localhost:4566"
    sqs      = "http://localhost:4566"
    dynamodb = "http://localhost:4566"
  }
}
PROVIDER
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket                      = "mini-cv-tfstate"
    key                         = "${path_relative_to_include()}/terraform.tfstate"
    region                      = "us-east-1"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_requesting_account_id  = true
    use_path_style              = true
    endpoints = {
      s3 = "http://localhost:4566"
    }
  }
}
