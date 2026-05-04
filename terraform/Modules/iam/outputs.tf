output "eks_cluster_role_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster role."
  value       = aws_iam_role.eks_cluster_role.arn
}

output "node_group_role_arn" {
  description = "The Amazon Resource Name (ARN) of the node group role."
  value       = aws_iam_role.eks_node_role.arn
}