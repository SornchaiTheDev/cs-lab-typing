import React from "react";
import { useSession } from "next-auth/react";

function Index() {
  const session = useSession();
  return (
    <div>
      <pre>
        <code>
          {session ? JSON.stringify(session.data, null, 2) : "No data"}
        </code>
      </pre>
    </div>
  );
}

export default Index;
