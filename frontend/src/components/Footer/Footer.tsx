import "../Footer/Footer.css";
import { Image } from "@mantine/core";
import { Link, NavLink } from "react-router-dom";
import { Categories } from "../../types/categories/categories";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";

type CategoriesResponse = Categories[] | { categories: Categories[] };

export interface CategoriesProps {
  categories: CategoriesResponse;
}

export const Footer: React.FC<CategoriesProps> = ({ categories = [] }) => {
  const { data } = useConfiguration();

  // Ensure categories is an array and handle the data structure
  const categoriesArray: Categories[] = Array.isArray(categories)
    ? categories
    : (categories as { categories: Categories[] }).categories || [];

  return (
    <div className="footer">
      <div style={{ display: "flex" }}>
        <div className="column1">
          <Link className="footerImage" to="/">
            <Image src={data?.footer_logo} height={100} width={100} />
          </Link>
          <p>
            Ky portal mirëmbahet nga kompania "Portal News". Materialet dhe
            informacionet në këtë portal nuk mund të kopjohen, të shtypen, ose
            të përdoren në çfarëdo forme tjetër për qëllime përfitimi, pa
            miratimin e drejtuesve të "Portal News". Për ta shfrytëzuar
            materialin e këtij portali obligoheni t'i pranoni Kushtet e
            përdorimit.
          </p>
        </div>
        <div className="column2">
          <div className="footerFirstItem">
            <b>Udhëzim</b>
          </div>
          {categoriesArray
            .filter((x: Categories) => x.show_online === true)
            .map((category: Categories, index: number) => (
              <NavLink key={index} to={`/category/${category.id}`}>
                <div className="footerItem">{category.name}</div>
              </NavLink>
            ))}
        </div>
      </div>
      <div className="hr-footer">
        <hr
          style={{
            background: "white",
            color: "white",
            borderColor: "white",
            width: "100%",
          }}
        />
      </div>
      <div className="copyright">
        <h4>Portal News © All rights reserved</h4>
      </div>
    </div>
  );
};
