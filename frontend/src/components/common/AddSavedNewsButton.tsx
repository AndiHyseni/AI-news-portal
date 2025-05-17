import { Button } from "@mantine/core";
import { Heart } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import { useSavedNewsPage } from "../../hooks/useSavedNewsPage/useSavedNewsPage";
import "../NewsDetailsId/NewsDetailsId.css";
import { SavedNewsPage } from "../../types/news/news";

export interface SavedNewsProps {
  newsId: string;
  mutation: any;
}

// Define types for the potential response formats
interface SavedNewsResponse {
  news?: SavedNewsPage[];
}

export const AddSavedNewsButton: React.FC<SavedNewsProps> = ({
  newsId,
  mutation,
}) => {
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext.isAuthenticated;
  const isAdmin = userContext.roles?.includes("admin");
  const userId = userContext.userId || "";

  // Track if the article is saved and button state
  const [isSaving, setIsSaving] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  // Fetch user's saved articles to check if this one is already saved
  const { data: savedNewsData } = useSavedNewsPage(userId || "");

  // Check if article is already saved when data loads
  useEffect(() => {
    if (savedNewsData && Array.isArray(savedNewsData)) {
      const articleAlreadySaved = savedNewsData.some(
        (article) => article.news_id === newsId
      );
      setIsAlreadySaved(articleAlreadySaved);
    } else if (savedNewsData && typeof savedNewsData === "object") {
      // Handle case where data is nested in an object
      const typedData = savedNewsData as SavedNewsResponse;
      const newsArray = typedData.news || [];
      if (Array.isArray(newsArray)) {
        const articleAlreadySaved = newsArray.some(
          (article) => article.news_id === newsId
        );
        setIsAlreadySaved(articleAlreadySaved);
      }
    }
  }, [savedNewsData, newsId]);

  const handleSubmit = () => {
    if (isAlreadySaved) {
      // Show info toast if already saved
      toast.info("This article is already in your saved list.");
      return;
    }

    // Prevent multiple clicks
    if (isSaving) return;

    setIsSaving(true);

    // Show loading toast
    const toastId = toast.loading("Saving article...");

    mutation.mutate(
      {
        newsId: String(newsId),
        userId: userId,
      },
      {
        onSuccess: () => {
          // Update toast to success
          toast.update(toastId, {
            render:
              "Article saved successfully! You can view it in your saved articles.",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          // Update state to show as saved
          setIsAlreadySaved(true);
          setIsSaving(false);
        },
        onError: (error: any) => {
          // Check if it's already saved error
          const errorMessage = error?.response?.data?.error || "";
          if (errorMessage.includes("already saved")) {
            toast.update(toastId, {
              render: "This article is already in your saved list.",
              type: "info",
              isLoading: false,
              autoClose: 3000,
            });

            // Update state to show as saved
            setIsAlreadySaved(true);
          } else {
            // Generic error
            toast.update(toastId, {
              render: "Failed to save article. Please try again.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
          console.error("Error saving news:", error);
          setIsSaving(false);
        },
      }
    );
  };

  return (
    <>
      {!isAuthenticated && (
        <Button className="tagsButton" onClick={() => navigate("/login")}>
          <Heart size={25} strokeWidth={2} color={"white"} />
        </Button>
      )}
      {isAuthenticated && !isAdmin && (
        <Button
          className={isAlreadySaved ? "tagsButton-saved" : "tagsButton"}
          onClick={() => handleSubmit()}
          disabled={isSaving || isAlreadySaved}
          loading={isSaving}
        >
          <Heart
            size={25}
            strokeWidth={2}
            color={"white"}
            fill={isAlreadySaved ? "white" : "none"}
          />
          {isAlreadySaved && " Saved"}
        </Button>
      )}
      {isAdmin && (
        <Button
          className={
            isAlreadySaved ? "detailsButtonList-saved" : "detailsButtonList"
          }
          onClick={() => handleSubmit()}
          disabled={isSaving || isAlreadySaved}
          loading={isSaving}
        >
          <Heart
            size={20}
            strokeWidth={2}
            color={"white"}
            fill={isAlreadySaved ? "white" : "none"}
          />
          {isAlreadySaved ? "Saved" : "Save"}
        </Button>
      )}
    </>
  );
};
