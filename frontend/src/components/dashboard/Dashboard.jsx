import React, { useState, useEffect } from "react";
import "./dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import {
  PageLayout,
  Box,
  Heading,
  TextInput,
  Button,
  ActionList,
  Spinner,
  Text,
} from "@primer/react";
import {
  RepoIcon as RepositoryIcon,
  PlusIcon,
  TrashIcon,
} from "@primer/octicons-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/auth");
      return;
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repository/user/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setRepositories(data.repositories || []);
        } else if (response.status !== 404) {
          // Don't throw for 404, just means user has no repos
          throw new Error(`HTTP error! status: ${response.status}`);
        } // A 404 will result in an empty repository list, which is handled by the initial state.
      } catch (err) {
        setError("Could not fetch your repositories.");
        console.error("Error while fetching user repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repository/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    setIsLoading(false); // This should be inside the async functions to avoid race conditions
  }, [navigate]);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepositories = repositories.filter((repository) =>
        repository.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepositories);
    }
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
        // Remove the repository from the state to update the UI
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
      <PageLayout
        containerWidth="full"
        padding="none"
        className="dashboard-layout"
      >
        <PageLayout.Content>
          <Box p={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Heading as="h2" sx={{ fontSize: 3 }}>
                Your Repositories
              </Heading>
              <Button variant="primary" leadingVisual={PlusIcon}>
                New
              </Button>
            </Box>
            <TextInput
              sx={{ width: "100%", mb: 3 }}
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Box
              sx={{
                border: "1px solid",
                borderColor: "border.default",
                borderRadius: 2,
              }}
            >
              {isLoading ? (
                <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                  <Spinner />
                </Box>
              ) : error ? (
                <Text sx={{ p: 4, color: "danger.fg" }}>{error}</Text>
              ) : searchResults.length > 0 ? (
                <ActionList>
                  {searchResults.map((repository) => (
                    <ActionList.Item
                      key={repository._id}
                      variant="danger"
                      onClick={() => handleDelete(repository._id)}
                    >
                      <ActionList.LeadingVisual>
                        <RepositoryIcon />
                      </ActionList.LeadingVisual>
                      {repository.name}
                      <ActionList.TrailingVisual>
                        <TrashIcon />
                      </ActionList.TrailingVisual>
                    </ActionList.Item>
                  ))}
                </ActionList>
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Text>No repositories found.</Text>
                </Box>
              )}
            </Box>
          </Box>
        </PageLayout.Content>
        <PageLayout.Pane position="end">
          <Box p={4}>
            <Box mb={4}>
              <Heading as="h3" sx={{ fontSize: 2, mb: 2 }}>
                Suggested for you
              </Heading>
              {suggestedRepositories.length > 0 ? (
                suggestedRepositories.slice(0, 5).map((repository) => (
                  <Box key={repository._id} sx={{ mb: 2 }}>
                    <Text
                      as="p"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <RepositoryIcon
                        size={16}
                        style={{ marginRight: "8px" }}
                      />
                      {repository.name}
                    </Text>
                    <Text as="p" sx={{ fontSize: 1, color: "fg.muted" }}>
                      {repository.description}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text sx={{ color: "fg.muted" }}>
                  No suggestions right now.
                </Text>
              )}
            </Box>
            <Heading as="h3" sx={{ fontSize: 2, mb: 2 }}>
              Upcoming Events
            </Heading>
            <Text as="p" sx={{ fontSize: 1, color: "fg.muted" }}>
              No upcoming events.
            </Text>
          </Box>
        </PageLayout.Pane>
      </PageLayout>
    </>
  );
};

export default Dashboard;
