import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const RepositoryList = ({ username }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if username is not provided
    if (!username) {
      setRepositories([]);
      return;
    }

    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/repository/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        setError(err.message);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]); // Re-run the effect when the username prop changes

  if (loading) {
    return <div>Loading repositories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!username) {
    return <div>Please provide a GitHub username.</div>;
  }

  if (repositories.length === 0) {
    return <div>No public repositories found for {username}.</div>;
  }

  return (
    <div>
      <h2>Repositories for {username}</h2>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

RepositoryList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RepositoryList;
