// File Location: src/lib/nhost.js

import { NhostClient } from "@nhost/nhost-js";

const nhost = new NhostClient({
  subdomain: "ttkyyarywykcfihkntdm", // Replace with your Nhost subdomain
  region: "us-west-2", // Replace with your Nhost region
});

export default nhost;
