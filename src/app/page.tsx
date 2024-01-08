import { auth } from "~/auth";

async function AppPage() {
  const data = await auth();
  return <div>AppPage</div>;
}

export default AppPage;
