import DashboardView from "../../features/dashboard/views/dashboard-view";
import { authenticated } from "../../lib/server";

export default async function Home() {
  await authenticated(); // This will redirect to sign-in if not authenticated

  return <DashboardView />;
}
