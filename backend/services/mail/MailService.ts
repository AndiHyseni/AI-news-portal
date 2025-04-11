import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";

interface MailSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface MailRequest {
  toEmail: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

interface WelcomeRequest {
  userName: string;
  toEmail: string;
}

export default class MailService {
  private static instance: MailService;
  private transporter: nodemailer.Transporter;
  private mailSettings: MailSettings;

  private constructor() {
    this.mailSettings = {
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };
    this.transporter = nodemailer.createTransport(this.mailSettings);
  }

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  private async sendEmailAsync(mailRequest: MailRequest): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.mailSettings.auth.user,
        to: mailRequest.toEmail,
        subject: mailRequest.subject,
        html: mailRequest.body,
        attachments: mailRequest.attachments,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  public static async sendWelcomeEmailAsync(
    request: WelcomeRequest
  ): Promise<void> {
    try {
      const templatePath = join(
        __dirname,
        "../../templates/WelcomeTemplate.html"
      );
      let mailText = readFileSync(templatePath, "utf8");

      mailText = mailText
        .replace("[username]", request.userName)
        .replace("[email]", request.toEmail);

      await MailService.getInstance().sendEmailAsync({
        toEmail: request.toEmail,
        subject: `Welcome ${request.userName}`,
        body: mailText,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
  }

  public static async sendResetPasswordEmail(
    email: string,
    resetLink: string
  ): Promise<void> {
    try {
      const templatePath = join(
        __dirname,
        "../../templates/ResetPasswordTemplate.html"
      );
      let mailText = readFileSync(templatePath, "utf8");

      mailText = mailText
        .replace("[resetLink]", resetLink)
        .replace("[email]", email);

      await MailService.getInstance().sendEmailAsync({
        toEmail: email,
        subject: "Password Reset Request",
        body: mailText,
      });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      throw error;
    }
  }
}
