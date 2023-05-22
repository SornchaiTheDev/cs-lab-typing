import Link from "next/link";
import FrontLayout from "~/Layout/FrontLayout";
import router from "next/router";

function Course() {
  return (
    <FrontLayout title="Typing Test" customBackPath="/">
      <div className="my-10 grid grid-cols-12 gap-6">
        <Link
          href={{
            pathname: router.pathname + "/labs",
            query: { ...router.query },
          }}
          className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
        >
          <div className="flex flex-col gap-2 p-2">
            <div>
              <h4 className="text-xl font-medium text-sand-12">Lab01</h4>
            </div>
          </div>
        </Link>
      </div>
    </FrontLayout>
  );
}

export default Course;
