#!/bin/bash

# PostgreSQL setup script for task management system
# This script creates the required database user and database

echo "Setting up PostgreSQL for Task Management System..."

# Database configuration
DB_USER="taskuser"
DB_PASSWORD="taskpass"
DB_NAME="taskdb"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create user if it doesn't exist
echo "Creating database user '$DB_USER'..."
psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
    psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create database if it doesn't exist
echo "Creating database '$DB_NAME'..."
psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
    psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Grant privileges
echo "Granting privileges..."
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
psql postgres -c "ALTER USER $DB_USER CREATEDB;"

echo "PostgreSQL setup completed successfully!"
echo ""
echo "Database credentials:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
echo "You can now run 'npm run dev' in the backend directory."