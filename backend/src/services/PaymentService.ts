import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import {
  BookingInfo,
  CreateIntentRequest,
  CreateIntentResponse,
} from "../types/payment.types";
import { GraphQLClient } from "./GraphQL/GraphQLClient";

export class PaymentService {
  private stripe: Stripe;
  private graphQLClient: GraphQLClient;

  constructor() {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY,
      { apiVersion: "2023-10-16" }
    );
    this.graphQLClient = new GraphQLClient();
  }

  async createPaymentIntent(
    payload: CreateIntentRequest,
    token: string
  ): Promise<CreateIntentResponse> {
    const { user_id, draftId, currency } = payload;

    /**
     * Verify the booking
     */
    const result = await this.graphQLClient.verifyBooking(draftId, token);
    if (!result.data?.verifyScheduleBooking.success) {
      return {
        statusCode: 400,
        status: false,
        error: result.data?.verifyScheduleBooking.message,
      };
    }

    const bookingInfo = JSON.parse(
      result.data?.verifyScheduleBooking.data
    ) as BookingInfo;

    const stripeIntent = await this.stripe.paymentIntents.create(
      {
        amount: Math.round(bookingInfo.totalPrice * 100),
        currency: currency.toLowerCase(),
        description: `Cruise booking - ${draftId}`,
        metadata: { user_id, draft_id: draftId },
      },
      {
        idempotencyKey: draftId.toString(),
      }
    );

    /**
     * post intent-id to VKR backend
     * VKR backend will map intent-id to booking id
     */

    const updatePaymentResult = await this.graphQLClient.updatePaymentInfo(
      draftId,
      stripeIntent.id,
      "STRIPESDK",
      token
    );

    if (!updatePaymentResult.data.generatePaymentUrl.success) {
      return {
        statusCode: 401,
        status: false,
        error: updatePaymentResult.data.generatePaymentUrl.message,
      };
    }

    return {
      statusCode: 201,
      status: true,
      bookingInfo,
      session_id: stripeIntent.id,
      client_secret: stripeIntent.client_secret,
      stripe_status: stripeIntent.status,
    };
  }
}
