import { Header } from "@/widgets/header/Header";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <Header/>
      <Container size={"lg"} p={20}>
        <Outlet />
      </Container>
    </>
  );
};
