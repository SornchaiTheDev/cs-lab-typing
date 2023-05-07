import React from "react";
import { trpc } from "@/helpers";
function Index() {
  const hello = trpc.hello.useQuery();
  console.log(hello.data);
  return <div>Index</div>;
}

export default Index;
