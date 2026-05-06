# 1. DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-rds-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "E-commerce DB Subnet Group"
  }
}

# 2. RDS Security Group
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow inbound traffic from EKS"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from EKS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. The RDS Instance
resource "aws_db_instance" "main" {
  identifier           = var.db_name
  allocated_storage    = 20
  db_name              = var.db_name 
  engine               = "postgres"
  engine_version       = "16.1"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  
  # --- UPDATED FOR MANUAL PASSWORD ---
  manage_master_user_password = false 
  password                    = var.dbPassword # This pulls from your .tfvars

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  
  skip_final_snapshot    = true
  publicly_accessible    = false
  storage_type           = "gp2"
}