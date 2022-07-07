import React, { useState } from "react";
import { Tag } from "./index";
import { getToken } from "../utils";
import "../css/style.css";

const EditLink = ({ link, setShowEditModal, setLinks }) => {
  const { id, title, url, tags } = link;
  const [titleInput, setTitleInput] = useState(title);
  const [urlInput, setUrlInput] = useState(url);
  const [tagsInput, setTagsInput] = useState("");

  const token = getToken();

  const titleHandler = (event) => {
    setTitleInput(event.target.value);
  };

  const urlHandler = (event) => {
    setUrlInput(event.target.value);
  };

  const tagsHandler = (event) => {
    setTagsInput(event.target.value);
  };

  const handleCancel = () => {
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const deletedLink = await response.json();
      setLinks((currentLinks) => {
        return currentLinks.filter((l) => l.id !== deletedLink.id);
      });
    } catch (error) {
      console.error(error);
    }
    setShowEditModal(false);
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  const createURL = (url) => {
    if (url.startsWith("http")) {
      url = url.split("//");
    } else if (url.startsWith("www.")) {
      url = url.split("www.");
    } else {
      return (url = "https://" + url);
    }
    url = "https://" + url[1];
    return url;
  };

  const handleUpdate = async () => {
    const url = createURL(urlInput);
    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: titleInput,
          url,
        }),
      });
      const updatedLink = await response.json();
      updatedLink.comments = [];
      if (!tagsInput) {
        updatedLink.tags = [...tags];
      }
      setLinks((currentLinks) => {
        return currentLinks.map((l) => {
          if (l.id !== updatedLink.id) return l;
          return updatedLink;
        });
      });
      addTags();
      setTitleInput("");
      setUrlInput("");
      setTagsInput("");
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addTags = async () => {
    if (tagsInput) {
      let newTags = tagsInput.split(",");
      newTags = newTags.map((tag) => {
        let prettyTag = tag.trim();
        prettyTag = prettyTag.toLowerCase();
        console.log({prettyTag});
        prettyTag = prettyTag.charAt(0).toUpperCase() + prettyTag.slice(1);
        return prettyTag;
      });
      newTags = newTags.map(async (tag) => {
        try {
          const response = await fetch(`/api/tags/${link.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              tagName: tag,
            }),
          });
          const newTag = await response.json();
          link.tags.push(newTag);
          setLinks((currentLinks) => {
            return currentLinks.map((l) => {
              if (l.id !== link.id) return l;
              return link;
            });
          });
        } catch (error) {
          console.error(error);
        }
      });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <label for="title">Title</label>
      <input type="text" value={titleInput} onChange={titleHandler} required />
      <label for="url">URL</label>
      <input
        type="text"
        placeholder="Google.com"
        value={urlInput}
        onChange={urlHandler}
        required
      />
      <label for="tags">Tags (seperated by comma)</label>
      <input
        type="text"
        id="edit__tags__input"
        placeholder="Favorite, School, Entertainment"
        value={tagsInput}
        onChange={tagsHandler}
      />
      <div className="current__tags__container">
        {tags &&
          tags.map((tag) => (
            <Tag key={tag.id} tag={tag} link={link} setLinks={setLinks} />
          ))}
      </div>
      <div className="form__buttons">
        <button
          className="cancel__add__link button__small"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          id="delete__link"
          className="button__small"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button className="add__link button__small" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </form>
  );
};

export default EditLink;
