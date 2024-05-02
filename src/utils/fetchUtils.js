// fetchUtils.js

export const checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  };
  
  export const json = (response) => response.json();
  