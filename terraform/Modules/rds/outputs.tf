output "rds_endpoint" {
  description = "The connection endpoint for the database"
  value       = aws_db_instance.main.endpoint
}

output "db_name" {
  value = aws_db_instance.main.db_name
}

output "rds_port" {
  description = "The port the database is listening on"
  value       = aws_db_instance.main.port
}
