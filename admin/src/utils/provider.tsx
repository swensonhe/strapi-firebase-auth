import {
  AiOutlineUserAdd,
  AiFillMail,
  AiFillYahoo,
  AiFillGoogleCircle,
  AiFillPhone,
  AiFillApple,
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillGithub,
} from "react-icons/ai";
import React from "react";
import { MdPassword } from "react-icons/md";
import { Flex } from "@strapi/design-system";
import { Tooltip } from "@strapi/design-system";

const providerIconMapping: { [key: string]: any } = {
  password: <MdPassword size={24} />,
  "google.com": <AiFillGoogleCircle size={24} />,
  "apple.com": <AiFillApple size={24} />,
  "facebook.com": <AiFillFacebook size={24} />,
  "twitter.com": <AiFillTwitterCircle size={24} />,
  "github.com": <AiFillGithub size={24} />,
  "yahoo.com": <AiFillYahoo size={24} />,
  "hotmail.com": <AiFillMail size={24} />,
  phone: <AiFillPhone size={24} />,
  anonymous: <AiOutlineUserAdd size={24} />,
};

export const MapProviderToIcon = ({ providerData }: any) => {
  return (
    <Flex gap={2}>
      {providerData?.map(({ providerId }: any) => (
        <Tooltip description={providerId} key={providerId}>
          <div>{providerIconMapping[providerId] || providerId}</div>
        </Tooltip>
      ))}
    </Flex>
  );
};
