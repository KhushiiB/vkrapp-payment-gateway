import { gql } from "@apollo/client";

const API = {
  verifyBooking: gql`
    mutation ($bookingDraftId: Int!) {
      verifyScheduleBooking(bookingDraftId: $bookingDraftId) {
        success
        message
        errors
        data
      }
    }
  `,
  updatePaymentInfo: gql`
    mutation (
      $ferryDraftId: Int!
      $gatewayCode: String!
      $sdkSessionId: String
    ) {
      generatePaymentUrl(
        ferryDraftId: $ferryDraftId
        gateway_code: $gatewayCode
        sdkSessionId: $sdkSessionId
      ) {
        ferryDraftId
        message
        success
        url
      }
    }
  `,
};

export default API;