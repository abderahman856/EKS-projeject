variable "eks_cluster_role_name" {
  description = "The name of the IAM role for the EKS cluster control plane"
  type        = string
}

variable "node_group_role_name" {
  description = "The name of the IAM role for the EKS node group"
  type        = string
}