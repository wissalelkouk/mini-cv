variable "endpoint" {
  type    = string
  default = "http://localhost:4566"
}

variable "vm_ip" {
  type    = string
  default = "192.168.56.10"
}

variable "ssh_key" {
  type    = string
  default = "~/mini-cv/vagrant-ubuntu/.vagrant/machines/ubuntu-tp/libvirt/private_key"
}
