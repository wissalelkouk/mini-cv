output "bucket_name" {
  value = aws_s3_bucket.mini_cv.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.mini_cv.arn
}

output "queue_url" {
  value = aws_sqs_queue.notifications.id
}

output "queue_arn" {
  value = aws_sqs_queue.notifications.arn
}

output "table_name" {
  value = aws_dynamodb_table.demo.name
}
