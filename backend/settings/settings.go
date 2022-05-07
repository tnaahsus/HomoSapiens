package settings

import (
	"os"
)

var (
	ConnectionConfig string
	Host             string
)

func InitializeSettings() {

	// Database Configurations
	ConnectionConfig = os.Getenv("CONNECTION_CONFIG")
	Host = os.Getenv("ALLOWED_HOST")

}
