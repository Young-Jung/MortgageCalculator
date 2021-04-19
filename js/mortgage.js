 var fixedArray = [{
         month: 1,
         payment: 269.53,
         principal: 232.03,
         interest: 37.50,
         totalInterest: 37.50,
         balance: 14767.97,
     },
     {
         month: 2,
         payment: 269.53,
         principal: 232.61,
         interest: 36.92,
         totalInterest: 74.42,
         balance: 14535.36,
     },
 ];
 var curPayments = [];
 // // the default display is all events
 // var filteredEvents = eventsArray;

 // function buildDropDown() {
 //     var eventDD = document.getElementById("eventDropDown");

 //     let distinctEvents = [...new Set(eventsArray.map((ev) => ev.city))];

 //     let linkHTMLEnd =
 //         '<div class="dropdown-divider"></div><a class="dropdown-item" onclick="getEvents(this)" data-string="All" >All</a>';
 //     let resultHTML = "";

 //     for (let i = 0; i < distinctEvents.length; i++) {
 //         resultHTML += `<a class="dropdown-item" onclick="getEvents(this)" data-string="${distinctEvents[i]}">${distinctEvents[i]}</a>`;

 //     }
 //     resultHTML += linkHTMLEnd;
 //     eventDD.innerHTML = resultHTML;
 //     displayStats();
 //buildPaymentSchedule();

 // When the user clicks the button
 function buildPaymentSchedule() {
     // Validation first
     let amt = parseFloat(document.getElementById("newLoanAmt").value);
     let term = parseFloat(document.getElementById("newPayPeriod").value);
     let rate = parseFloat(document.getElementById("newRate").value);
     if (isNaN(amt) || isNaN(term) || isNaN(rate)) {
         //alert("number needed!!!");
         swal(
             'Oops!',
             'You need to input <b style="color:red;">number</b> only!',
             'error'
         );
     } else {
         // Get some values
         paymentsArray = getPayments(amt, term, rate);
         displayData(paymentsArray);

     }
 }


 function getPayments(amtLoaned, term, rate) {
     let monthPayments = (amtLoaned) * (rate / 1200) / (1 - (Math.pow((1 + rate / 1200), (-term))));

     //  Remaining Balance before the very first month equals the amount of the loan.
     let remainBalance = amtLoaned;
     let interestPay = 0;
     let totalInterest = 0;
     let principalPay = 0;

     for (let i = 1; i <= term; i++) {

         let obj = {};
         obj["month"] = i;
         obj["payment"] = monthPayments; // fixed
         interestPay = (remainBalance * (rate / 1200));
         principalPay = monthPayments - interestPay;
         obj["principal"] = principalPay;
         obj["interest"] = interestPay;
         totalInterest += interestPay;
         obj["totalInterest"] = totalInterest;
         remainBalance = remainBalance - principalPay;
         obj["balance"] = remainBalance;
         curPayments.push(obj);
     }

     displaySummary(monthPayments, amtLoaned, totalInterest);
     return curPayments;
 }

 function displaySummary(monthPayment, totalPay, totalInt) {
     document.getElementById("monthlyPayment").innerHTML = monthPayment.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     });
     document.getElementById("totalPrincipal").innerHTML = totalPay.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     })
     document.getElementById("totalInterest").innerHTML = totalInt.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     })
     document.getElementById("totalCost").innerHTML = (totalPay + totalInt).toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     })
 }

 function displayData(paymentsArray) {
     const template = document.getElementById("Mortgage-Data-Template");
     const resultsBody = document.getElementById("mortgateResults");
     // Clear table first
     resultsBody.innerHTML = "";
     //curEvents = JSON.parse(localStorage.getItem("paymentsArray")) || [];

     if (curPayments.length == 0) {
         curPayments = paymentsArray;
     }

     // same as importNode (can be outside this html)

     for (let i = 0; i < curPayments.length; i++) {
         const dataRow = document.importNode(template.content, true);
         dataRow.getElementById("month").textContent = curPayments[i].month;
         dataRow.getElementById("payment").textContent = (curPayments[i].payment).toFixed(2);
         dataRow.getElementById("principal").textContent = (curPayments[i].principal).toFixed(2);
         dataRow.getElementById("interest").textContent = (curPayments[i].interest).toFixed(2);
         dataRow.getElementById("totalInterest").textContent = (curPayments[i].totalInterest).toFixed(2);
         dataRow.getElementById("balance").textContent = (curPayments[i].balance).toFixed(2);

         // Add the row to the page
         resultsBody.appendChild(dataRow);
     }
 }