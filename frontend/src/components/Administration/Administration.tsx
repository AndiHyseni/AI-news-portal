import { Image } from "@mantine/core";
import { Rapport } from "../../types/administration/administration";
import "../Administration/Administration.css";

export interface AdministrationProps {
  raport: Rapport;
}

export const Administration: React.FC<AdministrationProps> = ({ raport }) => {
  return (
    <div className="dashboard">
      <div className="raports">
        <div className="raportBox">
          <Image src="../../images/users.png" width={250} height={200} />
          <h1 className="boxTitle">Users</h1>
          <p className="boxParagraph">Number of Users: {raport.users}</p>
        </div>
        <div className="raportBox">
          <Image src="../../images/admin.png" width={250} height={200} />
          <h1 className="boxTitle">Admins</h1>
          <p className="boxParagraph">Number of Admins: {raport.admins}</p>
        </div>
        <div className="raportBox">
          <Image src="../../images/views.png" width={250} height={200} />
          <h1 className="boxTitle">Views</h1>
          <p className="boxParagraph">Number of Views: {raport.vIews}</p>
        </div>
      </div>
      <div className="raports">
        <div className="raportBox">
          <Image src="../../images/news.jpg" width={250} height={200} />
          <h1 className="boxTitle">News</h1>
          <p className="boxParagraph">Number of News: {raport.news}</p>
        </div>
        <div className="raportBox">
          <Image src="../../images/category.png" width={250} height={200} />
          <h1 className="boxTitle">Categories</h1>
          <p className="boxParagraph">
            Number of Categories: {raport.categories}
          </p>
        </div>
        <div className="raportBox">
          <Image src="../../images/savedNews.jpg" width={250} height={200} />
          <h1 className="boxTitle">Saved News</h1>
          <p className="boxParagraph">Number of Saved News: {raport.saved}</p>
        </div>
      </div>
      <div className="raports">
        <div className="raportBox">
          <Image src="../../images/happy.png" width={250} height={200} />
          <h1 className="boxTitle">Happy</h1>
          <p className="boxParagraph">
            Number of Happy reactions: {raport.happy}
          </p>
        </div>
        <div className="raportBox">
          <Image src="../../images/sad.png" width={250} height={200} />
          <h1 className="boxTitle">Sad</h1>
          <p className="boxParagraph">Number of Sad reactions: {raport.sad}</p>
        </div>
        <div className="raportBox">
          <Image src="../../images/angry.jpg" width={250} height={200} />
          <h1 className="boxTitle">Angry</h1>
          <p className="boxParagraph">
            Number of Angry reactions: {raport.angry}
          </p>
        </div>
      </div>
    </div>
  );
};
