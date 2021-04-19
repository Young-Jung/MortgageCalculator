 var curPayments = [];

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
         displaySummary(paymentsArray);
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

     return curPayments;
 }

 function displaySummary(curPayments) {
     let dispTotalPayments = curPayments[0].balance + curPayments[0].principal;
     let disPay = curPayments[0].month;
     let disTotalInt = curPayments[curPayments.length - 1].totalInterest;
     document.getElementById("monthlyPayment").innerHTML = disPay.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     });
     document.getElementById("totalPrincipal").innerHTML = dispTotalPayments.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     })
     document.getElementById("totalInterest").innerHTML = disTotalInt.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     })
     document.getElementById("totalCost").innerHTML = (dispTotalPayments + disTotalInt).toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
     })
 }

 function displayData(paymentsArray) {
     const template = document.getElementById("Mortgage-Data-Template");
     const resultsBody = document.getElementById("mortgateResults");
     // Clear table first
     resultsBody.innerHTML = "";

     //  if (curPayments.length == 0) {
     //      curPayments = paymentsArray;
     //  }

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