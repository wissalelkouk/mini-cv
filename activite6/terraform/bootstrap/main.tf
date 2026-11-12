resource "aws_s3_bucket" "mini_cv" {
  bucket        = var.bucket_name
  force_destroy = true
}

resource "aws_sqs_queue" "notifications" {
  name = var.queue_name
}

# nosemgrep: terraform.aws.security.aws-dynamodb-table-unencrypted.aws-dynamodb-table-unencrypted
# Lab local : DynamoDB chiffre déjà avec une clé gérée par AWS, une clé KMS dédiée n'a pas de sens sur Floci.
resource "aws_dynamodb_table" "demo" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }
}
