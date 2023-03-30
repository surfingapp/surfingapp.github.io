import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '388b7feb5477896e2261cd7d3f56a35f477433c6', queries });
export default client;
  