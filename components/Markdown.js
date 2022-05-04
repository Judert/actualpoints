import Image from "next/image";

export const components = {
  p: (paragraph) => {
    const { node } = paragraph;

    if (node.children[0].tagName === "img") {
      const image = node.children[0];
      const metastring = image.properties.alt;
      const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
      const metaWidth = metastring.match(/{([^}]+)x/);
      const metaHeight = metastring.match(/x([^}]+)}/);
      const width = metaWidth ? metaWidth[1] : "768";
      const height = metaHeight ? metaHeight[1] : "432";
      const isPriority = metastring?.toLowerCase().match("{priority}");
      const hasCaption = metastring?.toLowerCase().includes("{caption:");
      const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

      return (
        <div>
          <Image
            src={image.properties.src}
            width={width}
            height={height}
            alt={alt}
            priority={isPriority}
            layout="responsive"
          />
          {hasCaption ? <div aria-label={caption}>{caption}</div> : null}
        </div>
      );
    }
    return <p>{paragraph.children}</p>;
  },
};
