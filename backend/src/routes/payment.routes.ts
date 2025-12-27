import express from "express";
import { createValidator } from "express-joi-validation";
import { PaymentController } from "../controllers/PaymentController";
import { createIntentValidation } from "../validators/PaymentValidator";
import ApiResponse from "../utils/ApiResponse";
import { authenticate } from "../services/GraphQL/GraphQLMiddleware";

const router = express.Router();
const controller = new PaymentController();
const validator = createValidator({
  passError: false,
  statusCode: 422
});

router.post(
  "/create-intent",
  validator.body(createIntentValidation.body),
  authenticate,
  ApiResponse(controller.createIntent)
);

router.get(
  "/test",
  (req, res) => {
    res.status(200).json({
      success: true
    })
  }
);

export default router;
