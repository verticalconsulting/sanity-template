import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const formContactQuery = groq`
  _type == "form-contact" => {
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
