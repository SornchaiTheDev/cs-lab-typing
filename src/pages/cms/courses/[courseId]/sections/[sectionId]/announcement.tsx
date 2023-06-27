import { TRPCError } from "@trpc/server";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import SectionLayout from "~/Layout/SectionLayout";
import Announcement from "~/components/Common/Announcement";
import { trpc } from "~/helpers";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";

function AnnouncementPage() {
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

  return (
    <SectionLayout
      title={section.data?.name as string}
      isLoading={section.isLoading}
    >
      <Announcement />
    </SectionLayout>
  );
}

export default AnnouncementPage;

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
