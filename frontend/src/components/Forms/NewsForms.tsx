import {
  Box,
  Button,
  Container,
  FileInput,
  Grid,
  Group,
  Image,
  Paper,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Categories } from "../../types/categories/categories";
import { useState } from "react";
import { useCreateNews } from "../../hooks/useCreateNews/useCreateNews";
import { IconUpload } from "@tabler/icons-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewsForms.css";

export interface NewsFormProps {
  newsId?: string; // Make it optional since it's not used in create mode
}

export const NewsForms: React.FC<NewsFormProps> = ({ newsId }) => {
  const navigate = useNavigate();
  const createNewsMutation = useCreateNews();
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string | null>("");
  const [image, setImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const { data } = useCategories();

  // Ensure data is an array
  const categoriesArray = data
    ? Array.isArray(data)
      ? data
      : (data as any).categories || []
    : [];

  const categoryOptions = categoriesArray.map((category: Categories) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const form = useForm({
    initialValues: {
      category_id: "",
      content: "",
      expire_date: "",
      image: "",
      is_deleted: false,
      is_featured: false,
      subtitle: "",
      tags: "",
      title: "",
      video: "",
      summary: "",
    },
    validateInputOnChange: false,
    validate: {
      title: (value) => {
        if (!value) {
          return "Title is required";
        }
        return null;
      },
      subtitle: (value) => {
        if (!value) {
          return "Subtitle is required";
        }
        return null;
      },
      content: (value) => {
        if (!value) {
          return "Content is required";
        }
        if (value.length < 50) {
          return "Content must be at least 50 characters";
        }
        return null;
      },
      expire_date: (value) => {
        if (!value) {
          return "Expire date is required";
        }
        return null;
      },
    },
  });

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const value = e.currentTarget.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.currentTarget.value = "";
    e.preventDefault();
  }

  function removeTag(indexToRemove: number) {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setFormSubmitted(true);

    const errors = form.validate();
    if (errors.hasErrors) return;

    if (!categoryId) {
      return; // Don't proceed if category is not selected
    }

    // Show loading toast
    const toastId = toast.loading("Publishing article...");

    const formattedDate = form.values.expire_date
      ? (() => {
          const date = new Date(form.values.expire_date);
          // Adjust for timezone to ensure the correct day is saved
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })()
      : "";

    // Convert plain text to HTML
    const convertToHtml = (text: string) => {
      return text
        .split("\n\n")
        .filter((para) => para.trim() !== "")
        .map((para) => `<p>${para.trim().replace(/\n/g, "<br>")}</p>`)
        .join("\n\n");
    };

    const payload = {
      category_id: categoryId ? String(categoryId) : "",
      content: convertToHtml(form.values.content),
      expire_date: formattedDate,
      image: image || "",
      is_featured: Boolean(isFeatured),
      is_deleted: Boolean(isDeleted),
      subtitle: form.values.subtitle,
      title: form.values.title,
      tags: tags.join(","),
      video: form.values.video || "",
      summary: form.values.summary,
    };

    console.log("Submitting payload:", payload); // Add this for debugging

    createNewsMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log("Response:", response); // Add this for debugging
        // Check if the response indicates an error
        if (response?.statusIsOk === false) {
          // Handle the error case
          const errorMessage =
            response.statusMessage || "Failed to publish article";

          // Update toast to error
          toast.update(toastId, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });

          // Set form error if it's related to a specific field
          if (errorMessage.toLowerCase().includes("tags")) {
            form.setFieldError("tags", errorMessage);
          }

          console.error("Error publishing article:", response);
          return;
        }

        // Success case
        toast.update(toastId, {
          render: "Article published successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Navigate after a short delay to allow the user to see the success message
        setTimeout(() => {
          navigate("/admin/news");
        }, 2000);
      },
      onError: (error: any) => {
        console.log("Error:", error); // Add this for debugging
        // Handle network or other errors
        let errorMessage = "Failed to publish article. Please try again.";

        if (error.response?.data?.statusMessage) {
          errorMessage = error.response.data.statusMessage;
        }

        // Update toast to error
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });

        console.error("Error publishing article:", error);
      },
    });
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" radius="md" p="xl" className="news-form-container">
        <Title order={2} className="form-title">
          Create News Article
        </Title>

        <Box mt="md">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <TextInput
                className="form-element"
                size="md"
                required
                label="Article Title"
                placeholder="Enter a compelling title..."
                {...form.getInputProps("title")}
                error={formSubmitted && form.errors.title}
              />

              <TextInput
                className="form-element"
                size="md"
                required
                label="Subtitle"
                placeholder="Enter a brief subtitle or description..."
                {...form.getInputProps("subtitle")}
                error={formSubmitted && form.errors.subtitle}
              />

              <Textarea
                className="form-element"
                size="md"
                label="Summary (2-3 sentences)"
                placeholder="Enter a concise summary of the article (will be auto-generated if left blank)..."
                minRows={2}
                maxRows={3}
                {...form.getInputProps("summary")}
              />

              <Textarea
                className="form-element"
                size="md"
                required
                label="Content"
                placeholder="Enter the full article content (min. 50 characters)..."
                minRows={6}
                {...form.getInputProps("content")}
                error={formSubmitted && form.errors.content}
              />

              <TextInput
                className="form-element"
                size="md"
                label="Video URL"
                placeholder="Enter embedded video URL (optional)..."
                {...form.getInputProps("video")}
              />

              <Grid className="form-grid">
                <Grid.Col span={6}>
                  <DatePicker
                    className="form-element"
                    size="md"
                    placeholder="Select expiration date..."
                    label="Expire Date"
                    required
                    {...form.getInputProps("expire_date")}
                    error={formSubmitted && form.errors.expire_date}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Select
                    className="form-element"
                    size="md"
                    label="Category"
                    placeholder="Select a category..."
                    data={categoryOptions}
                    searchable
                    required
                    value={categoryId}
                    onChange={(value) => setCategoryId(value)}
                    error={
                      formSubmitted && !categoryId
                        ? "Category is required"
                        : null
                    }
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <div className="custom-switch">
                    <Switch
                      label="Feature this article"
                      checked={isFeatured}
                      onChange={(event) =>
                        setIsFeatured(event.currentTarget.checked)
                      }
                      size="md"
                      color="violet"
                    />
                  </div>
                </Grid.Col>

                <Grid.Col span={6}>
                  <div className="custom-switch">
                    <Switch
                      label="Mark as deleted"
                      checked={isDeleted}
                      onChange={(event) =>
                        setIsDeleted(event.currentTarget.checked)
                      }
                      size="md"
                      color="red"
                    />
                  </div>
                </Grid.Col>
              </Grid>

              <div className="form-element">
                <Text size="sm" weight={500} mb={10}>
                  Tags
                </Text>
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <div className="tag-item" key={index}>
                      <span className="tag-text">{tag}</span>
                      <span
                        className="tag-close"
                        onClick={() => removeTag(index)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
                <TextInput
                  onKeyDown={handleKeyDown}
                  className="tags-input"
                  placeholder="Type a tag and press Enter to add"
                  mt={10}
                />
              </div>

              <div className="form-element image-upload-section">
                <Text size="sm" weight={500} mb={10}>
                  Featured Image
                </Text>
                {image && (
                  <div className="image-preview">
                    <Image src={image} radius="md" height={1000} />
                  </div>
                )}
                <FileInput
                  className="image-upload"
                  placeholder="Upload article image..."
                  accept="image/*"
                  icon={<IconUpload size={14} />}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="action-buttons">
              <Button
                className="cancel-button"
                variant="outline"
                onClick={() => navigate("/admin/news")}
                type="button"
              >
                Cancel
              </Button>

              <Button
                className="submit-button"
                type="submit"
                loading={createNewsMutation.isLoading}
              >
                Publish Article
              </Button>
            </div>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};
