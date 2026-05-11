module "vpc" {
  source = "./Modules/vpc"

  vpc_name              = var.vpc_name
  vpc_cidr              = var.vpc_cidr
  public_subnets_cidrs  = var.public_subnets_cidrs  # Matches left and right exactly
  private_subnets_cidrs = var.private_subnets_cidrs # Matches left and right exactly
  availability_zones    = var.availability_zones    # Matches left and right exactly
}

module "iam" {
  source = "./Modules/iam"

  eks_cluster_role_name = var.eks_cluster_role_name
  node_group_role_name  = var.node_group_role_name
}

module "rds" {
  source             = "./Modules/rds"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = [module.vpc.private_subnet_1_id, module.vpc.private_subnet_2_id]
  eks_sg_id          = module.eks.cluster_security_group_id

  # Ensure these variable names match exactly what we put in variables.tf
  db_username = var.db_username
  dbPassword  = var.dbPassword
  jwtSecret   = var.jwtSecret # Passing this down in case the module needs it
}

module "eks" {
  source           = "./Modules/eks"
  cluster_role_arn = module.iam.eks_cluster_role_arn
  node_role_arn    = module.iam.node_group_role_arn

  subnet_ids = [module.vpc.private_subnet_1_id, module.vpc.private_subnet_2_id]
}

