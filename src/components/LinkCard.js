import React, { useState } from "react";
import "../css/LinkCard.css";
import { LinkInfo, LinkComments } from "./index";

const LinkCard = ({ link, setLinks, setShowEditModal, setLinkToUpdate }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="card__container">
      {showComments ? (
        <LinkComments
          link={link}
          setShowComments={setShowComments}
          setLinks={setLinks}
        />
      ) : (
        <LinkInfo
          link={link}
          setLinks={setLinks}
          setShowComments={setShowComments}
          setShowEditModal={setShowEditModal}
          setLinkToUpdate={setLinkToUpdate}
        />
      )}
    </div>
  );
};

export default LinkCard;
