import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import LogoutButton from "./LogoutButton";
import RepositoryList from "./RepositoryList";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/userProfile/${userId}`
          );
          setUserDetails(response.data);
          console.log(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen">
        <Navbar />
        <UnderlineNav
          aria-label="Repository"
          className="px-4 sm:px-6 lg:px-8 ml-8 mr-8"
        >
          <UnderlineNav.Item
            aria-current="page"
            icon={BookIcon}
            sx={{
              backgroundColor: "transparent",
              color: "white",
              "&:hover": {
                textDecoration: "underline",
                color: "white",
              },
            }}
          >
            Overview
          </UnderlineNav.Item>

          <UnderlineNav.Item
            onClick={() => navigate("/repo")}
            icon={RepoIcon}
            sx={{
              backgroundColor: "transparent",
              color: "whitesmoke",
              "&:hover": {
                textDecoration: "underline",
                color: "white",
              },
            }}
          >
            Starred Repositories
          </UnderlineNav.Item>
        </UnderlineNav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <aside className="md:col-span-1 space-y-4">
              <div className="w-38 h-38 bg-gray-700 rounded-full mx-auto"></div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">{userDetails.username}</h3>
              </div>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                Follow
              </button>
              <div className="flex justify-center gap-4 text-gray-400">
                <p>
                  <span className="font-bold text-white">10</span> Follower
                </p>
                <p>
                  <span className="font-bold text-white">
                    {userDetails.followedUsers}
                  </span>{" "}
                  Following
                </p>
              </div>
              <LogoutButton />
            </aside>

            {/* Main Content */}
            <div className="md:w-12/6">
              <RepositoryList />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
