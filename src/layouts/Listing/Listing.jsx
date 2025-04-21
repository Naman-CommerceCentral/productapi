import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/Search";
import { useState } from "react";
import CSVButton from "../../components/CSVButton/CSVButton";
// import "../../../../backend/server/router/index.js"; // Adjust the import path as necessary



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function Listing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableHeaders, setTableHeaders] = useState([]);
  const pageSize = 10;


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// This function handles the search functionality for a single product based on the barcode input.



  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setProduct(null); // Clear previous product data

    try {
      const response = await fetch("/api/search", {//this is the router 
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

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// This function handles the CSV file upload and processes the data for display in a table.



  const handleCSVUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setProduct(null); // Clear previous product data
    setCsvData([]);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/fetch-products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract headers from the first item in the dataset
      if (data.products && data.products.length > 0) {
        setTableHeaders(Object.keys(data.products[0]));
        setCsvData(data.products);
        setTotalPages(Math.ceil(data.products.length / pageSize));
        setCurrentPage(1);
      } else {
        setCsvData([]);
        setTableHeaders([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error uploading CSV:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };



  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // This function handles pagination for the CSV data table.



  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return csvData.slice(startIndex, endIndex);
  };


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Render the component



  return (
    <div className="listing">
      <h1>Product Listing</h1>
      <div className="action-buttons">
        <SearchBar onSearch={handleSearch} />
        <CSVButton onFileUpload={handleCSVUpload} />
      </div>

      {isLoading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}

      {/* Single Product Table Display */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}

      {product && !isLoading && (
        <div className="product-table-container">
          <h2>Product Details</h2>
          <table className="product-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    width="100" 
                    height="100" 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------------ */}




      {/* Multiple Products Table Display from CSV */}
      {csvData.length > 0 && !isLoading && (
        <div className="products-table-container">
          <h2>Products from CSV</h2>


          {/* this is for the product table  */}

          <table className="products-table">
            <thead>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {tableHeaders.map((header, colIndex) => (
                    <td key={colIndex}>
                      {header.toLowerCase().includes('image') && item[header] ? (
                        <img 
                          src={item[header]} 
                          alt={item.title || 'Product'} 
                          width="80" 
                          height="80" 
                        />
                      ) : (
                        item[header]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>


                    {/* this is for the product table  */}



          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Listing;


// import react from "react";
// import Button from "../../components/Button/Button";










// function Listing(){
//   const [isloading,setIsLoading] = useState(false);
//   const [error,setError] = useState(null);
//   const [product,setProduct] = useState(null);
//   const [allUpcCodes,setAllUpcCodes] = useState([]);
//   const [products,setProducts] = useState([]);
//   const [currentPage,setCurrentPage] = useState(1);
//   const pageSize = 10;



//   const handleSearch = async(query) => {
//     setIsLoading(true);
//     setError(null);
//     setProduct(null);

//     try{
//       const response = await fetch("/api/search" , {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({barcode:query}),
//       });

//       if(!response.ok){
//         console.error("Error:", response.statusText);
//         throw new Error(`Error:  ${respomse.staus} -  ${response.statusText}`)
//       }

//       const data = await response.json();
//       if(!data.image || !data.price){
//         throw new Error("Invalid product data received from the server.");
//       }
//       setProduct(data);
//     }
//     catch(err){
//       console.log("error during search :",err.message);
//       setError(err.message)
//     }
//     finally{
//       setIsLoading(false);
//     }
//   }




//   const handleCSVUpload = async(file) => {
//     setIsLoading(teur);
//     setError(null);
//     setProduct(null);
//     setCsvData([]);

//     try{
//       const formData = new FormData();
//       formData.append("csvFile",file);

//       const response = await fetch("/api/csvupload",{
//         method:"POST",
//         body: formData,
//       });

//       if(!response.ok){
//         console.log("Error:",response.status)
//       }

//       const data = await response.json();

//       if(data.products && data.products.length>0){
//         setTableHeaders(Object.keys(data.products[0]))
//       }
//     }
//   }