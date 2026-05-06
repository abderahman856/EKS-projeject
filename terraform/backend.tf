terraform {
  required_version = ">= 1.0.0"

  # This connects your project to the S3 bucket you just created
  backend "s3" {
    bucket         = "baashe-ecommerce-terraform-state" # The ID from your screenshot
    key            = "dev/eks-cluster/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}