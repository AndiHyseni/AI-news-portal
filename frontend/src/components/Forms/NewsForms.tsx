import {
  Box,
  Button,
  Card,
  Group,
  Image,
  Select,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Categories } from "../../types/categories/categories";
import { useState } from "react";
import { useCreateNews } from "../../hooks/useCreateNews/useCreateNews";
import "../Forms/NewsForms.css";
import React from "react";
import { Label } from "semantic-ui-react";

export interface NewsFormProps {
  newsId: number;
}

export const NewsForms: React.FC<NewsFormProps> = (newsId) => {
  const navigate = useNavigate();
  const createNewsMutation = useCreateNews();
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const [categoryId, setCategoryId] = useState<string | null>("");

  const { data } = useCategories();

  const categoryOptions = data
    ? data.map((category: Categories) => ({
        value: category.id.toString(),
        label: category.name,
      }))
    : [];

  const form = useForm({
    initialValues: {
      id: 0,
      category_id: 0,
      content: "",
      expire_date: "",
      image: "",
      is_deleted: false,
      is_featured: false,
      subtitle: "",
      tags: "",
      title: "",
      video: "",
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
      expire_date: (value) => {
        if (!value) {
          return "Expire date is required";
        }
        return null;
      },
    },
  });

  const [image, setimage] = useState() as any;
  const [tags, setTags] = useState([]) as any;

  const changefile = (event: any) => {
    let v = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(v[0]);
    reader.onload = (e) => {
      setimage(e.target?.result);
    };
  };

  function handleKeyDown(e: any) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  }

  function removeTag(index: any) {
    setTags({ ...tags.filter((el: any, i: any) => i !== index) });
  }

  const handleSubmit = (News: any) => {
    News.image = image;
    News.tags = tags.join(",");

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

    createNewsMutation.mutate(
      {
        id: String(form.values.id),
        category_id: categoryId ? String(categoryId) : "",
        content: form.values.content,
        expire_date: formattedDate,
        image: image,
        is_featured: Boolean(isFeatured),
        subtitle: form.values.subtitle,
        title: form.values.title,
      },
      {
        onSuccess: () => {
          navigate("/news");
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
            data={categoryOptions}
            searchable
            maxDropdownHeight={400}
            value={categoryId}
            onChange={(categoryId) => setCategoryId(categoryId)}
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
          <Image src={image} width={650} height={400} />
          <Card className="addNewsButton">
            <input
              type="file"
              hidden
              style={{ marginTop: "200px" }}
              id="file"
              onChange={changefile}
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
