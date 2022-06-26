terraform {
  backend "s3" {
    region  = "us-east-1"
    bucket  = "github-stats-tfstate"
    key     = "terraform.tfstate"
    encrypt = true
  }
}
