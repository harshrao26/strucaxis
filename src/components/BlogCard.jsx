"use client"
import Image from "next/image";

const BlogCard = ({
  image,
  category,
  date,
  readTime,
  title,
  summary,
  authorName,
  authorImage,
}) => {
   const toTitleCase = (str) =>
      str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="relative h-52 w-full">
        <img src={image} alt={title} fill className="w-full object-cover h-52" />
        {/* <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
          {category}
        </span> */}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-2">
          {date} • {readTime}
        </p>
        <h3 className="text-lg font-medium  mb-1">{toTitleCase(title)}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{summary}</p>
        <div className="flex items-center gap-2 mt-4">
          {/* <img
            src={authorImage}
            alt={authorName}
            width={28}
            height={28}
            className="rounded-full object-cover"
          /> */}
          <p className="text-sm font-medium text-gray-800">{authorName}</p>
        </div>
      </div>
    </div>
  );
};


export default BlogCard;
