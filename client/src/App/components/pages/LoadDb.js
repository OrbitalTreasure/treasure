import { useState } from "react";
const axios = require("axios");

const LoadDb = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [headers, setHeaders] = useState();

  function csvToArray(str, delimiter = ",") {
    var out = [];
    const rows = str.split("\r\n");
    const headers = rows[0].split(delimiter);
    for (var i = 1; i < rows.length - 1; i++) {
      const value = rows[i].split(delimiter);
      var obj = {};
      for (var header = 0; header < headers.length; header++) {
        const currValue = value[header];
        if (currValue) {
          obj[headers[header]] = value[header];
        }
      }
      out.push(obj);
    }
    return [out, headers];
  }

  const parseFile = (e) => {
    const file = e.target.files[0];
    file
      .text()
      .then((e) => {
        const [parsedFile, currHeaders] = csvToArray(e);
        setSelectedFile(parsedFile);
        setHeaders(currHeaders);
      })
      .catch((e) => console.log(e));
  };

  const generateHtmlTable = () => {
    if (headers && selectedFile) {
      return (
        <table style={{ marginLeft: "auto", marginRight: "auto" }}>
          <tr>
            {headers.map((e) => (
              <th>{e}</th>
            ))}
          </tr>
          {selectedFile.map((object) => (
            <tr>
              {headers.map((header) => (
                <td>{object[header]}</td>
              ))}
            </tr>
          ))}
        </table>
      );
    }
    return "";
  };

  const generateConfirmation = () => {
    if (!selectedFile) {
      return "";
    } else {
      return (
        <div>
          <input type="button" value="Add Data to Database" onClick={addData} />
          {generateHtmlTable()}
        </div>
      );
    }
  };

  const addData = () => {
    axios
      .post("/api/v1/users", selectedFile)
      .then((e) => {
        if (e.status === 200) {
          console.log("Successfully loaded data");
        }
      })
      .catch((e) => console.log(e));
    window.location.reload();
    return false;
  };

  return (
    <div>
      <h1>Click the button to upload a CSV file</h1>
      <input type="file" accept=".csv" onChange={parseFile} />
      {generateConfirmation()}
    </div>
  );
};

export default LoadDb;
