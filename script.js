// Helper function to format numbers in Indian format
function formatIndianNumber(number) {
  if (!number) return "0"; // Handle empty or undefined values
  return Number(number).toLocaleString("en-IN", {
    maximumFractionDigits: 2, // Limit to two decimal places
  });
}

// Function to update values and recalculate EMI, Loan Amount, and Down Payment
function updateValues() {
  const propertyValue =
    parseFloat(
      document.getElementById("PropertyValue").value.replace(/,/g, "")
    ) || 0;
  const downPaymentPercent =
    parseFloat(
      document.getElementById("DownPayment").value.replace(/,/g, "")
    ) || 0;
  const emiRate =
    parseFloat(document.getElementById("EMIRate").value.replace(/,/g, "")) || 0;
  const tenure =
    parseFloat(document.getElementById("Tenure").value.replace(/,/g, "")) || 0;

  // Calculate Down Payment
  const downPayment = (downPaymentPercent / 100) * propertyValue;
  document.getElementById("downPaymentValue").innerText = formatIndianNumber(
    downPayment.toFixed(2)
  );

  // Calculate Loan Amount
  const loanAmount = propertyValue - downPayment;
  document.getElementById("loanAmount").innerText = formatIndianNumber(
    loanAmount.toFixed(2)
  );

  // Calculate EMI
  const emi = calculateEMI(emiRate, tenure, loanAmount);
  document.getElementById("emi").innerText = formatIndianNumber(emi.toFixed(2));

  // Update savings based on EMI and rent
  updateSavings(emi);
}

// Function to calculate EMI using loan amount, rate, and tenure
function calculateEMI(loanRate, tenureYears, loanAmount) {
  const monthlyRate = loanRate / 12 / 100; // Convert annual rate to monthly rate
  const tenureMonths = tenureYears * 12; // Convert years to months

  // EMI formula
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi || 0;
}

// Function to update savings based on EMI and monthly rent
function updateSavings(emi) {
  const monthlyRent =
    parseFloat(document.getElementById("rent").value.replace(/,/g, "")) || 0;

  // Calculate savings (difference between EMI and rent), ensuring non-negative value
  const savings = Math.max(emi - monthlyRent, 0);
  document.getElementById("savings").innerText = formatIndianNumber(
    savings.toFixed(2)
  );

  // Recalculate future values based on updated savings
  updateFutureValues(savings);
}

// Function to update future values of savings and property
function updateFutureValues(savings) {
  const tenure =
    parseFloat(document.getElementById("Tenure").value.replace(/,/g, "")) || 0;
  const expectedReturn =
    parseFloat(
      document.getElementById("expectedReturn").value.replace(/,/g, "")
    ) / 100 || 0;
  const downPayment =
    parseFloat(
      document.getElementById("downPaymentValue").innerText.replace(/,/g, "")
    ) || 0;

  // Calculate future values
  const futureValues = calculateFutureValue(
    tenure,
    savings,
    downPayment,
    expectedReturn
  );

  // Update UI with future values
  document.getElementById("FutureValue").innerText = formatIndianNumber(
    futureValues.futureValueSavings.toFixed(2)
  );
  document.getElementById("FutureValueOfProperty").innerText =
    formatIndianNumber(futureValues.futureValueProperty.toFixed(2));

  // Check outcome and update final result
  updateOutcome(futureValues);
}

// Function to calculate future values of savings and property
function calculateFutureValue(tenure, savings, downPayment, expectedReturn) {
  const months = 12;
  const totalMonths = tenure * months;

  // Future value of savings (compound interest formula for monthly contributions)
  const compoundFactor = Math.pow(1 + expectedReturn / months, totalMonths);
  const futureValueSavings =
    downPayment * compoundFactor +
    savings * ((compoundFactor - 1) / (expectedReturn / months));

  // Future value of property
  const appreciationRate =
    parseFloat(
      document.getElementById("rateOfAppreciation").value.replace(/,/g, "")
    ) / 100 || 0;
  const propertyValue =
    parseFloat(
      document.getElementById("PropertyValue").value.replace(/,/g, "")
    ) || 0;
  const futureValueProperty =
    propertyValue * Math.pow(1 + appreciationRate, tenure);

  return { futureValueSavings, futureValueProperty };
}

// Function to update outcome based on future values
function updateOutcome({ futureValueSavings, futureValueProperty }) {
  const finalResultElement = document.getElementById("finalResult");
  if (futureValueSavings > futureValueProperty) {
    finalResultElement.innerText = "Rent the house";
  } else {
    finalResultElement.innerText = "Buy the property";
  }
}

// Event listeners for input fields
document
  .getElementById("PropertyValue")
  .addEventListener("input", updateValues);
document.getElementById("DownPayment").addEventListener("input", updateValues);
document.getElementById("EMIRate").addEventListener("input", updateValues);
document.getElementById("Tenure").addEventListener("input", updateValues);
document.getElementById("rent").addEventListener("input", updateValues);
document
  .getElementById("expectedReturn")
  .addEventListener("input", updateValues);
document
  .getElementById("rateOfAppreciation")
  .addEventListener("input", updateValues);

// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  darkModeToggle.textContent = body.classList.contains("dark-mode")
    ? "Light Mode"
    : "Dark Mode";
});

// Feedback Modal Functionality
document.getElementById("feedback-btn").addEventListener("click", function () {
  document.getElementById("feedback-modal").style.display = "flex"; // Show modal
});
document
  .getElementById("close-feedback")
  .addEventListener("click", function () {
    document.getElementById("feedback-modal").style.display = "none"; // Hide modal
  });
document.querySelectorAll(".emoji").forEach(function (emoji) {
  emoji.addEventListener("click", function () {
    alert("You selected: " + emoji.innerHTML); // Show selected emoji
    document.getElementById("feedback-modal").style.display = "none"; // Hide modal
  });
});

// Contact Modal Functionality
document.getElementById("contact-btn").onclick = function () {
  document.getElementById("contact-modal").style.display = "block";
};
document.getElementById("close-contact").onclick = function () {
  document.getElementById("contact-modal").style.display = "none";
};
window.onclick = function (event) {
  if (event.target === document.getElementById("contact-modal")) {
    document.getElementById("contact-modal").style.display = "none";
  }
};
