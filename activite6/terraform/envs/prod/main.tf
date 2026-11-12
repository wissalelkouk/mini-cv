module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${var.env}-mini-cv-bucket"
}

module "sqs" {
  source     = "../../modules/sqs"
  queue_name = "${var.env}-notifications"
}

module "dynamodb" {
  source     = "../../modules/dynamodb"
  table_name = "${var.env}-table"
}
