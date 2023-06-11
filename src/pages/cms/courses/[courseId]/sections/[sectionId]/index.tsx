import SectionLayout from "~/Layout/SectionLayout";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import Skeleton from "~/components/Common/Skeleton";
import AddUser from "~/features/Users/AddUserToSection";
import Badge from "~/components/Common/Badge";
import Alert from "~/components/Common/Alert";

function Sections() {
  const router = useRouter();

  const { sectionId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);
  const section = trpc.sections.getSectionById.useQuery({
    id: sectionIdInt,
  });

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
