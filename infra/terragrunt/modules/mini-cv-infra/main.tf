resource "aws_s3_bucket" "attachments" {
  bucket = "${var.project_name}-${var.environment}-attachments"
}

resource "aws_sqs_queue" "contact" {
  name = "${var.project_name}-${var.environment}-contact-queue"
}

resource "aws_dynamodb_table" "contacts" {
  name         = "${var.project_name}-${var.environment}-contacts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
