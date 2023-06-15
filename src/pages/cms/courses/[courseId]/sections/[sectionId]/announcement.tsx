import { useRouter } from "next/router";
import React from "react";
import SectionLayout from "~/Layout/SectionLayout";
import Announcement from "~/components/Common/Announcement";
import { trpc } from "~/helpers";

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
