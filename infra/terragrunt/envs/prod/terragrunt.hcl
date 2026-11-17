include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../modules/mini-cv-infra"
}

inputs = {
  environment = "prod"
}
