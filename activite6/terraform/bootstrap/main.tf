resource "aws_s3_bucket" "mini_cv" {
  bucket        = var.bucket_name
  force_destroy = true
}

resource "aws_sqs_queue" "notifications" {
  name = var.queue_name
}

resource "aws_dynamodb_table" "demo" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
