import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { getToken } from "../utils";

const LinkInfo = ({
  link,
  setLinks,
  setShowComments,
  setShowEditModal,
  setLinkToUpdate,
}) => {
  const handleCommentClick = () => {
    setShowComments(true);
  };

  const token = getToken();

  const { title, comments, url, tags, clickCount } = link;
  // let clickCount = link.clickCount;

  //use url here instead of title. will need to trim url first
  const icon = `https://www.google.com/s2/favicons?sz=64&domain_url=${title}.com`;

  const handleClick = async (event) => {
    // clickCount += 1;
    try {
      const response = await fetch(`/api/links/click/${link.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          clickCount: clickCount + 1,
        }),
      });
      let updatedLink = await response.json();
      updatedLink.comments = comments;
      updatedLink.tags = tags;
      setLinks((currentLinks) => {
        return currentLinks.map((l) => {
          if (l.id !== updatedLink.id) return l;
          return updatedLink;
        });
      });
    } catch (error) {}
  };

  const handleEditLink = () => {
    setShowEditModal(true);
    setLinkToUpdate(link);
  };

  return (
    <div className="comment__card">
      <span onClick={handleCommentClick}>Comments ({comments.length})</span>
      <div className="card">
        <div className="card__header">
          <div className="card__title">{title}</div>
          <div className="edit__link">
            <BsThreeDots onClick={handleEditLink} />
          </div>
        </div>

        <a
          target="_blank"
          className="card__content"
          href={url}
          onClick={handleClick}
        >
          <div className="card__tags">
            {tags &&
              tags.map((tag) => {
                return (
                  <div key={tag.id} className="card__tag">
                    {tag.tagName}
                  </div>
                );
              })}
          </div>
          <div className="icon__click__container">
            {/* <div className="click__count__container"> */}
            <div className="click__count__container">
              <span id="card__click__count">{clickCount}</span>
              {clickCount === 1 ? "visit" : "visits"}
            </div>
            {/* </div> */}
            <div className="card__icon">
              <img src={icon} alt="" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default LinkInfo;
