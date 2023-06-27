import SectionLayout from "~/Layout/SectionLayout";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import Skeleton from "~/components/Common/Skeleton";
import Badge from "~/components/Common/Badge";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";

function Sections() {
  const router = useRouter();

  const { sectionId } = router.query;

  const section = trpc.sections.getSectionById.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const instructors =
    section.data?.instructors.map((user) => user.full_name) ?? [];

  return (
    <>
      <SectionLayout
        title={section.data?.name as string}
        isLoading={section.isLoading}
      >
        <div className="p-4">
          <h4 className="text-2xl">Section Information</h4>

          <h5 className="mb-2 mt-4 font-bold">Semester</h5>
          {section.isLoading ? (
            <Skeleton width={"10rem"} height={"2rem"} />
          ) : (
            <h4 className="text-lg">{`${
              section.data?.semester.year as string
            }/${section.data?.semester.term as string}`}</h4>
          )}
          <h5 className="mb-2 mt-4 font-bold">Note</h5>
          {section.isLoading ? (
            <Skeleton width={"10rem"} height={"2rem"} />
          ) : (
            <h4 className="text-lg">{section.data?.note}</h4>
          )}

          <h5 className="mb-2 mt-4 font-bold">Instructor(s)</h5>
          <div className="flex gap-2">
            {section.isLoading ? (
              <>
                <Skeleton width={"10rem"} height={"2rem"} />
                <Skeleton width={"10rem"} height={"2rem"} />
              </>
            ) : (
              instructors.map((instructor) => (
                <Badge key={instructor}>{instructor}</Badge>
              ))
            )}
          </div>
        </div>
      </SectionLayout>
    </>
  );
}

export default Sections;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper, user } = await createTrpcHelper({ req, res });
  const { full_name } = user;
  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      id: courseId as string,
    });
    const section = await helper.sections.getSectionById.fetch({
      id: sectionId as string,
    });

    if (
      !section?.instructors
        .map((user) => user.full_name)
        .includes(full_name as string)
    ) {
      return {
        notFound: true,
      };
    }
  } catch (err) {
    if (err instanceof TRPCError) {
      if (err.code === "UNAUTHORIZED") {
        return {
          notFound: true,
        };
      }
    }
  }

  return {
    props: {},
  };
};
