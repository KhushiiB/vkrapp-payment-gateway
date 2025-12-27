export interface CreateIntentRequest {
  user_id: string;
  draftId: number;
  currency: string;
  idempotency_key?: string;
}

export type CreateIntentResponse =
  | { status: boolean; statusCode: number } & (
      | {
          client_secret: string | null;
          stripe_status: string;
          session_id: string;
          bookingInfo: BookingInfo;
        }
      | {
          error: string;
        }
    );

export type BookingInfo = {
  draftId?: number;
  baseFare?: number;
  offerPrice?: number;
  couponDiscount?: number;
  totalPrice: number;
};
