import {
  Button,
  Group,
  Modal,
  Text,
  TextInput,
  Select,
  Tabs,
} from "@mantine/core";
import { useState } from "react";
import { useImportNewsFromAPI } from "../../hooks/useNews/useNewsAPI";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Categories } from "../../types/categories/categories";

interface ImportNewsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ImportNewsModal: React.FC<ImportNewsModalProps> = ({
  opened,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const importMutation = useImportNewsFromAPI();
  const { data: categoriesData } = useCategories();

  // Ensure categories is an array
  const categoriesArray = categoriesData
    ? Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any).categories || []
    : [];

  const categoryOptions = categoriesArray.map((category: Categories) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  // NewsAPI categories
  const newsApiCategories = [
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "general", label: "General" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" },
  ];

  const handleImport = () => {
    if (!categoryId) {
      alert("Please select a category to import to");
      return;
    }

    if (activeTab === "search" && !searchQuery) {
      alert("Please enter a search query");
      return;
    }

    if (activeTab === "category" && !category) {
      alert("Please select a NewsAPI category");
      return;
    }

    const payload = {
      category_id: categoryId,
      ...(activeTab === "search" ? { query: searchQuery } : { category }),
    };

    importMutation.mutate(payload);

    if (!importMutation.isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Import News from NewsAPI"
      centered
      size="lg"
    >
      <Text size="sm" style={{ marginBottom: 20 }}>
        Import news articles from NewsAPI directly into your database. You can
        search for specific topics or browse by category.
      </Text>

      <Tabs
        value={activeTab}
        onTabChange={(value) => setActiveTab(value as string)}
      >
        <Tabs.List>
          <Tabs.Tab value="search">Search by Keyword</Tabs.Tab>
          <Tabs.Tab value="category">Browse by Category</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="search" pt="md">
          <TextInput
            label="Search Query"
            placeholder="Enter keywords (e.g., climate change, technology)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
            mb="md"
          />
        </Tabs.Panel>

        <Tabs.Panel value="category" pt="md">
          <Select
            label="NewsAPI Category"
            placeholder="Select a NewsAPI category"
            data={newsApiCategories}
            value={category}
            onChange={setCategory}
            required
            mb="md"
          />
        </Tabs.Panel>
      </Tabs>

      <Select
        label="Import to Category"
        placeholder="Select a category in your system"
        data={categoryOptions}
        value={categoryId}
        onChange={setCategoryId}
        required
        mt="md"
        mb="xl"
      />

      <Group position="right" spacing="md">
        <Button variant="outline" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleImport}
          loading={importMutation.isLoading}
        >
          Import News
        </Button>
      </Group>
    </Modal>
  );
};
