import router from "next/router";
import React from "react";
import FrontLayout from "~/Layout/FrontLayout";
import Card from "~/components/Common/Card";

function Labs() {
  return (
    <FrontLayout title="Lab001">
      <div className="my-10 grid grid-cols-12 gap-6">
        <Card
          title="Lab001"
          href={{
            pathname: router.pathname + "/labs",
            query: { ...router.query },
          }}
        />
      </div>
    </FrontLayout>
  );
}

export default Labs;
