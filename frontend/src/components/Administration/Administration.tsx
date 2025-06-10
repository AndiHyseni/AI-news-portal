import {
  Title,
  Grid,
  Paper,
  Group,
  Text,
  Container,
  SimpleGrid,
  RingProgress,
  Stack,
} from "@mantine/core";
import { Rapport } from "../../types/administration/administration";
import "../Administration/Administration.css";
import {
  IconUsers,
  IconNews,
  IconCategory,
  IconBookmark,
  IconMoodHappy,
  IconMoodSad,
  IconMoodAngry,
  IconUserShield,
  IconEye,
  IconChartBar,
  IconDeviceAnalytics,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export interface AdministrationProps {
  raport: Rapport;
}

export const Administration: React.FC<AdministrationProps> = ({ raport }) => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: "Total Users",
      count: raport.users,
      icon: IconUsers,
      color: "#3b82f6",
      path: "/admin/users",
    },
    {
      title: "Admins",
      count: raport.admins,
      icon: IconUserShield,
      color: "#ec4899",
      path: "/admin/users",
    },
    {
      title: "Views",
      count: raport.views,
      icon: IconEye,
      color: "#22c55e",
      path: "/admin/views",
    },
    {
      title: "News",
      count: raport.news,
      icon: IconNews,
      color: "#f97316",
      path: "/admin/news",
    },
    {
      title: "Categories",
      count: raport.categories,
      icon: IconCategory,
      color: "#8b5cf6",
      path: "/admin/categories",
    },
    {
      title: "Saved News",
      count: raport.saved,
      icon: IconBookmark,
      color: "#06b6d4",
      path: "/saved",
    },
    {
      title: "Happy Reactions",
      count: raport.happy,
      icon: IconMoodHappy,
      color: "#eab308",
      path: "/admin/reactions",
    },
    {
      title: "Sad Reactions",
      count: raport.sad,
      icon: IconMoodSad,
      color: "#64748b",
      path: "/admin/reactions",
    },
    {
      title: "Angry Reactions",
      count: raport.angry,
      icon: IconMoodAngry,
      color: "#ef4444",
      path: "/admin/reactions",
    },
  ];

  // Calculate total reactions for percentage calculations
  const totalReactions = raport.happy + raport.sad + raport.angry;

  const statisticsItems = [
    {
      title: "Reaction Distribution",
      component: (
        <RingProgress
          size={150}
          roundCaps
          thickness={8}
          sections={[
            { value: (raport.happy / totalReactions) * 100, color: "#eab308" },
            { value: (raport.sad / totalReactions) * 100, color: "#64748b" },
            { value: (raport.angry / totalReactions) * 100, color: "#ef4444" },
          ]}
          label={
            <Text color="dimmed" align="center" size="sm">
              Total Reactions: {totalReactions}
            </Text>
          }
        />
      ),
    },
    {
      title: "News Statistics",
      icon: IconChartBar,
      stats: [
        {
          label: "Average Views per News",
          value: Math.round(raport.views / raport.news),
        },
        {
          label: "Average Reactions per News",
          value: Math.round(totalReactions / raport.news),
        },
        {
          label: "Saved Rate",
          value: `${Math.round((raport.saved / raport.news) * 100)}%`,
        },
      ],
    },
    {
      title: "User Engagement",
      icon: IconDeviceAnalytics,
      stats: [
        {
          label: "Views per User",
          value: Math.round(raport.views / raport.users),
        },
        {
          label: "Reactions per User",
          value: Math.round(totalReactions / raport.users),
        },
        {
          label: "Saved Items per User",
          value: Math.round(raport.saved / raport.users),
        },
      ],
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Container size="xl">
      <Title order={2} mb={30} className="category-page-title">
        Dashboard Overview
      </Title>

      <div className="dashboard">
        <Grid>
          {dashboardItems.map((item, index) => (
            <Grid.Col key={index} sm={12} md={4}>
              <Paper
                className="raportBox"
                onClick={() => handleCardClick(item.path)}
              >
                <Group position="apart" align="center">
                  <div className="image-container">
                    <item.icon size={32} color={item.color} stroke={1.5} />
                  </div>
                </Group>
                <Title order={3} className="boxTitle">
                  {item.title}
                </Title>
                <Text className="boxParagraph">
                  {typeof item.count === "number"
                    ? `Number of ${item.title}: ${item.count}`
                    : `Number of ${item.title}: ${item.count}`}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>

        <Title order={3} mt={40} mb={20} className="category-page-title">
          Detailed Statistics
        </Title>

        <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          {statisticsItems.map((item, index) => (
            <Paper key={index} p="md" radius="md" className="stat-card">
              <Title order={4} mb={15}>
                {item.title}
              </Title>
              {item.component ? (
                <Group position="center">{item.component}</Group>
              ) : (
                <Stack spacing="xs">
                  {item.stats?.map((stat, idx) => (
                    <Group key={idx} position="apart">
                      <Text size="sm" color="dimmed">
                        {stat.label}
                      </Text>
                      <Text size="sm" weight={500}>
                        {stat.value}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              )}
            </Paper>
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
};
