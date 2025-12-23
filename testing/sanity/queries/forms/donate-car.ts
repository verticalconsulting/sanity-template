import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const formDonateCarQuery = groq`
  _type == "form-donate-car" => {
    _type,
    _key,
    padding,
    colorVariant,
    stackAlign,
    title,
    description,
    buttonText,
    successMessage,
  }
`;
