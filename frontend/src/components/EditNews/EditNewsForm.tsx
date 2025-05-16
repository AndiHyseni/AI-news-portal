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
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconUpload } from "@tabler/icons-react";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { ApiError, ErrorMessage } from "../../types/auth/ApiError";
import { Categories } from "../../types/categories/categories";
import { News } from "../../types/news/news";
import "../Forms/NewsForms.css";

export interface NewsFormProps {
  newsId: string;
  news: News;
  mutation: any;
}

export const EditNewsForm: React.FC<NewsFormProps> = ({
  newsId,
  news,
  mutation,
}) => {
  const navigate = useNavigate();

  const [isFeatured, setIsFeatured] = useState<boolean>(news.is_featured);
  const [isDeleted, setIsDeleted] = useState<boolean>(news.is_deleted);

  const [categoryId, setCategoryId] = useState<string | null>(news.category_id);
  const [newsImage, setNewsImage] = useState<string | ArrayBuffer | null>(
    news.image || ""
  );
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

  const [tags, setTags] = useState<string[]>(
    news.tags ? news.tags.split(",").filter(Boolean) : []
  );

  const formattedate = news.expire_date ? new Date(news.expire_date) : null;

  const form = useForm({
    initialValues: {
      id: newsId,
      category_id: news.category_id,
      content: news.content,
      expire_date: formattedate,
      image: news.image,
      is_deleted: Boolean(news.is_deleted),
      is_featured: Boolean(news.is_featured),
      subtitle: news.subtitle,
      tags: news.tags,
      title: news.title,
      video: news.video,
    },
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
      expire_date: (value: any) => {
        if (!value) {
          return "Expire date is required";
        }
        return null;
      },
      category_id: (value) => {
        if (!value || value === "") {
          return "Category is required";
        }
        return null;
      },
    },
  });

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setNewsImage(e.target?.result as string);
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

  // Format the date to MySQL compatible format (YYYY-MM-DD)
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

  const handleSubmit = () => {
    const errors = form.validate();
    if (errors.hasErrors) return;

    mutation.mutate(
      {
        category_id: categoryId,
        content: form.values.content,
        expire_date: formattedDate,
        image: newsImage || "",
        is_featured: Boolean(isFeatured),
        is_deleted: Boolean(isDeleted),
        id: String(news.id),
        subtitle: form.values.subtitle,
        title: form.values.title,
        tags: tags.join(","),
        video: form.values.video || "",
      },
      {
        onSuccess: () => {
          navigate("/news");
        },
        onError: (error: AxiosError<ApiError>) => {
          if (
            error.response?.data.errorMessage === ErrorMessage.MORE_CARACTERS
          ) {
            form.setFieldError("title", "Title has too many characters");
          }
          console.error("Error submitting form:", error);
        },
      }
    );
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" radius="md" p="xl" className="news-form-container">
        <Title order={2} className="form-title">
          Edit News Article
        </Title>

        <Box mt="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className="form-group">
              <TextInput
                className="form-element"
                size="md"
                required
                label="Article Title"
                placeholder="Enter a compelling title..."
                {...form.getInputProps("title")}
                error={form.errors.title}
              />

              <TextInput
                className="form-element"
                size="md"
                required
                label="Subtitle"
                placeholder="Enter a brief subtitle or description..."
                {...form.getInputProps("subtitle")}
                error={form.errors.subtitle}
              />

              <Textarea
                className="form-element"
                size="md"
                required
                label="Content"
                placeholder="Enter the full article content (min. 50 characters)..."
                minRows={6}
                {...form.getInputProps("content")}
                error={form.errors.content}
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
                    error={form.errors.expire_date}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Select
                    className="form-element"
                    size="md"
                    label="Category"
                    placeholder="Select a category..."
                    defaultValue={String(news.category_id)}
                    data={categoryOptions}
                    searchable
                    required
                    onChange={(value) => setCategoryId(value)}
                    error={form.errors.category_id}
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
                {newsImage && (
                  <div className="image-preview">
                    <Image src={String(newsImage)} radius="md" height={1000} />
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
                onClick={() => navigate("/news")}
              >
                Cancel
              </Button>

              <Button
                className="submit-button"
                type="submit"
                loading={mutation.isLoading}
              >
                Update Article
              </Button>
            </div>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};
