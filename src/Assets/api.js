import axios from "axios";

export const axiosPost = (
  url,
  action,
  postDataName,
  postData,
  answer = false
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          action: action,
          [postDataName]: postData,
          answer: answer,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
