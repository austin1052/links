import React from "react";
import {AiOutlineClose} from "react-icons/ai";
import { getToken } from "../utils";

const Tag = ({ tag, link, setLinks }) => {
  const token = getToken();

  const handleDeleteTag = async () => {
    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const deletedTag = await response.json();
      const newTags = link.tags.filter((tag) => tag.id !== deletedTag.id);
      link.tags = newTags;
      setLinks((currentLinks) => {
        return currentLinks.map((l) => {
          if (l.id !== link.id) return l;
          return link;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };
  let iconStyles = { color: "white", fontSize: "1.5em" };
  return (
    <div className="tag">
      <AiOutlineClose className="delete__tag" onClick={handleDeleteTag} />
      {tag.tagName}
    </div>
  );
};

export default Tag;
