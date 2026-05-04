output "rds_endpoint" {
  description = "The connection endpoint for the database"
  value       = aws_db_instance.main.endpoint
}

output "rds_port" {
  value = aws_db_instance.main.port
}