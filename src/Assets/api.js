import axios from "axios";

export const axiosPost = (
  url,
  action,
  postDataName,
  postData,
  answer = false
) => {
  const jwt = localStorage.getItem("jwt");

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
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/";
        } else {
          reject(error);
        }
      });
  });
};
