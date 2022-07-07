import React from "react";
import { getToken } from "../utils";
import {AiOutlineClose} from "react-icons/ai";


const Comment = ({ comment, showEditComments, setLinks, link }) => {
  const { id, body } = comment;
  const token = getToken();

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const deletedComment = await response.json();
    } catch (error) {
      console.error(error);
    }
    const newComments = link.comments.filter((c) => c.id !== id);
    link.comments = newComments;
    setLinks((currentLinks) => {
      return currentLinks.map((l) => {
        if (l.id !== link.id) return l;
        return link;
      });
    });
  };

  return (
    <div className="comment">
      {showEditComments && (
        <div className="delete__comment">
          <AiOutlineClose style={{fill: "#b0b0b0"}} onClick={handleDeleteComment} />
        </div>
      )}
      <div className="comment__body">{body}</div>
    </div>
  );
};

export default Comment;
