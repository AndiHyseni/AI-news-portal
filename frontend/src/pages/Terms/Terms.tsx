import { Container, Title, Text, Accordion, List } from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import "./Terms.css";

export const Terms: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <BasePage>
      <Container className="terms-page">
        <div className="terms-header">
          <Title order={1} className="terms-title">
            Terms of Use
          </Title>
          <Text className="terms-subtitle">
            Last updated: May {currentYear}
          </Text>
        </div>

        <div className="terms-section">
          <Text className="terms-intro">
            Welcome to News Portal. These Terms of Use govern your use of our
            website and services. By accessing or using our site, you agree to
            be bound by these Terms of Use. Please read them carefully before
            using our services.
          </Text>

          <Accordion variant="separated" className="terms-accordion">
            <Accordion.Item value="acceptance">
              <Accordion.Control>1. Acceptance of Terms</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  By accessing or using the News Portal website, mobile
                  applications, or any of our services (collectively, the
                  "Services"), you agree to be bound by these Terms of Use. If
                  you do not agree to these terms, please do not use our
                  Services.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="changes">
              <Accordion.Control>2. Changes to Terms</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  We reserve the right to modify these Terms of Use at any time.
                  We will provide notice of significant changes by posting the
                  updated terms on our website. Your continued use of our
                  Services after such modifications constitutes your acceptance
                  of the revised Terms of Use.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="account">
              <Accordion.Control>
                3. Account Registration and Security
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  To access certain features of our Services, you may be
                  required to register for an account. You are responsible for
                  maintaining the confidentiality of your account information
                  and password. You agree to:
                </Text>
                <List className="terms-list">
                  <List.Item>
                    Provide accurate and complete information when creating an
                    account
                  </List.Item>
                  <List.Item>
                    Update your information to keep it current
                  </List.Item>
                  <List.Item>
                    Maintain the security of your account credentials
                  </List.Item>
                  <List.Item>
                    Accept responsibility for all activities that occur under
                    your account
                  </List.Item>
                </List>
                <Text>
                  We reserve the right to terminate accounts that violate our
                  Terms of Use or for any other reason at our sole discretion.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="content">
              <Accordion.Control>
                4. Content and Intellectual Property
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  All content provided on our Services, including but not
                  limited to articles, photographs, videos, graphics, logos, and
                  software, is owned by News Portal or its licensors and is
                  protected by copyright, trademark, and other intellectual
                  property laws.
                </Text>
                <Text className="mt-10">
                  You may access and view content for personal, non-commercial
                  use only. You may not modify, reproduce, distribute, publish,
                  transmit, or create derivative works from any content without
                  obtaining prior written consent from News Portal or the
                  respective rights holder.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="user-content">
              <Accordion.Control>5. User-Generated Content</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  By submitting content to our Services (including comments,
                  feedback, or other materials), you grant News Portal a
                  worldwide, non-exclusive, royalty-free, perpetual, irrevocable
                  right to use, reproduce, modify, adapt, publish, translate,
                  create derivative works from, distribute, and display such
                  content.
                </Text>
                <Text className="mt-10">
                  You affirm that you have all necessary rights to grant these
                  permissions and that your content does not violate any
                  third-party rights or applicable laws.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="prohibited">
              <Accordion.Control>6. Prohibited Conduct</Accordion.Control>
              <Accordion.Panel>
                <Text>When using our Services, you agree not to:</Text>
                <List className="terms-list">
                  <List.Item>
                    Violate any applicable laws or regulations
                  </List.Item>
                  <List.Item>Impersonate any person or entity</List.Item>
                  <List.Item>
                    Upload or transmit viruses or malicious code
                  </List.Item>
                  <List.Item>
                    Interfere with or disrupt the Services or servers
                  </List.Item>
                  <List.Item>
                    Collect user information without consent
                  </List.Item>
                  <List.Item>
                    Post content that is unlawful, harmful, threatening,
                    abusive, harassing, defamatory, vulgar, obscene, or invasive
                    of another's privacy
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="liability">
              <Accordion.Control>7. Limitation of Liability</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  News Portal shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising out of or
                  relating to your use of our Services. In no event shall our
                  total liability exceed the amount paid by you, if any, for
                  accessing our Services.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="disclaimer">
              <Accordion.Control>8. Disclaimer of Warranties</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  Our Services are provided "as is" and "as available" without
                  any warranties of any kind, either express or implied. We do
                  not guarantee that our Services will be uninterrupted, secure,
                  or error-free.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="termination">
              <Accordion.Control>9. Termination</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  We may terminate or suspend your access to our Services
                  immediately, without prior notice or liability, for any
                  reason, including, without limitation, if you breach these
                  Terms of Use.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="contact">
              <Accordion.Control>10. Contact Information</Accordion.Control>
              <Accordion.Panel>
                <Text>
                  If you have any questions about these Terms of Use, please
                  contact us at:
                </Text>
                <Text className="contact-info mt-10">
                  Email: legal@news-portal.com
                  <br />
                  Address: 123 News Street, Media City, NY 10001
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>

        <div className="terms-footer">
          <Text>
            By using News Portal, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Use.
          </Text>
          <Text className="copyright">
            &copy; {currentYear} News Portal. All rights reserved.
          </Text>
        </div>
      </Container>
    </BasePage>
  );
};

export default Terms;
