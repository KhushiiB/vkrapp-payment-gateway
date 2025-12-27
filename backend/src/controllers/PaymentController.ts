import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";

export class PaymentController {
  private service: PaymentService;


  ensurePaymentServiceInitiated = () => {
    if(this.service) return;
    this.service = new PaymentService();
  }

  createIntent = async (req: Request, res: Response) => {
    this.ensurePaymentServiceInitiated()
    const result = await this.service.createPaymentIntent(
      {
        user_id: res.get("user_id"),
        draftId: req.body.draft_id,
        currency: req.body.currency
      },
      req.headers.authorization
    );

    return {
      data: result,
      message: "Payment intent",
      status: result.statusCode,
    };
  };
}
