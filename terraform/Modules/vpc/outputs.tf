output "vpc_id" {
  description = ""
  value       = aws_vpc.my_vpc.id
}

output "public_subnets_ids" {
  description = ""
  value       = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

output "private_subnets_ids" {
  description = ""
  value       = [aws_subnet.private_1.id, aws_subnet.private_2.id]
}

output "nat_gateway_ip" {
  description = ""
  value       = aws_eip.my_eip.public_ip
}

output "private_subnet_1_id" {
  description = "The ID of the first private subnet"
  value       = aws_subnet.private_1.id
}

output "private_subnet_2_id" {
  description = "The ID of the second private subnet"
  value       = aws_subnet.private_2.id
}

output "public_subnet_1_id" {
  description = "The ID of the first private subnet"
  value       = aws_subnet.public_1.id
}

output "public_subnet_2_id" {
  description = "The ID of the second private subnet"
  value       = aws_subnet.public_2.id
}
