output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}


output "database_url" {
  description = "The endpoint to put in my Kubernetes ConfigMap"
  value       = module.rds.rds_endpoint
}

output "database_port" {
  value = module.rds.rds_port
}