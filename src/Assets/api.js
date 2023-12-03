import axios from "axios";

export const axiosPost = (url, action, id_name, id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          action: action,
          [id_name]: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
