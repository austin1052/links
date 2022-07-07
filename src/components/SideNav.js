import React, { useState, useEffect } from "react";
import "../css/SideNav.css";
import { getToken } from "../utils";
import { AiOutlineClose } from "react-icons/ai";

// contains search bar with search button and all tags

const SideNav = ({ setShowAddModal, links, setFilter, searchInput, setSearchInput }) => {
  const [uniqueTags, setUniqueTags] = useState([]);
  const [selected, setSelected] = useState("");

  const token = getToken();

  useEffect(() => {
    fetchTags();
  }, [links]);

  const handleAddLink = () => {
    setShowAddModal(true);
  };

  const searchChangeHandler = (event) => {
    setSearchInput(event.target.value);
  };

  const handleClick = (event) => {
    const className = event.target.className;
    console.log({ className });
    if (className.includes("selected")) {
      setFilter("");
      setSelected("");
      return
    }
    const clickedTag = event.target.innerHTML;
    let filteredLinks = [];
    links.map((_link) => {
      _link.tags.map((_tag) => {
        if (_tag.tagName === clickedTag) {
          filteredLinks.push(_link);
        }
      });
    });
    setFilter(filteredLinks);
    setSelected(clickedTag);
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/tags`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const tags = await response.json();
      const tagNames = tags.map((tags) => tags.tagName);
      const unique = [...new Set(tagNames)];
      setUniqueTags(unique);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="side__nav">
      <div className="search__container">
        <div className="search__bar">
          <input
            type="text"
            className="search__input"
            // placeholder="Search"
            value={searchInput}
            onChange={searchChangeHandler}
            required
          />
          <button className="search__button">Search</button>
        </div>
      </div>
      <div className="nav__tags__container">
        {uniqueTags &&
          uniqueTags.map((tag, i) => {
            if (tag === selected) {
              return (
                <div key={i} className="nav__tag selected" onClick={handleClick}>
                  <div id="remove__filter" className="selected">+</div>

                  {tag}
                </div>
              );
            } else {
              return (
                <div key={i} className="nav__tag" onClick={handleClick}>
                  {tag}
                </div>
              );
            }
          })}
      </div>
      <button
        className="button__large"
        id="add__link__button"
        onClick={handleAddLink}
      >
        Add Link
      </button>
    </div>
  );
};

// onClick={() => {
//   let newLinks = [];
//   links.map((_link) => {
//     console.log({ _link });
//     if (_link.tags) {
//       _link.tags.map((_tag) => {
//         if (_tag.tagName === tag) {
//           console.log("RETURNED TRUE", _link);
//           newLinks.push(_link);
//         }
//       });
//     }
//   });
//   setLinks(newLinks);
// }}

// const SideNav = ({
//   search,
//   setSearch,
//   searchOption,
//   setSearchOption,
//   sortOption,
//   setSortOption,
//   links,
//   setLinks,
// }) => {
//   return (
//     <>
//       <div className="search-bar">
//         <div id="search">
//           <label htmlFor="keywords">Search by Term</label>
//           <input
//             id="keywords"
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(event) => {
//               setSearch(event.target.value);
//             }}
//           />
//           <select
//             className="search-select"
//             value={searchOption}
//             onChange={(event) => {
//               setSearchOption(event.target.value);
//             }}
//           >
//             [<option value="Links">Links</option>
//             <option value="Tags">Tags</option>]
//           </select>
//         </div>
//       </div>
//       <div className="sortByClicks">
//         <label>Sort By Click Count:</label>
//         <select
//           className="sort-select"
//           value={sortOption}
//           onChange={(event) => {
//             setSortOption(event.target.value);

//             if (event.target.value === "Highest") {
//               let sortedHighest = links.sort((a, b) =>
//                 a.clickcount > b.clickcount ? -1 : 1
//               );
//               setLinks(sortedHighest);
//             } else {
//               let sortedLowest = links.sort((a, b) =>
//                 a.clickcount > b.clickcount ? 1 : -1
//               );
//               setLinks(sortedLowest);
//             }
//           }}
//         >
//           [<option value="Highest">Highest</option>
//           <option value="Lowest">Lowest</option>]
//         </select>
//       </div>
//     </>
//   );
// };

export default SideNav;
