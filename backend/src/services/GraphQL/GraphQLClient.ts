import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import API from "./GraphQLEndpoints";
import {
  BookingPriceInfo,
  GatewayCode,
  GetBookingResponse,
  GetBookingVariables,
  UpdateBookingPriceInfoResponse,
  UpdateBookingPriceInfoVariables,
  UpdatePaymentInfoResponse,
  UpdatePaymentInfoVariables,
  VerifyBookingResponse,
  VerifyBookingVariables,
} from "./GraphQLTypes";

export class GraphQLClient {
  private gqlClient: ApolloClient;

  constructor() {
    this.gqlClient = new ApolloClient({
      link: new HttpLink({
        uri: "https://staging-apis.merlioncruise.com/graphql",
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  }

  verifyBooking(draftId: number, token: string) {
    return this.gqlClient.mutate<VerifyBookingResponse, VerifyBookingVariables>(
      {
        mutation: API.verifyBooking,
        variables: {
          bookingDraftId: draftId,
        },
        context: {
          headers: {
            Authorization: token,
          },
        },
      }
    );
  }

  getBooking(draftId: number, token: string) {
    return this.gqlClient.query<GetBookingResponse, GetBookingVariables>({
      query: API.getBooking,
      variables: {
        ferryBookingDraftId: draftId,
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  updateBookingPriceInfo(
    draftId: number,
    token: string,
    priceInfo: BookingPriceInfo
  ) {
    return this.gqlClient.mutate<
      UpdateBookingPriceInfoResponse,
      UpdateBookingPriceInfoVariables
    >({
      mutation: API.updatePriceInfo,
      variables: {
        input: {
          id: draftId,
          patch: {
            priceInfo,
          },
        },
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  updatePaymentInfo(
    draftId: number,
    sdkSessionId: string,
    gatewayCode: GatewayCode = "STRIPESDK",
    token: string
  ) {
    return this.gqlClient.mutate<
      UpdatePaymentInfoResponse,
      UpdatePaymentInfoVariables
    >({
      mutation: API.updatePaymentInfo,
      variables: {
        ferryDraftId: draftId,
        sdkSessionId,
        gatewayCode,
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }
}
