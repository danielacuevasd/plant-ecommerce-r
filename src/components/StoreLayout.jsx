import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function StoreLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}