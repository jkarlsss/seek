import { Navbar } from "../../components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
