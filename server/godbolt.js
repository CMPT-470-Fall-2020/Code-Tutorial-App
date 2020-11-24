const axios = require("axios");

// List of compilers.
const compilers = { python: "python38" };

// Retrieve a list of compilers.
function getAvailableCompilers() {
  axios
    .get("https://godbolt.org/api/compilers")
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function unifyGodboltOutput(output, callback) {
  outputStr = "";
  output.forEach((val) => {
    outputStr += val["text"];
    outputStr += "\n";
  });
  callback(outputStr);
}

function getBytecode(lang, code, succCallback, errCalback) {
  compilerId = compilers[lang];
  console.log(compilerId);
  if (compilerId === undefined) {
    errCalback(
      "This language either does not exist or is not supported by GodBolt!"
    );
    return;
  }

  axios
    .post(
      `https://godbolt.org/api/compiler/${compilerId}/compile`,
      JSON.stringify({
        source: code,
        lang: lang,
      })
    )
    .then(function (response) {
      unifyGodboltOutput(response.data["asm"], succCallback);
    })
    .catch(function (error) {
      errCalback(
        "Sending your request to GodBolt had an issue with status code and error message: " +
          error.response.status +
          " " +
          error.response.statusText
      );
    });
}

module.exports = { getBytecode: getBytecode };
