// components/CSVButton/CSVButton.js
import React, { useState } from 'react';//this is the import statement for React and useState hook
import styles from './CSVButton.module.css';

function CSVButton({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(e) {//this is for handlingh  file change element 
    const file = e.target.files[0];//here se we store the file in the file variable
    if (file) {
      setSelectedFile(file);//selected file is set to the file we have selected
      if (onFileUpload) {//if the above condition store the value if by any chance the user again click on the file input then it will again set the value to the file
        onFileUpload(file);
      }
    }
  }

  async function handleUpload() {//this is the function that is used to handle the upload of the file
    if (!selectedFile) {//if no file selected
      alert('Please select a CSV file first');//this ia an error
      return;
    }

    const formData = new FormData();//we create a new form data object
    formData.append('csvFile', selectedFile);//append the file to the form data object
    //the formdata object is used to send the file to the server
    //the formadata is basicaaly a key value pair object

    try {
      const response = await fetch('/api/csvfile', {//we are using the fetch API to send the file to the server thisis for the backend
        method: 'POST',//this is the post request
        body: formData,//this is the body of the request
      });

      if (!response.ok) {//is response is not ok then we are going to throw an error
        throw new Error(`Error: ${response.status}`);//this is an error
      }

      const result = await response.json();//here we are store the result in json format
      alert('File uploaded successfully!');//alert
      setSelectedFile(null);//again set it to null so that the next time the user click on the file input it will again set the value tto the file
    } catch (error) {//this is the catch block to handle the error
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');//it's an alert
    }
  }

  return (
    <div className={styles.csvButtonContainer}>
      <input 
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        id="csvFileInput"
        className={styles.fileInput}
      />{/**this is the input the file we upload earlies  */}
      <label htmlFor="csvFileInput" className={styles.csvButton}>
        {selectedFile ? selectedFile.name : 'Choose CSV File'}{/**this is the label if we select the file then show it's name else show Choose CSV FILES */}
      </label>
      {selectedFile && (
        <button onClick={handleUpload} className={styles.uploadButton}>
          Upload
        </button>//THIS SI THE BUTTON THAT IS USED TO UPLOAD THE FILE
      )}
    </div>
  );
}

export default CSVButton;



// import react from "react";
// import styles from"./CSVButton.module.css";

// function CSEVButton({onFileUpload}) {

//     const [selectedFile,setSelectedFile] = useState(null);

//     function handleFileChange(e){
//         const file = e.target.files[0];
//         if(file) {
//             selectedFile(file)
//             if(onF1leUpload) {
//                 onFileUpload(file);
//             }
//         }
//     }

//     async function handleUpload(){
//         if(!selectedFile){
//             alert("please upload the file first");
//             return;
//         }

//         const formDate = new FormData();
//         formdata.appen("csvfile",selectedFile);

//         try{
//             const response = await fetch("/api/fetch",{
//                 method: 'POST',
//                 body: formData,
//             });
//             if(!response.ok){
//                 throw new Error(`Error: ${response.status}`);
//             }
//             const result  = await response.json();
//             alert("File uploaded successfully!");
//             setSelectedFile(null);
//         }
//     }
// }