import { useSession } from "next-auth/react";

function Index() {
  const { data } = useSession();
  return <div>{JSON.stringify(data)}</div>;
}

export default Index;
