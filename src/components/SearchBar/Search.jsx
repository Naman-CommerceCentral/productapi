import styles from "./SearchBar.module.css";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please enter a valid barcode.");
      return;
    }
    try {
      onSearch(query.trim()); // Ensure query is trimmed before sending
    } catch (error) {
      console.error("Error in onSearch callback:", error.message);
    }
  };

  return (
    <div className={styles["search-bar"]}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter product barcode"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
