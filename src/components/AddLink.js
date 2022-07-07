import React, { useState } from "react";
import { getToken } from "../utils";

const AddLink = ({ links, setLinks, setShowAddModal }) => {
  const [titleInput, setTitleInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const token = getToken();

  const submitHandler = (event) => {
    event.preventDefault();
  };

  const titleHandler = (event) => {
    setTitleInput(event.target.value);
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

  const urlHandler = (event) => {
    setUrlInput(event.target.value);
  };

  const tagsHandler = (event) => {
    setTagsInput(event.target.value);
  };

  const handleCancel = () => {
    setShowAddModal(false);
  };

  const handleAdd = async () => {
    const url = createURL(urlInput);
    try {
      const response = await fetch(`/api/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: titleInput,
          url,
        }),
      });
      const link = await response.json();
      console.log({link});
      link.comments = [];
      const newLinks = [link, ...links];
      setLinks(newLinks);
      addTags(link);
      setTitleInput("");
      setUrlInput("");
      setTagsInput("");
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addTags = async (link) => {
    link.tags = [];
    if (tagsInput) {
      let newTags = tagsInput.split(",");
      newTags = newTags.map((tag) => {
        let prettyTag = tag.trim();
        prettyTag = prettyTag.toLowerCase();
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
    <>
      <form onSubmit={submitHandler}>
        <label for="title">Title</label>
        <input
          type="text"
          className="title"
          placeholder="Title"
          value={titleInput}
          onChange={titleHandler}
          required
        />
        <label for="url">URL</label>
        <input
          type="text"
          className="url"
          placeholder="Google.com"
          value={urlInput}
          onChange={urlHandler}
          required
        />
        <label for="tags">Tags (seperated by comma)</label>
        <input
          type="text"
          className="url"
          placeholder="Favorite, School, Entertainment"
          value={tagsInput}
          onChange={tagsHandler}
        />
        <div className="form__buttons">
          <button
            className="cancel__add__link button__small"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button className="add__link button__small" onClick={handleAdd}>
            Add
          </button>
        </div>
      </form>
    </>
  );
};

export default AddLink;
