variable "region" {
  type    = string
  default = "us-east-1"
}

variable "endpoint" {
  type    = string
  default = "http://localhost:4566"
}

variable "bucket_name" {
  type    = string
  default = "tf-demo-bucket"
}

variable "queue_name" {
  type    = string
  default = "notifications"
}

variable "table_name" {
  type    = string
  default = "demo-table"
}
