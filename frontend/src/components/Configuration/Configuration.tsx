import { Box, Button, Card, Group, Image, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Label } from "semantic-ui-react";
import { axiosInstance } from "../../api/config";
import { Configuration } from "../../types/administration/administration";

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

  const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files![0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setHeaderImage(String(reader.result));
    };
    reader.readAsDataURL(image);
  };

  const handleFooterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files![0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFooterImage(String(reader.result));
    };
    reader.readAsDataURL(image);
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
        toast.success("Updated successfuly", { autoClose: 2000 });
      });
  };

  return (
    <Box>
      <form className="configForm" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="configDiv">
          <Switch
            label="Shfaq më të rejat"
            checked={showFeatured}
            onChange={(event) => setShowFeatured(event.currentTarget.checked)}
          />
          <Switch
            label="Shfaq më të shikuarat"
            checked={mostWatched}
            onChange={(event) => setMostWatched(event.currentTarget.checked)}
          />
        </div>
        <div className="headerImage">
          <div>
            <p>Header Logo:</p>
            <Image src={String(headerImage)} width={200} height={200} />
            <Card className="headerButton">
              <input
                type="file"
                hidden
                style={{ marginTop: "200px" }}
                id="header"
                onChange={handleHeaderImageChange}
              />
              <label
                htmlFor="header"
                className="btn"
                style={{ marginTop: "10px" }}
              >
                <Label content="Upload Image" color="blue" />
              </label>
            </Card>
          </div>

          <div>
            <p>Footer Logo:</p>
            <Image src={String(footerImage)} width={200} height={200} />
            <Card className="footerButton">
              <input
                type="file"
                hidden
                style={{ marginTop: "200px" }}
                id="footer"
                onChange={handleFooterImageChange}
              />
              <label
                htmlFor="footer"
                className="btn"
                style={{ marginTop: "10px" }}
              >
                <Label content="Upload Image" color="blue" />
              </label>
            </Card>
          </div>
        </div>
        <Group className="configButton">
          <Button
            data-testid="submit-button"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};
