import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "";

export const FollowupEmail = () => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>We are on the hunt!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section className="flex w-full items-center mt-8 justify-center">
            <Img
              src={`https://autogig.pro/images/logo.svg`}
              width="100"
              height="42"
              alt="Autogig"
            />
          </Section>
          <Heading style={h1} className="text-center">
            We are on the hunt! 🤖
          </Heading>
          <Text style={heroText} className="text-center">
            We are working on landing you interviews at your dream job and will
            be in touch soon. Here are some steps to ace your next interview:
          </Text>

          <Section>
            <Container className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c5bee]">
              <Text className="text-white">1</Text>
            </Container>
            <Text className="text-center font-medium">Do your research</Text>
            <Container className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c5bee]">
              <Text className="text-white">2</Text>
            </Container>
            <Text className="text-center font-medium">
              Practice, practice, practice
            </Text>
            <Container className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c5bee]">
              <Text className="text-white">3</Text>
            </Container>
            <Text className="text-center font-medium">Develop projects</Text>
          </Section>
          <Hr />
          <Text className="text-center">
            For more details, feel free to read{" "}
            <Link href="https://autogig.pro/blog" className="text-[#5c5bee]">
              our blog
            </Link>{" "}
          </Text>

          <Section className="flex items-center justify-center">
            <Button
              pX={20}
              pY={12}
              className="rounded bg-[#ffc434] text-center font-semibold text-black no-underline"
              href={"https://discord.gg/j4BAHXm77"}
            >
              Join our Discord
            </Button>
          </Section>

          {/* <Section style={codeBox}>
          <Text style={confirmationCodeText}></Text>
        </Section> */}
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default FollowupEmail;

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};
