import { Container, Title, Text, Image, Grid, Card } from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import "./About.css";

export const About: React.FC = () => {
  return (
    <BasePage>
      <Container className="about-page">
        <div className="about-header">
          <Title order={1} className="about-title">
            About Us
          </Title>
          <Text className="about-subtitle">
            Your trusted source for the latest news and in-depth stories
          </Text>
        </div>

        <div className="about-section">
          <Title order={3} className="section-title">
            Our Mission
          </Title>
          <Text className="section-content">
            At News Portal, our mission is to deliver accurate, timely, and
            relevant news content to our readers. We strive to inform, engage,
            and empower our audience through comprehensive coverage of events
            that matter most. Our commitment to journalistic integrity guides
            every story we publish.
          </Text>
        </div>

        <div className="about-section">
          <Title order={3} className="section-title">
            Our Story
          </Title>
          <Text className="section-content">
            Founded in 2022, News Portal began as a small digital publication
            with a vision to transform how people consume news in the digital
            age. What started as a modest initiative has grown into a
            comprehensive news platform covering a wide range of topics from
            politics and health to technology and sports.
          </Text>
          <Text className="section-content">
            Our journey has been defined by a relentless pursuit of truth and a
            dedication to presenting multiple perspectives on complex issues. We
            believe in the power of informed citizens and work tirelessly to
            provide the context needed to understand today's rapidly changing
            world.
          </Text>
        </div>

        <div className="about-section">
          <Title order={3} className="section-title">
            Our Values
          </Title>
          <Grid gutter="lg">
            <Grid.Col xs={12} sm={6} lg={4}>
              <Card shadow="sm" className="value-card">
                <Title order={4}>Accuracy</Title>
                <Text>
                  We verify facts meticulously and correct errors promptly to
                  ensure our reporting is trustworthy.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col xs={12} sm={6} lg={4}>
              <Card shadow="sm" className="value-card">
                <Title order={4}>Independence</Title>
                <Text>
                  Our editorial decisions are made independently, free from
                  political or commercial influence.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col xs={12} sm={6} lg={4}>
              <Card shadow="sm" className="value-card">
                <Title order={4}>Transparency</Title>
                <Text>
                  We are open about our methods, sources, and the journalistic
                  process behind our stories.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </div>

        <div className="about-section">
          <Title order={3} className="section-title">
            Our Team
          </Title>
          <Text className="section-content">
            Our diverse team of journalists, editors, and digital media
            specialists brings a wealth of experience and perspectives to our
            coverage. We're united by a shared passion for storytelling and a
            commitment to journalistic excellence.
          </Text>
          <Text className="section-content">
            From breaking news to in-depth analysis, our team works around the
            clock to keep you informed about the events shaping our world. We
            believe in the power of journalism to drive positive change and
            foster informed dialogue.
          </Text>
        </div>

        <div className="about-section contact-section">
          <Title order={3} className="section-title">
            Contact Us
          </Title>
          <Text className="section-content">
            We value your feedback and are always looking to improve our
            service. If you have questions, comments, or suggestions, please
            don't hesitate to get in touch with us.
          </Text>
          <Text className="contact-info">
            <strong>Email:</strong> contact@news-portal.com
            <br />
            <strong>Phone:</strong> +1 234 567 890
            <br />
            <strong>Address:</strong> 123 News Street, Media City, NY 10001
          </Text>
        </div>
      </Container>
    </BasePage>
  );
};

export default About;
