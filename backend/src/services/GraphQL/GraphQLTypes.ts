export type VerifyBookingResponse = {
  verifyScheduleBooking: {
    success: boolean;
    message: string;
    error: Array<string>;
    data: string | null;
  };
};

export type VerifyBookingVariables = {
  bookingDraftId: number;
};


export type UpdatePaymentInfoResponse = {
  generatePaymentUrl: {
    ferryDraftId: number;
    message: string;
    success: boolean;
    url: string;
    calculatedPrices: any
  }
}

export type UpdatePaymentInfoVariables = {
  ferryDraftId: number;
  gatewayCode: string;
  sdkSessionId: string
};

export type GatewayCode = 'STRIPESDK';


