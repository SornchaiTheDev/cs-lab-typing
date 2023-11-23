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
  const { helper } = await createTrpcHelper({ req, res });

  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
    await helper.sections.getSectionById.fetch({
      id: sectionId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};
