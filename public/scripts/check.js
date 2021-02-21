// import Card Credit Checker JS
const ccc = require("./ccc");
const $ = require("jquery");

function filter_array(test_array) {
  let index = -1;
  const arr_length = test_array ? test_array.length : 0;
  let resIndex = -1;
  const result = [];

  while (++index < arr_length) {
    const value = test_array[index];

    if (value) {
      result[++resIndex] = value;
    }
  }

  return result;
}

ccc.config({
  url: "http://localhost:3333/pay",
  method: "post",
  data: `{"card": "<CARD>","month": "<MONTH>","year": "<YEAR>","cvv": "<CVV>"}`,
  headers: { "Content-Type": "application/json" },
  keywords: {
    declined: "Declined",
    approved: "Approved"
  }
});

function start(CardList) {
  console.log("Check process started.");

  CardList.forEach((Card, Index) => {
    setTimeout(() => {
      let CardNumber = String(Card).split("|")[0];
      let CardMonth = String(Card).split("|")[1];
      let CardYear = String(Card).split("|")[2];
      let CardCVV = String(Card).split("|")[3];

      ccc
        .check(CardNumber, CardMonth, CardYear, CardCVV)
        .then(result => {
          if (result.error) {
            $("#results").append(
              `<div class="declined">
             <div class="cc">
               <i class="far fa-credit-card"></i> ${CardNumber} ${CardMonth}/${CardYear} ${CardCVV}
             </div>
             <div class="status">
               <strong>${result.error}</strong>
             </div>
           </div>`
            );
          } else if (result.approved) {
            $("#results").append(
              `<div class="approved">
              <div class="cc">
                <i class="far fa-credit-card"></i> ${CardNumber} ${CardMonth}/${CardYear} ${CardCVV}
              </div>
              <div class="status">
                <strong>Payment approved!</strong>
              </div>
            </div>`
            );
          } else if (result.declined) {
            $("#results").append(
              `<div class="declined">
             <div class="cc">
               <i class="far fa-credit-card"></i> ${CardNumber} ${CardMonth}/${CardYear} ${CardCVV}
             </div>
             <div class="status">
               <strong>Card was declined.</strong>
             </div>
           </div>`
            );
          }
        })
        .catch(result => {
          console.log("[ccc.js] Error: " + result);
        });
    }, Index * 2000);
  });
}

$(document).ready(function() {
  $("#start-button").click(function() {
    let CardList = $("#card-credit-list")
      .val()
      .replace("\r", "")
      .split("\n");
    CardList = filter_array(CardList);
    $("#results").fadeIn(1000);
    start(CardList).then(() => {
      alert("Finished!");
    });
  });
});
