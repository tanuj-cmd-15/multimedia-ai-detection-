@echo off
echo Generating RSA key pair for JWT signing...

REM Create secrets directory
if not exist "auth-service\src\main\resources\secrets" mkdir "auth-service\src\main\resources\secrets"

REM Generate private key
openssl genrsa -out auth-service\src\main\resources\secrets\private_key.pem 2048

REM Extract public key from private key
openssl rsa -in auth-service\src\main\resources\secrets\private_key.pem -pubout -out auth-service\src\main\resources\secrets\public_key.pem

echo.
echo JWT keys generated successfully!
echo Private key: auth-service\src\main\resources\secrets\private_key.pem
echo Public key: auth-service\src\main\resources\secrets\public_key.pem
echo.
echo IMPORTANT: Keep private_key.pem secure and never commit it to git!
echo.

pause
