import {
  Box,
  Button,
  Group,
  Image,
  Switch,
  Title,
  Paper,
  Grid,
  Text,
  FileButton,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Upload, Check } from "tabler-icons-react";
import { axiosInstance } from "../../api/config";
import { Configuration } from "../../types/administration/administration";
import "./Configuration.css";

export interface ConfigurationProps {
  configuration: Configuration;
}

export const ConfigurationC: React.FC<ConfigurationProps> = ({
  configuration,
}) => {
  const [headerImage, setHeaderImage] = useState<string | ArrayBuffer>(
    configuration.header_logo
  );
  const [footerImage, setFooterImage] = useState<string | ArrayBuffer>(
    configuration.footer_logo
  );
  const [showFeatured, setShowFeatured] = useState<boolean>(
    configuration.show_featured
  );
  const [mostWatched, setMostWatched] = useState<boolean>(
    configuration.show_most_watched
  );

  const form = useForm({
    initialValues: {
      header_logo: configuration.header_logo,
      footer_logo: configuration.footer_logo,
      news_config_id: configuration.news_config_id,
      show_featured: configuration.show_featured,
      show_most_watched: configuration.show_most_watched,
    },
  });

  const handleHeaderImageChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setHeaderImage(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleFooterImageChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFooterImage(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    axiosInstance
      .post("https://localhost:5000/api/NewsConfig", {
        header_logo: headerImage,
        footer_logo: footerImage,
        show_featured: showFeatured,
        show_most_watched: mostWatched,
      })
      .then(() => {
        toast.success("Configuration updated successfully", {
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Failed to update configuration", { autoClose: 3000 });
        console.error("Config update error:", error);
      });
  };

  return (
    <>
      <Title order={2} mb={30} className="table-title">
        Site Configuration
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid mb={40}>
          <Grid.Col span={12} mb={20}>
            <Text weight={600} size="lg" mb={15}>
              Display Settings
            </Text>
            <Divider mb={20} />

            <Paper p="md" radius="md" withBorder>
              <Group position="apart" mb={15}>
                <div>
                  <Text weight={500}>Featured News Section</Text>
                  <Text size="sm" color="dimmed">
                    Show the featured news section on the homepage
                  </Text>
                </div>
                <Switch
                  size="lg"
                  checked={showFeatured}
                  color="violet"
                  onChange={(event) =>
                    setShowFeatured(event.currentTarget.checked)
                  }
                />
              </Group>

              <Group position="apart">
                <div>
                  <Text weight={500}>Most Watched Section</Text>
                  <Text size="sm" color="dimmed">
                    Show the most popular articles section on the homepage
                  </Text>
                </div>
                <Switch
                  size="lg"
                  checked={mostWatched}
                  color="violet"
                  onChange={(event) =>
                    setMostWatched(event.currentTarget.checked)
                  }
                />
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text weight={600} size="lg" mb={15}>
              Logo Settings
            </Text>
            <Divider mb={20} />

            <Grid gutter={30}>
              <Grid.Col md={6}>
                <Paper
                  p="lg"
                  radius="md"
                  withBorder
                  className="image-upload-container"
                >
                  <Text weight={500} align="center" mb={15}>
                    Header Logo
                  </Text>
                  <Box
                    sx={{
                      height: 200,
                      width: "100%",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      marginBottom: 15,
                    }}
                  >
                    <Image
                      src={String(headerImage)}
                      height={160}
                      width={160}
                      fit="contain"
                      withPlaceholder
                      alt="Header Logo"
                    />
                  </Box>

                  <FileButton
                    onChange={handleHeaderImageChange}
                    accept="image/png,image/jpeg,image/svg+xml"
                  >
                    {(props) => (
                      <Button
                        {...props}
                        fullWidth
                        leftIcon={<Upload size={16} />}
                        color="blue"
                        variant="light"
                      >
                        Upload New Logo
                      </Button>
                    )}
                  </FileButton>
                </Paper>
              </Grid.Col>

              <Grid.Col md={6}>
                <Paper
                  p="lg"
                  radius="md"
                  withBorder
                  className="image-upload-container"
                >
                  <Text weight={500} align="center" mb={15}>
                    Footer Logo
                  </Text>
                  <Box
                    sx={{
                      height: 200,
                      width: "100%",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      marginBottom: 15,
                    }}
                  >
                    <Image
                      src={String(footerImage)}
                      height={160}
                      width={160}
                      fit="contain"
                      withPlaceholder
                      alt="Footer Logo"
                    />
                  </Box>

                  <FileButton
                    onChange={handleFooterImageChange}
                    accept="image/png,image/jpeg,image/svg+xml"
                  >
                    {(props) => (
                      <Button
                        {...props}
                        fullWidth
                        leftIcon={<Upload size={16} />}
                        color="blue"
                        variant="light"
                      >
                        Upload New Logo
                      </Button>
                    )}
                  </FileButton>
                </Paper>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        <Group position="right">
          <Button
            type="submit"
            size="md"
            leftIcon={<Check size={16} />}
            color="violet"
            sx={{
              backgroundColor: "#26145c",
              "&:hover": {
                backgroundColor: "#371e83",
              },
            }}
          >
            Save Configuration
          </Button>
        </Group>
      </form>
    </>
  );
};
