import { GraphQLClient } from "graphql-request";

export function getGraphQLClient() {
  const endpoint = process.env.NEXT_PUBLIC_DUTCHIE_PLUS_API_URL;
  const token = process.env.NEXT_PUBLIC_DUTCHIE_PLUS_API_TOKEN;
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return graphQLClient;
}
