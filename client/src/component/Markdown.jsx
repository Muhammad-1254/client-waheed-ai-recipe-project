import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Markdown = ({ children, styles, loading }) => {
  const renderers = {
    link: ({ href, children }) => {
      if (href.includes("youtube.com") || href.includes("youtu.be")) {
        const videoId =
          href.split("v=")[1]?.split("&")[0] || href.split("youtu.be/")[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            width="560"
            height="315"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
      return <a href={href}>{children}</a>;
    },
  };

  if (loading) {
    return <div className="text-center ">Loading...</div>;
  }
  return (
    <ReactMarkdown
      components={renderers}
      rehypePlugins={[rehypeRaw]}

      className={` prose-sm md:prose-base lg:prose-lg
    prose-ul:list-disc prose-ol:list-decimal 
    ${styles}`}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
