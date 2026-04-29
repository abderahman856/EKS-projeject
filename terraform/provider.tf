terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws" # <-- Check this EXACT string
      version = "~> 5.0"
    }
  }
}