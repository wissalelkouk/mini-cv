output "bucket_name" { value = aws_s3_bucket.attachments.bucket }
output "queue_url"   { value = aws_sqs_queue.contact.url }
output "table_name"  { value = aws_dynamodb_table.contacts.name }
output "vm_ip"       { value = var.vm_ip }
