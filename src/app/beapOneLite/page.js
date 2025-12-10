import Layout from "@/component/BeapOneLite/Layout";
import DashboardOne from "@/component/BeapOneLite/Dashboard/DashboardOne";
import DashboardTwo from "@/component/BeapOneLite/Dashboard/DashboardTwo";

export default function Home() {
  return (
    <Layout>
      <DashboardOne />
      <DashboardTwo />
    </Layout>
  );
}