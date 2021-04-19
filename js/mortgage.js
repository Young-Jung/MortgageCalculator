 var paymentDS = {
     paymentsArray: [],
     summary: {}
 };

 // When the user clicks the button
 function buildPaymentSchedule() {
     // Validation first
     let amt = parseFloat(document.getElementById("newLoanAmt").value);
     let year = parseInt(document.getElementById("newPayPeriod").value);
     let rate = parseFloat(document.getElementById("newRate").value);

     if (isValidInput(amt, year, rate)) {
         paymentDS = getPayments(amt, (year * 12), rate);
         displayPart(paymentDS);
     }
 }

 function displayPart(paymentDS) {
     displayData(paymentDS.paymentsArray);
     displaySummary(paymentDS.summary);
 }

 function isValidInput(amt, year, rate) {

     if (isNaN(amt) || isNaN(year) || isNaN(rate) || amt <= 0 || year <= 0 || rate <= 0) {
         //alert("number needed!!!");
         swal(
             'Oops!',
             'You need to input <b style="color:red;">number</b> only!',
             'error'
         );
         return false;
     }

     return true;
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
         paymentDS.paymentsArray.push(obj);
     }
     paymentDS.summary.monthPayments = monthPayments;
     paymentDS.summary.totalPayments = amtLoaned;
     paymentDS.summary.totalInterest = totalInterest;
     paymentDS.summary.totalCost = amtLoaned + totalInterest;
     return paymentDS;
 }

 function displayData(curPayments) {
     const template = document.getElementById("Mortgage-Data-Template");
     const resultsBody = document.getElementById("mortgateResults");
     // Clear table first
     resultsBody.innerHTML = "";

     for (let i = 0; i < curPayments.length; i++) {
         const dataRow = document.importNode(template.content, true);
         dataRow.getElementById("month").textContent = curPayments[i].month;
         dataRow.getElementById("payment").textContent = (curPayments[i].payment).toFixed(2);
         dataRow.getElementById("principal").textContent = (curPayments[i].principal).toFixed(2);
         dataRow.getElementById("interest").textContent = (curPayments[i].interest).toFixed(2);
         dataRow.getElementById("totalInterest").textContent = (curPayments[i].totalInterest).toFixed(2);
         dataRow.getElementById("balance").textContent = Math.abs((curPayments[i].balance)).toFixed(2);

         // Add the row to the page
         resultsBody.appendChild(dataRow);
     }
 }

 function displaySummary(summary) {

     document.getElementById("monthlyPayment").innerHTML = displayTwoDigit(summary.monthPayments);
     document.getElementById("totalPrincipal").innerHTML = displayTwoDigit(summary.totalPayments);
     document.getElementById("totalInterest").innerHTML = displayTwoDigit(summary.totalInterest);
     document.getElementById("totalCost").innerHTML = displayTwoDigit(summary.totalCost);
 }

 function displayTwoDigit(amt) {
     return amt.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     });
 }