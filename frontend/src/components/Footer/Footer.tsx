import { Image } from "@mantine/core";
import { Link, NavLink } from "react-router-dom";
import { Categories } from "../../types/categories/categories";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import {
  BrandTwitter,
  BrandFacebook,
  BrandInstagram,
  BrandYoutube,
  BrandLinkedin,
  Mail,
  Phone,
  Bookmark,
  InfoCircle,
  FileText,
} from "tabler-icons-react";
import "./Footer.css";

export interface CategoriesProps {
  categories: Categories[] | Categories;
}

export const Footer: React.FC<CategoriesProps> = ({ categories = [] }) => {
  const { data } = useConfiguration();
  const currentYear = new Date().getFullYear();

  // Ensure categories is always an array
  const categoriesArray = Array.isArray(categories) ? categories : [categories];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <Link to="/">
              <Image
                src={data?.header_logo}
                height={60}
                width={60}
                radius="md"
                alt="News Portal Logo"
              />
            </Link>
          </div>
          <div className="footer-description">
            <p>
              Your trusted source for latest news and in-depth stories that
              matter. We deliver accurate, timely, and relevant content to keep
              you informed about what's happening in the world.
            </p>
          </div>
        </div>

        <div className="footer-links">
          <h4 style={{ color: "white" }}>Categories</h4>
          <div className="footer-categories">
            {categoriesArray
              .filter((category) => Boolean(category.show_online))
              .map((category: Categories, index: number) => (
                <NavLink key={index} to={`/category/${category.id}`}>
                  {category.name}
                </NavLink>
              ))}
          </div>
        </div>

        <div className="footer-links">
          <h4 style={{ color: "white" }}>Quick Links</h4>
          <div className="footer-categories">
            <NavLink to="/saved">
              <Bookmark size={16} style={{ marginRight: "8px" }} />
              Saved Articles
            </NavLink>
            <NavLink to="/about">
              <InfoCircle size={16} style={{ marginRight: "8px" }} />
              About Us
            </NavLink>
            <NavLink to="/terms">
              <FileText size={16} style={{ marginRight: "8px" }} />
              Terms of Use
            </NavLink>
          </div>
        </div>

        <div className="footer-right">
          <h4 style={{ color: "white" }}>Connect With Us</h4>
          <p>
            <Mail size={16} style={{ marginRight: "8px" }} />
            Email: contact@news-portal.com
          </p>
          <p>
            <Phone size={16} style={{ marginRight: "8px" }} />
            Phone: +1 234 567 890
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">
              <BrandTwitter size={20} />
            </a>
            <a href="#" aria-label="Facebook">
              <BrandFacebook size={20} />
            </a>
            <a href="#" aria-label="Instagram">
              <BrandInstagram size={20} />
            </a>
            <a href="#" aria-label="YouTube">
              <BrandYoutube size={20} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <BrandLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} News Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};
