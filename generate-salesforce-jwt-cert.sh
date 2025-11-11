#!/bin/bash

# Generate RSA key pair for Salesforce JWT Bearer Flow
# This script creates a private key and public certificate

echo "Generating RSA key pair for Salesforce JWT Bearer Flow..."
echo ""

# Generate private key (2048-bit RSA)
openssl genrsa -out salesforce_private_key.pem 2048

# Generate public certificate from private key
openssl rsa -in salesforce_private_key.pem -pubout -out salesforce_public_cert.pem

echo "✅ Generated files:"
echo "   - salesforce_private_key.pem (KEEP THIS SECRET - store in env var or secure file)"
echo "   - salesforce_public_cert.pem (Upload this to Salesforce ECA)"
echo ""
echo "📋 Next steps:"
echo "   1. Upload salesforce_public_cert.pem to your Salesforce External Client App"
echo "   2. Store salesforce_private_key.pem securely (env var or file path)"
echo "   3. Set SALESFORCE_PRIVATE_KEY_PATH or SALESFORCE_PRIVATE_KEY in your .env"
echo ""
echo "⚠️  SECURITY WARNING: Never commit the private key to git!"

