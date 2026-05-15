# EKS Microservices Commerce Platform
=======
>>>>>>> addbde4 (removed all the unucessary things - last push)

Production-style cloud-native e-commerce platform built on Kubernetes using a microservices architecture on Amazon EKS.

## Project Overview
=======
>>>>>>> addbde4 (removed all the unucessary things - last push)

A production-style cloud-native e-commerce platform built on Kubernetes using a microservices architecture. The platform consists of seven independent services deployed on Amazon EKS and managed through GitOps workflows.

The project focuses on modern DevOps and platform engineering practices including Infrastructure as Code, GitOps, automated CI/CD pipelines, Kubernetes networking, observability, and secure ingress management.
=======

## Architecture Diagram

![Architecture Diagram](docs/Architecture-diagram.gif)
=======

## Microservices

| Service                | Responsibility                        |
| ---------------------- | ------------------------------------- |
| Frontend Service       | User-facing web application           |
| Authentication Service | User authentication and authorization |
| Product Service        | Product catalog management            |
| Order Service          | Order processing                      |
| Payment Service        | Payment handling                      |
| Cart Service           | Shopping cart management              |
| Notification Service   | Notifications and messaging           |

## Tech Stack

### Cloud & Infrastructure

* Amazon EKS
* Terraform
* AWS VPC Networking
* IAM Roles & Security Groups

### Containers & Orchestration

* Docker
* Kubernetes
* Helm Umbrella Charts
* NGINX Ingress Controller

### GitOps & CI/CD

* GitHub Actions
* ArgoCD
* Amazon ECR

### Security & Networking

* Cert-Manager
* ExternalDNS
* TLS/HTTPS
* Cloudflare DNS

### Monitoring & Observability

* Prometheus
* Grafana

## Infrastructure Summary

The infrastructure is provisioned using Terraform and follows a modular structure.

### Infrastructure Components

* VPC with public and private subnets
* Amazon EKS cluster
* Managed worker nodes
* IAM roles and policies
* Security groups
* Internet Gateway and NAT Gateway
* ECR repositories

### Kubernetes Platform Components

* NGINX Ingress Controller
* Cert-Manager
* ExternalDNS
* ArgoCD
* Prometheus & Grafana

## CI/CD + GitOps Flow

The platform uses GitHub Actions for CI/CD automation and ArgoCD for GitOps-based deployments.

### CI/CD Pipelines

#### Terraform Pipelines

* Terraform Plan
* Terraform Apply
* Terraform Destroy

#### Application Pipelines

* Docker image build
* Docker image tagging
* Push images to Amazon ECR
* Kubernetes deployment updates

### GitOps Workflow

1. Developers push code changes.
2. GitHub Actions builds and pushes Docker images to Amazon ECR.
3. Kubernetes manifests and Helm values are updated.
4. ArgoCD detects Git changes automatically.
5. ArgoCD synchronizes the cluster state with the desired state stored in Git.
6. Kubernetes performs rolling updates for the services.

## Monitoring & Observability

The monitoring stack is implemented using Prometheus and Grafana.

### Monitoring Features

* Cluster metrics monitoring
* Pod and node monitoring
* CPU and memory usage dashboards
* Ingress traffic monitoring
* Kubernetes workload visibility

## Networking & Security

The platform includes automated networking and TLS management.

### Features

* HTTPS with Cert-Manager
* Automatic DNS record management using ExternalDNS
* Cloudflare DNS integration
* NGINX Ingress routing
* Kubernetes namespace isolation

## How to Deploy

### Prerequisites

* AWS Account
* Terraform
* kubectl
* Helm
* Docker
* AWS CLI

### Infrastructure Deployment

```bash
terraform init
terraform plan
terraform apply
```

<<<<<<< HEAD
### Kubernetes Platform Deployment
=======
If your Postgres username/password differs, update each service `.env` file after copying from `.env.example`.


Run in each directory:
>>>>>>> addbde4 (removed all the unucessary things - last push)

```bash
kubectl apply -f k8s/
```

<<<<<<< HEAD
### ArgoCD Deployment
=======
>>>>>>> addbde4 (removed all the unucessary things - last push)

ArgoCD continuously watches the Git repository and automatically synchronizes the Kubernetes cluster state.

## Key Features

* Microservices-based architecture
* Kubernetes-native deployment model
* Helm umbrella chart management
* GitOps workflow using ArgoCD
* Automated CI/CD pipelines
* Infrastructure as Code with Terraform
* Automated HTTPS and DNS management
* Centralized monitoring and observability
* Production-style Kubernetes platform architecture

<<<<<<< HEAD
## Repository Structure

```text
.
├── .github/workflows
├── database
├── docs
├── frontend
├── gitops
├── kubernetes
└── services
├── terraform
└──.gitignore
└── .pre-commit-config.yaml
├── README.md
└── compose.yaml
=======
>>>>>>> addbde4 (removed all the unucessary things - last push)


```

## Future Improvements

<<<<<<< HEAD
* Canary deployments
* Blue/Green deployment strategies
* Centralized logging stack
* Multi-environment GitOps structure
* Advanced alerting and notifications
* Service mesh integration
=======
```bash
./stop-all.sh
```


```bash
cd services/auth && npm run dev
cd services/product && npm run dev
cd services/cart && npm run dev
cd services/order && npm run dev
cd services/payment && npm run dev
cd services/notification && npm run dev
cd frontend && npm run dev
```


1. Open frontend at `http://localhost:5173`
2. Sign up and login
3. Browse products and add items to cart
4. Open checkout and place order
5. Payment is simulated in payment service
6. Notification message is logged in notification service console
7. View order history in Orders page


See `docs/API.md` for all endpoints and payloads.
>>>>>>> addbde4 (removed all the unucessary things - last push)
