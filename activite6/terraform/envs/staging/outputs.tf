output "bucket_name" {
  value = module.s3.bucket_name
}

output "queue_url" {
  value = module.sqs.queue_url
}

output "table_name" {
  value = module.dynamodb.table_name
}
