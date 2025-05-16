import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../components/Login/LoginPage";
import { RegisterPage } from "../components/Register/RegisterPage";
import { AdminCategories } from "../pages/AdminCategories/AdminCategories";
import { AddNewsPage } from "../pages/AdminNews/AddNewsPage";
import { AdminNews } from "../pages/AdminNews/AdminNews";
import { EditNewsPage } from "../pages/AdminNews/EditNewsPage";
import { AdminNewsDetails } from "../pages/AdminNewsDetails/AdminNewsDetails";
import { AdminReactions } from "../pages/AdminReactions/AdminReactions";
import { AdminReactionsDetails } from "../pages/AdminReactions/AdminReactionsDetails";
import { AddUsersPage } from "../pages/AdminUsers/AddUsers";
import { AdminUsers } from "../pages/AdminUsers/AdminUsers";
import { AdminViews } from "../pages/AdminViews/AdminViews";
import { AdminViewsDetails } from "../pages/AdminViews/AdminViewsDetails";
import { Configuration } from "../pages/Configuration/Configuration";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import { Homepage } from "../pages/Homepage/Homepage";
import { NewsByCategory } from "../pages/NewsByCategory/NewsByCategory";
import { NewsByTags } from "../pages/NewsByTags/NewsByTags";
import { NewsDetails } from "../pages/NewsDetails/NewsDetails";
import { SavedNews } from "../pages/SavedNews/SavedNews";
import { About } from "../pages/About/About";
import { Terms } from "../pages/Terms/Terms";
import { ErrorPage } from "./ErrorPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/news/:newsId" element={<NewsDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/category/:categoryId" element={<NewsByCategory />} />
        <Route path="/tag/:tags" element={<NewsByTags />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/denied" element={<ErrorPage />} />

        {/* Protected routes for all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/saved" element={<SavedNews />} />
        </Route>

        {/* Protected routes for admin users */}
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="/news" element={<AdminNews />} />
          <Route path="/news/add" element={<AddNewsPage />} />
          <Route path="/news/details/:newsId" element={<AdminNewsDetails />} />
          <Route path="/news/edit/:newsId" element={<EditNewsPage />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/Category" element={<AdminCategories />} />
          <Route path="/views" element={<AdminViews />} />
          <Route path="/views/:newsId" element={<AdminViewsDetails />} />
          <Route path="/reaction" element={<AdminReactions />} />
          <Route path="/reaction/:newsId" element={<AdminReactionsDetails />} />
          <Route path="/addAdmin" element={<AddUsersPage />} />
          <Route path="/configuration" element={<Configuration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
