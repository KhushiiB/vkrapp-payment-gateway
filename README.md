# vkrapp-payment-gateway

## steps to build
- clone repo
- cd backend
- yarn install
- npm run build  
- docker build -t vkr-payment-bff .
- docker run -p 8080:4000 -e STRIPE_SECRET_KEY="sk_test_51SY74vCX8PYskqms2NkZ97XMstWInuJVCcT1HwrEChhqkjs6KOCc3BPQmrzdGryAvv78IRNWK96RZk0dX0Pw8Zj900AfbH2zaI" --name api-container -d vkr-payment-bff