import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/Search";
import { useState } from "react";

function Listing() {
  const [isLoading, setIsLoading] = useState(false);//use state from react to manage loading state
  const [error, setError] = useState(null);//usestate from react to manage error state
  const [product, setProduct] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setProduct(null); // Clear previous product data

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barcode: query }),
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.description || !data.price) {
        throw new Error("Invalid product data received from the server.");
      }
      setProduct(data);
    } catch (err) {
      console.error("Error during search:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="listing">
      <h1>Product Listing</h1>
      <SearchBar onSearch={handleSearch} />
      <Button onClick={() => alert("Button clicked!")}>Add Product</Button>

      {isLoading && <p>Loading product information...</p>}
      {error && <p className="error">Error: {error}</p>}

      {product && !isLoading && (
        <div className="product-details">
          <h2>Product Details</h2>
          <p>
            <strong>Title:</strong> {product.title}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> {product.price}
          </p>
          <p>
            <string>Image:</string>
            <img src={product.image} alt={product.title} width="200" height="200" />
          </p>
        </div>
      )}
    </div>
  );
}

export default Listing;
