import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import desc from "../data/descriptions.json";

const settings = {
  // graphql: {
  //   uri: "",
  // },
  meta: {
    rootUrl: "www.actualpoints.com",
    title: "Actual Points",
    description: desc.about,
    social: {
      graphic:
        "https://firebasestorage.googleapis.com/v0/b/blog-veselcode.appspot.com/o/SEO%2Fwhitelogo.png?alt=media&token=c70fe98d-beef-49ea-8a13-f015b9b214a5",
      twitter: "@actualpoints",
    },
  },
  // routes: {
  //   authenticated: {
  //     pathAfterFailure: "/login",
  //   },
  //   public: {
  //     pathAfterFailure: "/documents",
  //   },
  // },
};

const socialTags = ({
  type,
  url,
  title,
  description,
  image,
  createdAt,
  updatedAt,
}) => {
  const metaTags = [
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:site",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:creator",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:image:src", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "og:title", content: title },
    { name: "og:type", content: type },
    { name: "og:url", content: url },
    { name: "og:image", content: image },
    { name: "og:description", content: description },
    {
      name: "og:site_name",
      content: settings && settings.meta && settings.meta.title,
    },
    {
      name: "og:published_time",
      content: createdAt || new Date().toISOString(),
    },
    {
      name: "og:modified_time",
      content: updatedAt || new Date().toISOString(),
    },
  ];

  return metaTags;
};

const SEO = (props) => {
  const {
    title,
    description,
    image = settings.meta.social.graphic,
    type,
    noindex = false,
  } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={props.url} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />
      {type === "article" && (
        <meta property="article:published_time" content={props.date} />
      )}
      {socialTags(props).map(({ name, content }) => {
        return <meta key={name} name={name} content={content} />;
      })}
      {noindex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

SEO.defaultProps = {
  url: "/",
  type: "article",
  title: settings && settings.meta && settings.meta.title,
  description: settings && settings.meta && settings.meta.description,
  image:
    settings &&
    settings.meta &&
    settings.meta.social &&
    settings.meta.social.graphic,
};

SEO.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

export default SEO;
