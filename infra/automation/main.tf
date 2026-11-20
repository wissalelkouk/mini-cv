resource "aws_s3_bucket" "attachments" {
  bucket = "mini-cv-auto-attachments"
}

resource "aws_sqs_queue" "contact" {
  name = "mini-cv-auto-contact-queue"
}

# nosemgrep: terraform.aws.security.aws-dynamodb-table-unencrypted.aws-dynamodb-table-unencrypted
resource "aws_dynamodb_table" "contacts" {
  name         = "mini-cv-auto-contacts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

# Terraform génère l'inventaire Ansible
resource "local_file" "inventory" {
  filename = "${path.module}/ansible/inventory.ini"
  content  = <<-EOT
    [serveurs]
    ubuntu-tp ansible_host=${var.vm_ip} ansible_user=vagrant ansible_ssh_private_key_file=${pathexpand(var.ssh_key)}
  EOT
}

# Puis lance Ansible une fois l'infrastructure et l'inventaire prêts
resource "terraform_data" "ansible" {
  triggers_replace = [local_file.inventory.content, filemd5("${path.module}/ansible/playbook.yml")]

  provisioner "local-exec" {
    working_dir = "${path.module}/ansible"
    command     = "ansible-playbook -i inventory.ini playbook.yml"
  }

  depends_on = [aws_s3_bucket.attachments, aws_sqs_queue.contact, aws_dynamodb_table.contacts]
}
