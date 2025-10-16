import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar.jsx";
import { Spinner } from "@primer/react";
import { RepoIcon, PlusIcon, TrashIcon } from "@primer/octicons-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/auth");
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchDashboardData = async () => {
      try {
        const [reposResponse, suggestedResponse] = await Promise.all([
          axios.get(`http://localhost:3000/repository/user/${userId}`, {
            signal,
          }),
          axios.get(`http://localhost:3000/repository/all`, { signal }),
        ]);

        setRepositories(reposResponse.data.repositories || []);
        setSuggestedRepositories(suggestedResponse.data || []);
      } catch (err) {
        if (axios.isCancel(err)) return;

        if (err.response?.status === 404) {
          setRepositories([]); // User has no repositories, not an error
        } else {
          setError("Could not fetch your repositories.");
          console.error("Error while fetching dashboard data: ", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => abortController.abort();
  }, [navigate]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return repositories;
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, repositories]);

  const handleDelete = async (repositoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this repository? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/repository/${repositoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRepositories(
          repositories.filter((repo) => repo._id !== repositoryId)
        );
      } catch (err) {
        setError("Failed to delete repository.");
        console.error("Error while deleting repository: ", err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Repositories</h2>
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  <PlusIcon />
                  New
                </button>
              </div>

              <input
                type="text"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="bg-gray-800 border border-gray-700 rounded-lg">
                {isLoading ? (
                  <div className="p-8 flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : error ? (
                  <div className="p-4 text-red-400">{error}</div>
                ) : searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((repository, index) => (
                      <li
                        key={repository._id}
                        className={`flex items-center justify-between p-4 ${
                          index < searchResults.length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RepoIcon className="text-gray-400" />
                          <span className="font-medium">{repository.name}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(repository._id)}
                          className="p-2 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          aria-label={`Delete ${repository.name}`}
                        >
                          <TrashIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    No repositories found.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Suggested for you
                </h3>
                {suggestedRepositories.length > 0 ? (
                  <ul className="space-y-4">
                    {suggestedRepositories.slice(0, 5).map((repository) => (
                      <li key={repository._id}>
                        <div className="flex items-center gap-2 font-semibold">
                          <RepoIcon className="text-gray-400" />
                          {repository.name}
                        </div>
                        <p className="text-sm text-gray-400 mt-1 ml-6">
                          {repository.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No suggestions right now.</p>
                )}
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                <p className="text-gray-400">No upcoming events.</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
