import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        alignSelf: "center",
        flexGrow: 1,
      }}
    >
      <h3>Opps something went wrong</h3>
      <div style={{ textAlign: "center" }}>
        <h4>404</h4>
        <h5>NOT FOUND</h5>
      </div>
      <Button
        onClick={() => navigate("/")}
        radius="xs"
        styles={() => ({
          root: {
            width: "150px",
            height: "52px",
            color: "white",
            backgroundColor: "#26145c",
            fontWeight: 400,
            fontFamily: "Montserrat",
            fontSize: "24px",
            marginTop: "25px",
            "&:hover": {
              backgroundColor: "#26145c",
            },
          },
        })}
      >
        Go Home
      </Button>
    </div>
  );
};
