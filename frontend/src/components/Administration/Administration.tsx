import { Image, Title, Grid, Paper } from "@mantine/core";
import { Rapport } from "../../types/administration/administration";
import "../Administration/Administration.css";

export interface AdministrationProps {
  raport: Rapport;
}

export const Administration: React.FC<AdministrationProps> = ({ raport }) => {
  return (
    <>
      <Title order={2} mb={30} className="category-page-title">
        Dashboard Overview
      </Title>
      <div className="dashboard">
        <Grid className="raports">
          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/users.png"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Users</h2>
              <p className="boxParagraph">Number of Users: {raport.users}</p>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/admin.png"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Admins</h2>
              <p className="boxParagraph">Number of Admins: {raport.admins}</p>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/views.png"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Views</h2>
              <p className="boxParagraph">Number of Views: {raport.views}</p>
            </Paper>
          </Grid.Col>
        </Grid>

        <Grid className="raports">
          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image src="../../images/news.jpg" height={180} fit="contain" />
              </div>
              <h2 className="boxTitle">News</h2>
              <p className="boxParagraph">Number of News: {raport.news}</p>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/category.png"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Categories</h2>
              <p className="boxParagraph">
                Number of Categories: {raport.categories}
              </p>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/savedNews.jpg"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Saved News</h2>
              <p className="boxParagraph">
                Number of Saved News: {raport.saved}
              </p>
            </Paper>
          </Grid.Col>
        </Grid>

        <Grid className="raports">
          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/happy.png"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Happy</h2>
              <p className="boxParagraph">
                Number of Happy reactions: {raport.happy}
              </p>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image src="../../images/sad.png" height={180} fit="contain" />
              </div>
              <h2 className="boxTitle">Sad</h2>
              <p className="boxParagraph">
                Number of Sad reactions: {raport.sad}
              </p>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={6} md={4}>
            <Paper className="raportBox">
              <div className="image-container" style={{ height: "180px" }}>
                <Image
                  src="../../images/angry.jpg"
                  height={180}
                  fit="contain"
                />
              </div>
              <h2 className="boxTitle">Angry</h2>
              <p className="boxParagraph">
                Number of Angry reactions: {raport.angry}
              </p>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};
