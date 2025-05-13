import {
  Box,
  Button,
  Card,
  Group,
  Select,
  Switch,
  Textarea,
  TextInput,
  Image,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "semantic-ui-react";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { ApiError, ErrorMessage } from "../../types/auth/ApiError";
import { Categories } from "../../types/categories/categories";
import { News } from "../../types/news/news";

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
  const [newsImage, setNewsImage] = useState<string | ArrayBuffer>(news.image);
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

  const [tags, setTags] = useState([]) as any;

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files![0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewsImage(String(reader.result));
    };
    reader.readAsDataURL(image);
  };

  function handleKeyDown(e: any) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  }

  function removeTag(index: any) {
    setTags(tags.filter((el: any, i: any) => i !== index));
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
    mutation.mutate(
      {
        category_id: categoryId,
        content: form.values.content,
        expire_date: formattedDate,
        image: newsImage,
        is_featured: Boolean(isFeatured),
        is_deleted: Boolean(isDeleted),
        id: String(news.id),
        subtitle: form.values.subtitle,
        title: form.values.title,
      },
      {
        onSuccess: () => {
          navigate("/news");
        },
        onError: (error: AxiosError<ApiError>) => {
          if (
            error.response?.data.errorMessage === ErrorMessage.MORE_CARACTERS
          ) {
            form.setFieldError("title", "error");
          }
          console.error("Error submitting form:", error);
        },
      }
    );
  };

  return (
    <Box>
      <form className="addNewsForm" onSubmit={form.onSubmit(handleSubmit)}>
        <h1 className="addNewsHeader">News Form</h1>
        <hr />
        <TextInput
          className="addNewsElement"
          size="sm"
          label="Title"
          placeholder="News title..."
          {...form.getInputProps("title")}
        />
        <TextInput
          className="addNewsElement"
          size="sm"
          label="Subtitle"
          placeholder="News subtitle..."
          {...form.getInputProps("subtitle")}
        />
        <Textarea
          className="addNewsElement"
          size="sm"
          label="Content"
          placeholder="News content..."
          {...form.getInputProps("content")}
        />
        <TextInput
          className="addNewsElement"
          size="sm"
          label="Video"
          placeholder="Embedded video..."
          {...form.getInputProps("video")}
        />
        <div className="addNewsSpecialDiv">
          <DatePicker
            size="sm"
            placeholder="Expire date..."
            label="Expire Date"
            withAsterisk
            {...form.getInputProps("expire_date")}
          />
          <Select
            label="Category"
            placeholder="Category..."
            defaultValue={String(news.category_id)}
            data={categoryOptions}
            searchable
            maxDropdownHeight={400}
            onChange={(categoryId) => setCategoryId(String(categoryId))}
            error={form.errors.category_id}
          />
          <Switch
            label="is Featured"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.currentTarget.checked)}
          />
          <Switch
            label="is Deleted"
            checked={isDeleted}
            onChange={(event) => setIsDeleted(event.currentTarget.checked)}
          />
        </div>
        <div className="addNewsElement">
          {tags.map((tag: any, index: any) => (
            <div className="tag-item" key={index}>
              <span className="text">{tag}</span>
              <span className="close" onClick={() => removeTag(index)}>
                &times;
              </span>
            </div>
          ))}
          <TextInput
            onKeyDown={handleKeyDown}
            type="text"
            className="tags-input"
            placeholder="Press enter to add new tag"
            {...form.getInputProps("tags")}
          />
        </div>
        <div className="addNewsImage">
          <Image src={String(newsImage)} width={650} height={400} />
          <Card className="addNewsButton">
            <input
              type="file"
              hidden
              style={{ marginTop: "200px" }}
              id="file"
              onChange={handleImageChange}
            />
            <label htmlFor="file" className="btn" style={{ marginTop: "10px" }}>
              <Label content="Upload Image" color="blue" />
            </label>
          </Card>
        </div>
        <Group className="addNewsButtons">
          <Button color={"red"} onClick={() => navigate("/news")}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};
