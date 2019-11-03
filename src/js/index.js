'use strict';

fetch('http://127.0.0.1:8080/src/jsonData.json')
.then((data) => {
  return data.json();
})
.catch((error) => {
  console.log(error.message);
})
.then((data) => {
  console.log(data);
})
