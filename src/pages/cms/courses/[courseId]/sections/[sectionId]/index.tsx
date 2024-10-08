import SectionLayout from "~/layouts/SectionLayout";
import { trpc } from "~/utils";
import { useRouter } from "next/router";
import Skeleton from "~/components/Common/Skeleton";
import Badge from "~/components/Common/Badge";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import format from "date-fns/format";

function Sections() {
  const router = useRouter();

  const { sectionId } = router.query;

  const section = trpc.sections.getSectionById.useQuery(
    {
      sectionId: sectionId as string,
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
        <div className="p-4 text-sand-12">
          <h4 className="text-2xl">Section Information</h4>

          <h5 className="mb-2 mt-4 font-bold">Semester</h5>
          {section.isLoading ? (
            <Skeleton width={"10rem"} height={"2rem"} />
          ) : (
            <h4 className="text-lg">{`${
              section.data?.semester.year as string
            }/${section.data?.semester.term as string}`}</h4>
          )}
          <h5 className="mb-2 mt-4 font-bold">Type</h5>
          {section.isLoading ? (
            <Skeleton width={"10rem"} height={"2rem"} />
          ) : (
            <h4 className="text-lg">{section.data?.type}</h4>
          )}
          {!!section.data?.closed_at && (
            <>
              <h5 className="mb-2 mt-4 font-bold">Closed at</h5>
              {section.isLoading ? (
                <Skeleton width={"10rem"} height={"2rem"} />
              ) : (
                <h4 className="text-lg">
                  {format(section.data?.closed_at, "dd/MM/yyyy HH:mm")}
                </h4>
              )}
            </>
          )}
          <h5 className="mb-2 mt-4 font-bold">Note</h5>
          {section.isLoading ? (
            <Skeleton width={"10rem"} height={"2rem"} />
          ) : (
            <h4 className="text-lg">
              {section.data?.note?.length === 0 ? "-" : section.data?.note}
            </h4>
          )}

          <h5 className="mb-2 mt-4 font-bold">Instructor(s)</h5>
          <div className="flex flex-wrap gap-2">
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
  const { helper } = await createTrpcHelper({ req, res });

  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
    await helper.sections.getSectionById.fetch({
      sectionId: sectionId as string,
    });
  } catch (err) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
