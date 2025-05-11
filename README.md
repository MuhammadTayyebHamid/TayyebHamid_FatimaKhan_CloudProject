# Blog Application Deployment Guide
This guide provides step-by-step instructions for deploying the Blog Application on AWS. The application consists of a React frontend and a Node.js/Express backend with PostgreSQL database integration.

## Prerequisites
* AWS account with access to EC2, Elastic Beanstalk, RDS, and S3
* GitHub repository with your blog application code
* SSH key pair for EC2 access

## Deployment Overview
The application architecture uses:

* Frontend: Deployed on AWS Elastic Beanstalk
* Backend: Deployed on Amazon EC2 with Docker
* Database: Amazon RDS (PostgreSQL)
* File Storage: Amazon S3

### 1. Backend Deployment (EC2)
#### 1.1 Launch EC2 Instance

* Go to EC2 Dashboard and click "Launch Instance"
* Choose Amazon Linux 2023
* Select t3.micro instance type 
* Configure Security Group with:
    - SSH (Port 22) from your IP
    - HTTP (Port 80) from anywhere
    - Custom TCP (Port 3000) from anywhere

* Launch instance and select your key pair

#### 1.2 Deploy Backend Application

* SSH into your EC2 instance
* Install required packages
* Clone your repository and configure the backend

### Frontend Deployment (Elastic Beanstalk)
#### 2.1 Deploy to Elastic Beanstalk

* Go to Elastic Beanstalk Dashboard
* Click "Create Application"
* Enter application name and choose Node.js platform
* Upload the deploy.zip file
* Click "Create Application"

### 3. Database Setup (RDS)
#### 3.1 Create PostgreSQL Instance

* Go to RDS Dashboard
* Click "Create Database"
* Choose PostgreSQL
* Select "Free tier" for development 

#### 3.2 Configure Security Group

* Ensure the database security group allows connections from your EC2 instance:
    - Go to the RDS instance security group
      - Add inbound rule:
      - Type: PostgreSQL (5432)
      - Source: Your EC2 security group ID

### 4. Storage Configuration (S3)
#### 4.1 Create S3 Bucket

* Go to S3 Dashboard
* Click "Create bucket"
* Enter unique bucket name
* Configure:
    - Region: Same as your EC2 and EB instances
    - Block all public access: Disabled 
