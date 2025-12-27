export type VerifyBookingResponse = {
  verifyScheduleBooking: {
    success: boolean;
    message: string;
    error: Array<string>;
    data: string | null;
    calculatedPrices: {
      sailingPrice: number;
      totalPrice: number;
    };
  };
};

export type VerifyBookingVariables = {
  bookingDraftId: number;
};

export type BookingPriceInfo = {
  EarnCoin?: number;
  DebitCoin?: string;
  VatCharge?: string;
  CouponCode?: string;
  OfferPrice?: string;
  TotalPrice?: string;
  SailingFare?: string;
  PackagePrice?: string;
  ServiceCharge?: string;
  VatPercentage?: string;
  DebitCoinPrice?: string;
  ServicePercentage?: string;
  PersonalServiceCharges?: string;
};

export type GetBookingResponse = {
  ferryBookingDraft: {
    priceInfo: BookingPriceInfo;
  };
};

export type GetBookingVariables = {
  ferryBookingDraftId: number;
};

export type UpdateBookingPriceInfoResponse = {
  updateFerryBookingDraft: {
    ferryBookingDraft: {
      id: number;
    };
  };
};

export type UpdateBookingPriceInfoVariables = {
  input: {
    id: number;
    patch: {
      priceInfo: BookingPriceInfo;
    };
  };
};

export type UpdatePaymentInfoResponse = {
  generatePaymentUrl: {
    ferryDraftId: number;
    message: string;
    success: boolean;
    url: string;
    calculatedPrices: any;
  };
};

export type UpdatePaymentInfoVariables = {
  ferryDraftId: number;
  gatewayCode: string;
  sdkSessionId: string;
};

export type GatewayCode = "STRIPESDK";
