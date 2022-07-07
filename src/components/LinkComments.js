import React, { useState } from "react";
import { getToken } from "../utils";
import { Comment } from "./index";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

const LinkComments = ({ link, setShowComments, setLinks }) => {
  const [commentInput, setCommentInput] = useState("");
  const [showEditComments, setShowEditComments] = useState(false);
  const { comments, id } = link;

  const token = getToken();

  const handleClose = () => {
    setShowComments(false);
  };

  const handleEdit = () => {
    setShowEditComments(!showEditComments);
  };

  const handleInputChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          body: commentInput,
        }),
      });
      const comment = await response.json();
      const newComments = [...link.comments, comment];
      link.comments = newComments;
      setLinks((currentLinks) => {
        return currentLinks.map((l) => {
          if (l.id !== link.id) return l;
          return link;
        });
      });
      setCommentInput("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="comment__card open">
      <div className="card__open">
        <div className="comment__header">
          <div className="icon" onClick={handleEdit}>
            <BsThreeDots />
          </div>
          <div>Comments</div>
          <div className="icon" onClick={handleClose}>
            <AiOutlineClose />
          </div>
        </div>
      </div>
      <div className="comment__container">
        <div className="all__comments">
          {comments &&
            comments.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  comment={comment}
                  showEditComments={showEditComments}
                  setLinks={setLinks}
                  link={link}
                />
              );
            })}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a comment"
            value={commentInput}
            onChange={handleInputChange}
            required
          />
          <button>Add</button>
        </form>
      </div>
    </div>
  );
};

export default LinkComments;