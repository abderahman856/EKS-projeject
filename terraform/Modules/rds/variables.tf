variable "project_name" {
  type    = string
  default = "ecommerce-app"
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "eks_sg_id" {
  type = string
}

variable "db_name" {
  type    = string
  default = "ecommercemain"
}

variable "db_username" {
  type    = string
  default = "dbadmin"
}

# --- NEW VARIABLES FOR SECRETS ---
variable "dbPassword" {
  type      = string
  sensitive = true
}

variable "jwtSecret" {
  type      = string
  sensitive = true
}