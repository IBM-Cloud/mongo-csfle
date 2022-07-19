resource "ibm_database" "mongodb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "mongodbee-encryption"
  service           = "databases-for-mongodb"
  plan              = "enterprise"
  location          = var.region
  version           = "4.4"
  adminpassword = var.admin_password

  group {
    group_id = "member"

    members {
      allocation_count = 3
    }

    memory {
      allocation_mb = 14336
    }

    disk {
      allocation_mb = 20480
    }

    cpu {
      allocation_count = 6
    }
  }

  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}


data "ibm_database_connection" "icd_conn" {
  deployment_id = ibm_database.mongodb.id
  user_type     = "database"
  user_id       = "admin"
  endpoint_type = "public"
}

output "url" {
  value = ibm_database.mongodb.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}

output "cert" {
  value = ibm_database.mongodb.connectionstrings[0].certbase64
}