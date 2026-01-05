import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import {
  BookingInfo,
  CreateIntentRequest,
  CreateIntentResponse,
} from "../types/payment.types";
import { GraphQLClient } from "./GraphQL/GraphQLClient";
import { BookingPriceInfo } from "./GraphQL/GraphQLTypes";

export class PaymentService {
  private stripe: Stripe;
  private graphQLClient: GraphQLClient;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
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
    let result = await this.graphQLClient.verifyBooking(draftId, token);
    let priceInfo: BookingPriceInfo | null = null;
    if (!result.data?.verifyScheduleBooking.success) {
      try {
        /**
         * Get booking details to get other price info.
         */
        const booking = await this.graphQLClient.getBooking(draftId, token);
        /**
         * Update price from verifybooking response. price info from booking is required. else, it overrides the json. data being lost
         */
        let updatedPrice: BookingPriceInfo = {
          ...booking.data.ferryBookingDraft.priceInfo,
          SailingFare:
            result.data.verifyScheduleBooking.calculatedPrices.sailingPrice?.toFixed(
              2
            ),
          TotalPrice:
            result.data.verifyScheduleBooking.calculatedPrices.totalPrice?.toFixed(
              2
            ),
        };
        /**
         * Update the price info of the booking
         */
        const updateResult = await this.graphQLClient.updateBookingPriceInfo(
          draftId,
          token,
          updatedPrice
        );

        priceInfo =
          updateResult?.data?.updateFerryBookingDraft?.ferryBookingDraft
            ?.priceInfo || null;

        /**
         * Verify one more time for confirmation
         */
        result = await this.graphQLClient.verifyBooking(draftId, token);
        if (!result.data?.verifyScheduleBooking.success) {
          throw new Error();
        }
      } catch (e) {
        return {
          statusCode: 400,
          status: false,
          error: result.data?.verifyScheduleBooking.message,
        };
      }
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
      priceInfo,
      session_id: stripeIntent.id,
      client_secret: stripeIntent.client_secret,
      stripe_status: stripeIntent.status,
    };
  }
}
