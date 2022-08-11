import ReactDOM from "react-dom";

export const unmountCompenentById = (id) => {
  console.log(id);
  ReactDOM.unmountComponentAtNode(document.getElementById(id));
};
