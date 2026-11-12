resource "aws_s3_bucket" "mauvais" {
  bucket = "bucket-public"
}

resource "aws_s3_bucket_acl" "mauvais" {
  bucket = aws_s3_bucket.mauvais.id
  acl    = "public-read"
}

resource "aws_s3_bucket_public_access_block" "mauvais" {
  bucket                  = aws_s3_bucket.mauvais.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
