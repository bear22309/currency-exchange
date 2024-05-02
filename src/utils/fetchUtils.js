// fetchUtils.js

// Utility function to check the status of a fetch response
export const checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  };
  
  // Utility function to parse JSON response
  export const json = (response) => response.json();
  
  