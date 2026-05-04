variable "vpc_name" {
  description = ""
  type        = string
}

variable "vpc_cidr" {
  description = ""
  type        = string
}

variable "public_subnets_cidrs" {
  description = ""
  type        = list(string)
}

variable "private_subnets_cidrs" {
  description = ""
  type        = list(string)
}

variable "availability_zones" {
  description = ""
  type        = list(string)
}
