import React, { useState, useEffect } from "react";
import { Header, SideNav, LinkCard, Auth, AddLink, EditLink } from "./index";
import "../css/style.css";

const App = () => {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState("");
  const [linkToUpdate, setLinkToUpdate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // const [search, setSearch] = useState('');
  // const [searchOption, setSearchOption] = useState('')
  // const [sortOption, setSortOption] = useState('');

  const token = localStorage.getItem("token") || null;


  useEffect(() => {
    //use token to hit /me route and setUser
    try {
      async function fetchUser() {
        const response = await fetch("/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const user = await response.json();
        //check for error message
        if (user.error) return setUser(null);
        //if no error message set user info
        setUser(user);
      }
      fetchUser();
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const fetchLinks = async (id) => {
    try {
      const response = await fetch(`/api/links/${id}`);
      const links = await response.json();
      if (links.error) return setLinks(null);
      setLinks(links);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchLinks(user.id);
  }, [user]);

  return (
    <>
      <div className="App">
        {user ? (
          <>
            <Header user={user} setUser={setUser} />
            <SideNav
              setShowAddModal={setShowAddModal}
              links={links}
              setFilter={setFilter}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            <div className="cards">
              {filter
                ? filter.map((link) => {
                  return (
                    <LinkCard
                      key={link.id}
                      link={link}
                      setLinks={setLinks}
                      setShowEditModal={setShowEditModal}
                      setLinkToUpdate={setLinkToUpdate}
                    />
                  );
                })
                : links.filter(val => {
                  if (searchInput === "") {
                    return val;
                  } else if (val.title.toLowerCase().includes(searchInput.toLowerCase())) {
                    return val;
                  }
                }).map((link) => {
                  return (
                    <LinkCard
                      key={link.id}
                      link={link}
                      setLinks={setLinks}
                      setShowEditModal={setShowEditModal}
                      setLinkToUpdate={setLinkToUpdate}
                    />
                  );
                })}
            </div>
          </>
        ) : (
            <Auth setUser={setUser} />
          )}
      </div>
      {showAddModal && (
        <div className="modal">
          <AddLink
            links={links}
            setLinks={setLinks}
            setShowAddModal={setShowAddModal}
          />
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <EditLink
            link={linkToUpdate}
            setShowEditModal={setShowEditModal}
            setLinks={setLinks}
          />
        </div>
      )}
    </>
  );
};

export default App;
