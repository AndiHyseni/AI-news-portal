import {
  Container,
  Title,
  Paper,
  Text,
  Button,
  Group,
  Badge,
  Stack,
} from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import { IconBriefcase, IconMapPin, IconClock } from "@tabler/icons-react";
import "./Careers.css";

export const Careers: React.FC = () => {
  const openPositions = [
    {
      title: "AI News Editor",
      department: "Editorial",
      location: "Remote",
      type: "Full-time",
      description:
        "We're looking for an experienced editor who understands both journalism and AI technology to help curate and oversee our AI-powered news content.",
      requirements: [
        "5+ years of editorial experience",
        "Understanding of AI and ML concepts",
        "Strong editorial judgment",
        "Experience with digital news platforms",
      ],
    },
    {
      title: "News Content Writer",
      department: "Content",
      location: "Hybrid",
      type: "Full-time",
      description:
        "Join our dynamic content team to create engaging, accurate, and timely news articles across various categories.",
      requirements: [
        "3+ years of journalism experience",
        "Strong writing and research skills",
        "Ability to work in fast-paced environment",
        "Experience with CMS platforms",
      ],
    },
    {
      title: "AI/ML Engineer",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      description:
        "Help develop and improve our AI-powered news analysis and recommendation systems.",
      requirements: [
        "Experience with NLP and ML models",
        "Strong Python programming skills",
        "Understanding of news content analysis",
        "Background in recommendation systems",
      ],
    },
    {
      title: "News Researcher",
      department: "Research",
      location: "On-site",
      type: "Part-time",
      description:
        "Support our editorial team with in-depth research and fact-checking for news stories.",
      requirements: [
        "Strong analytical skills",
        "Attention to detail",
        "Research methodology knowledge",
        "Fact-checking experience",
      ],
    },
    {
      title: "Social Media Manager",
      department: "Marketing",
      location: "Hybrid",
      type: "Full-time",
      description:
        "Lead our social media strategy and engage with our audience across multiple platforms while promoting AI-powered news content.",
      requirements: [
        "3+ years of social media management",
        "Experience with analytics tools",
        "Content creation skills",
        "Understanding of news media landscape",
      ],
    },
  ];

  return (
    <BasePage>
      <Container size="xl" px="xs">
        <div className="careers-page">
          <div className="careers-header">
            <Title order={1} className="careers-title">
              Join Our Team
            </Title>
            <Text size="lg" color="dimmed" mt="md">
              Help us shape the future of AI-powered news delivery
            </Text>
          </div>

          <div className="positions-grid">
            {openPositions.map((position, index) => (
              <Paper key={index} className="position-card">
                <div className="position-content">
                  <Group position="apart" mb="xs">
                    <Title order={3}>{position.title}</Title>
                    <Badge size="lg" variant="outline" color="blue">
                      {position.type}
                    </Badge>
                  </Group>

                  <Group spacing="xs" mb="md">
                    <Group spacing={4}>
                      <IconBriefcase size={16} />
                      <Text size="sm">{position.department}</Text>
                    </Group>
                    <Text size="sm" color="dimmed">
                      •
                    </Text>
                    <Group spacing={4}>
                      <IconMapPin size={16} />
                      <Text size="sm">{position.location}</Text>
                    </Group>
                    <Text size="sm" color="dimmed">
                      •
                    </Text>
                    <Group spacing={4}>
                      <IconClock size={16} />
                      <Text size="sm">Immediate Start</Text>
                    </Group>
                  </Group>

                  <Text mb="md">{position.description}</Text>

                  <Stack spacing="xs" mb="xl">
                    <Text weight={500}>Requirements:</Text>
                    {position.requirements.map((req, idx) => (
                      <Text key={idx} size="sm" color="dimmed">
                        • {req}
                      </Text>
                    ))}
                  </Stack>
                </div>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  className="apply-button"
                >
                  Apply Now
                </Button>
              </Paper>
            ))}
          </div>
        </div>
      </Container>
    </BasePage>
  );
};
