import { Button } from "@mantine/core";
import { Heart } from "tabler-icons-react";
import jwt_decode from "jwt-decode";
import { SavedNewsPayload } from "../../types/news/news";
import "../NewsDetailsId/NewsDetailsId.css";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export interface SavedNewsProps {
  newsId: number;
  savedNews: SavedNewsPayload | undefined;
  mutation: any;
}

export const AddSavedNewsButton: React.FC<SavedNewsProps> = ({
  newsId,
  savedNews,
  mutation,
}) => {
  const navigate = useNavigate();

  const token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : "";
  const newsIds = Number(newsId);
  const userIds =
    token[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];

  var role: string =
    token != null
      ? token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : "";

  const handleSubmit = () => {
    mutation.mutate({
      newsId: newsIds,
      userId: userIds,
    });
  };

  return (
    <>
      {token == "" && (
        <Button className="tagsButton" onClick={() => navigate("/login")}>
          <Heart size={25} strokeWidth={2} color={"white"} />
        </Button>
      )}
      {role == "Registered" && (
        <Button className="tagsButton" onClick={() => handleSubmit()}>
          <Heart size={25} strokeWidth={2} color={"white"} />
        </Button>
      )}
      {role == "Admin" && (
        <Button className="detailsButtonList" onClick={() => handleSubmit()}>
          <Heart size={20} strokeWidth={2} color={"white"} /> Save
        </Button>
      )}
    </>
  );
};
