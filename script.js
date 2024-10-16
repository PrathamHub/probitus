// Add event listeners for input fields
document
  .getElementById("PropertyValue")
  .addEventListener("input", updateValues);
document.getElementById("DownPayment").addEventListener("input", updateValues);
document.getElementById("EMIRate").addEventListener("input", updateValues);
document.getElementById("Tenure").addEventListener("input", updateValues);
document.getElementById("rent").addEventListener("input", updateSavings);
document
  .getElementById("expectedReturn")
  .addEventListener("input", updateFutureValues);
document
  .getElementById("rateOfAppreciation") // Add event listener for appreciation rate
  .addEventListener("input", updateFutureValues);

// Function to update values and recalculate EMI, Loan Amount, and Down Payment
function updateValues() {
  propertyValue =
    parseFloat(document.getElementById("PropertyValue").value) || 0;
  const downPaymentPercent =
    parseFloat(document.getElementById("DownPayment").value) || 0;
  const emiRate = parseFloat(document.getElementById("EMIRate").value) || 0;
  tenure = parseFloat(document.getElementById("Tenure").value) || 0;

  // Calculate Down Payment
  downPayment = (downPaymentPercent / 100) * propertyValue;
  document.getElementById("downPaymentValue").innerText =
    downPayment.toFixed(2);

  // Calculate Loan Amount
  const loanAmount = propertyValue - downPayment;
  document.getElementById("loanAmount").innerText = loanAmount.toFixed(2);

  // Calculate EMI
  emi = calculateEMI(emiRate, tenure, loanAmount);
  document.getElementById("emi").innerText = emi.toFixed(2);

  // Update savings based on EMI and rent
  updateSavings();
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
function updateSavings() {
  const monthlyRent = parseFloat(document.getElementById("rent").value) || 0;

  // Calculate savings (difference between EMI and rent), ensuring non-negative value
  savings = Math.max(emi - monthlyRent, 0);
  document.getElementById("savings").innerText = savings.toFixed(2);

  // Recalculate future values based on updated savings
  updateFutureValues();
}

// Function to update future values of savings and property
function updateFutureValues() {
  expectedReturn =
    parseFloat(document.getElementById("expectedReturn").value) / 100 || 0;

  // Calculate future values
  const futureValues = calculateFutureValue(
    tenure,
    savings,
    downPayment,
    expectedReturn
  );

  // Update UI with future values
  document.getElementById("FutureValue").innerText =
    futureValues.futureValueSavings.toFixed(2);
  document.getElementById("FutureValueOfProperty").innerText =
    futureValues.futureValueProperty.toFixed(2);
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

  // Assume a fixed rate of appreciation for property (modify as needed)
  appreciationRate =
    parseFloat(document.getElementById("rateOfAppreciation").value || 0) / 100; // Example: 5% annual appreciation
  const futureValueProperty =
    propertyValue * Math.pow(1 + appreciationRate, tenure);

  return {
    futureValueSavings,
    futureValueProperty,
  };
}

// Toggle the feedback modal
document.getElementById("feedback-btn").addEventListener("click", function () {
  document.getElementById("feedback-modal").style.display = "flex"; // Show modal
});

// Close feedback modal
document
  .getElementById("close-feedback")
  .addEventListener("click", function () {
    document.getElementById("feedback-modal").style.display = "none"; // Hide modal
  });

// Add event listeners to emojis for feedback selection
var emojis = document.querySelectorAll(".emoji");
emojis.forEach(function (emoji) {
  emoji.addEventListener("click", function () {
    alert("You selected: " + emoji.innerHTML); // Display selected emoji
    document.getElementById("feedback-modal").style.display = "none"; // Hide modal after selection
  });
});

// Close modal if clicked outside the popup
window.addEventListener("click", function (event) {
  var modal = document.getElementById("feedback-modal");
  if (event.target == modal) {
    modal.style.display = "none"; // Hide modal when clicking outside the popup
  }
});
// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const results = document.querySelectorAll(".result");
const main = document.querySelector(".main");
const inputs = document.querySelectorAll(".calculator input");

darkModeToggle.addEventListener("click", () => {
  // Toggle the dark-mode class on the body
  body.classList.toggle("dark-mode");

  // Toggle dark-mode for all result sections
  results.forEach((result) => result.classList.toggle("dark-mode"));

  // Toggle dark-mode for the main container and inputs
  main.classList.toggle("dark-mode");
  inputs.forEach((input) => input.classList.toggle("dark-mode"));

  // Change button text based on mode
  if (body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "Light Mode";
  } else {
    darkModeToggle.textContent = "Dark Mode";
  }
});
