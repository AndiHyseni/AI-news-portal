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
  newsId: number;
  news: News;
  mutation: any;
}

export const EditNewsForm: React.FC<NewsFormProps> = ({
  newsId,
  news,
  mutation,
}) => {
  const navigate = useNavigate();

  const [isFeatured, setIsFeatured] = useState<boolean>(news.isFeatured);
  const [isDeleted, setIsDeleted] = useState<boolean>(news.isDeleted);

  const [categoryId, setCategoryId] = useState<number | null>(news.categoryId);
  const [newsImage, setNewsImage] = useState<string | ArrayBuffer>(news.image);
  const { data } = useCategories();

  const categoryOptions = data
    ? data.map((category: Categories) => ({
        value: category.categoryId.toString(),
        label: category.name,
      }))
    : [];

  const [tags, setTags] = useState([]) as any;

  const form = useForm({
    initialValues: {
      newsId: newsId,
      categoryId: news.categoryId,
      content: news.content,
      expireDate: news.expireDate,
      image: news.image,
      isDeleted: news.isDeleted,
      isFeatured: news.isFeatured,
      subTitle: news.subTitle,
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
      subTitle: (value) => {
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
      expireDate: (value) => {
        if (!value) {
          return "Expire date is required";
        }
        return null;
      },
      categoryId: (value) => {
        if (!value || value === 0) {
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

  const handleSubmit = () => {
    mutation.mutate(
      {
        ...form.values,
        newsId: news.newsId,
        categoryId: categoryId,
        isDeleted: isDeleted,
        isFeatured: isFeatured,
        image: newsImage,
        tags: tags.join(","),
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
          {...form.getInputProps("subTitle")}
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
            {...form.getInputProps("expireDate")}
          />
          <Select
            label="Category"
            placeholder="Category..."
            defaultValue={String(news.categoryId)}
            data={categoryOptions}
            searchable
            maxDropdownHeight={400}
            onChange={(categoryId) => setCategoryId(Number(categoryId))}
            error={form.errors.categoryId}
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
