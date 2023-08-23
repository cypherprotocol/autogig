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

const PropDefaults = {
  tips: [
    {
      id: 1,
      description: "Do your research",
    },
    {
      id: 1,
      description: "Practice, practice, practice",
    },
    {
      id: 1,
      description: "Develop projects",
    },
  ],
};

export const FollowupEmail = ({ tips = PropDefaults.tips }) => (
  <Html>
    <Head />
    <Tailwind>
      <Preview>We are on the hunt!</Preview>
      <Body className="m-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[600px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-8">
            <Img
              src={`https://autogig.pro/images/logo.svg`}
              width="100"
              height="42"
              alt="Autogig"
            />
          </Section>
          <Heading className="mx-0 my-[30px] p-0 text-[24px] font-normal text-black">
            We are on the hunt! 🤖
          </Heading>
          <Text className="text-[14px] leading-[24px] text-black">
            We are working on landing you interviews at your dream job and will
            be in touch soon. Here are some steps to ace your next interview:
          </Text>

          <ul>
            {tips?.map((tip) => (
              <li key={tip.id}>
                <Text>{tip.description}</Text>
              </li>
            ))}
          </ul>

          <Text className="">
            For more details, feel free to read{" "}
            <Link href="https://autogig.pro/blog" className="text-[#5c5bee]">
              our blog.
            </Link>{" "}
          </Text>
          <Hr />
          <Section className="my-[32px] text-center">
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
    </Tailwind>
  </Html>
);

export default FollowupEmail;
