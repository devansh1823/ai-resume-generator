// Resume data storage
let resumeData = {
  personalDetails: {},
  employmentHistory: [],
  education: [],
  skills: [],
};

// Form navigation
const forms = {
  details: document.querySelector(".details"),
  employment: document.querySelector(".employment"),
  education: document.querySelector(".education"),
  skills: document.querySelector(".skills"),
};

// Skill level labels
const skillLevels = {
  1: "Novice",
  2: "Beginner",
  3: "Skillful",
  4: "Experienced",
  5: "Expert",
};

// Initialize the application
function initApp() {
  // Show only the first form initially
  showForm("details");
  setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
  // Personal Details Form - Next button
  document
    .querySelector(".details .btn")
    .addEventListener("click", handlePersonalDetails);

  // Employment History Form - Next button
  document
    .querySelector(".employment .btn2")
    .addEventListener("click", handleEmployment);

  // Education Form - Back button
  document
    .querySelector(".education .back")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showForm("employment");
    });

  // Education Form - Add More button
  document
    .querySelector(".education .add")
    .addEventListener("click", handleEducationAdd);

  // Education Form - Next button
  document
    .querySelectorAll(".education .btn")[2]
    .addEventListener("click", handleEducationNext);

  // Skills Form - Back button
  document
    .querySelector(".skills .back")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showForm("education");
    });

  // Skills Form - Add More button
  document
    .querySelector(".skills .add")
    .addEventListener("click", handleSkillAdd);

  // Skills Form - Generate Resume button
  document
    .querySelectorAll(".skills .btn")[2]
    .addEventListener("click", handleGenerateResume);

  // Setup skill boxes
  setupSkillBoxes();
}

// Personal Details Form Handler
function handlePersonalDetails(e) {
  e.preventDefault();

  // Collect personal details
  resumeData.personalDetails = {
    firstName: document.querySelector(
      '.details input[placeholder="First Name"]'
    ).value,
    lastName: document.querySelector('.details input[placeholder="Last Name"]')
      .value,
    email: document.querySelector('.details input[placeholder="Email Id"]')
      .value,
    contact: document.querySelector(
      '.details input[placeholder="Contact Number"]'
    ).value,
    address: document.querySelector(".details .address").value,
    cityState: document.querySelector(
      '.details input[placeholder="City/state"]'
    ).value,
    country: document.querySelector('.details input[placeholder="Country"]')
      .value,
  };

  // Validate required fields
  if (
    !resumeData.personalDetails.firstName ||
    !resumeData.personalDetails.email
  ) {
    alert("Please fill in required fields (First Name and Email)");
    return;
  }

  // Navigate to employment form
  showForm("employment");
}

// Employment History Form Handler
function handleEmployment(e) {
  e.preventDefault();

  // Collect employment data
  const employment = {
    jobTitle: document.querySelector(
      '.employment input[placeholder="Job Title"]'
    ).value,
    employer: document.querySelector(
      '.employment input[placeholder="Employer"]'
    ).value,
    startDate: document.querySelector(".employment .start input").value,
    endDate: document.querySelector(".employment .end input").value,
    city: document.querySelector('.employment input[placeholder="City"]').value,
    description: document.querySelector(".employment .desc").value,
  };

  // Validate required fields
  if (!employment.jobTitle || !employment.employer) {
    alert("Please fill in required fields (Job Title and Employer)");
    return;
  }

  resumeData.employmentHistory.push(employment);

  // Navigate to education form
  showForm("education");
}

// Education Form - Add More Handler
function handleEducationAdd(e) {
  e.preventDefault();

  // Collect education data
  const education = {
    institution: document.querySelector(
      '.education input[placeholder="Institution (School / College)"]'
    ).value,
    degree: document.querySelector('.education input[placeholder="Degree"]')
      .value,
    year: document.querySelector('.education input[type="month"]').value,
    city: document.querySelector('.education input[placeholder="City"]').value,
    description: document.querySelector(".education .desc").value,
  };

  if (education.institution && education.degree) {
    resumeData.education.push(education);
    clearEducationForm();
    alert("Education added! You can add more or click Next.");
  } else {
    alert("Please fill Institution and Degree fields");
  }
}

// Education Form - Next Handler
function handleEducationNext(e) {
  e.preventDefault();

  // Collect current education data if filled
  const education = {
    institution: document.querySelector(
      '.education input[placeholder="Institution (School / College)"]'
    ).value,
    degree: document.querySelector('.education input[placeholder="Degree"]')
      .value,
    year: document.querySelector('.education input[type="month"]').value,
    city: document.querySelector('.education input[placeholder="City"]').value,
    description: document.querySelector(".education .desc").value,
  };

  // Add current education if filled
  if (education.institution && education.degree) {
    resumeData.education.push(education);
  }

  if (resumeData.education.length === 0) {
    alert("Please add at least one education entry");
    return;
  }

  showForm("skills");
}

// Skills Form - Add More Handler
function handleSkillAdd(e) {
  e.preventDefault();

  const skillText = document.querySelector(".skills .skill").value;
  const skillLevel = currentSkillLevel;

  if (skillText && skillLevel > 0) {
    resumeData.skills.push({
      skill: skillText,
      level: skillLevel,
      levelText: skillLevels[skillLevel],
    });
    document.querySelector(".skills .skill").value = "";
    resetSkillBoxes();
    alert("Skill added!");
  } else {
    alert("Please enter a skill and select a proficiency level");
  }
}

// Generate Resume Handler
function handleGenerateResume(e) {
  e.preventDefault();

  // Add current skill if filled
  const skillText = document.querySelector(".skills .skill").value;
  if (skillText && currentSkillLevel > 0) {
    resumeData.skills.push({
      skill: skillText,
      level: currentSkillLevel,
      levelText: skillLevels[currentSkillLevel],
    });
  }

  if (resumeData.skills.length === 0) {
    alert("Please add at least one skill");
    return;
  }

  generateResumePDF();
}

// Skills Rating System
let currentSkillLevel = 0;

function setupSkillBoxes() {
  const skillBoxes = document.querySelectorAll(".skills .box");
  const skillLevelText = document.getElementById("skillLevelText");

  // Add CSS transitions for smooth color changes
  skillBoxes.forEach((box) => {
    box.style.transition = "all 0.3s ease";
  });

  skillBoxes.forEach((box, index) => {
    const level = parseInt(box.getAttribute("data-level"));

    // Click event
    box.addEventListener("click", function () {
      currentSkillLevel = level;
      updateSkillBoxes();
      updateSkillLevelText();
    });

    // Hover event - change text and highlight boxes
    box.addEventListener("mouseenter", function () {
      skillLevelText.textContent = skillLevels[level];
      skillLevelText.style.color = "#015aff";
      highlightBoxesUpTo(level);
    });

    // Mouse leave event - revert to selected level
    box.addEventListener("mouseleave", function () {
      skillLevelText.style.color = "";
      updateSkillLevelText();
      updateSkillBoxes();
    });
  });

  function updateSkillBoxes() {
    skillBoxes.forEach((box, index) => {
      const level = parseInt(box.getAttribute("data-level"));
      if (level <= currentSkillLevel) {
        box.style.backgroundColor = "#015aff";
        box.style.borderColor = "#015aff";
        box.style.transform = "scale(1)";
      } else {
        box.style.backgroundColor = "";
        box.style.borderColor = "#a5b1c2";
        box.style.transform = "scale(1)";
      }
    });
  }

  function highlightBoxesUpTo(level) {
    skillBoxes.forEach((box, index) => {
      const boxLevel = parseInt(box.getAttribute("data-level"));
      if (boxLevel <= level) {
        box.style.backgroundColor = "#4d8aff";
        box.style.borderColor = "#4d8aff";
        box.style.transform = "scale(1.05)";
      } else {
        box.style.backgroundColor = "";
        box.style.borderColor = "#a5b1c2";
        box.style.transform = "scale(1)";
      }
    });
  }

  function updateSkillLevelText() {
    if (currentSkillLevel > 0) {
      skillLevelText.textContent = skillLevels[currentSkillLevel];
      skillLevelText.style.fontWeight = "bold";
    } else {
      skillLevelText.textContent = "Select Level";
      skillLevelText.style.fontWeight = "normal";
    }
  }

  function resetSkillBoxes() {
    currentSkillLevel = 0;
    updateSkillBoxes();
    updateSkillLevelText();
  }
}

// Form Navigation Function
function showForm(formName) {
  // Hide all forms
  Object.values(forms).forEach((form) => {
    if (form) form.style.display = "none";
  });

  // Show the requested form
  if (forms[formName]) {
    forms[formName].style.display = "block";
  }
}

// Clear Education Form
function clearEducationForm() {
  const inputs = [
    '.education input[placeholder="Institution (School / College)"]',
    '.education input[placeholder="Degree"]',
    '.education input[type="month"]',
    '.education input[placeholder="City"]',
    ".education .desc",
  ];

  inputs.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) element.value = "";
  });
}

// Generate PDF Resume
function generateResumePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set initial y position
  let yPosition = 20;

  // Add header with blue background
  doc.setFillColor(1, 90, 255);
  doc.rect(0, 0, 210, 40, "F");

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${resumeData.personalDetails.firstName} ${resumeData.personalDetails.lastName}`,
    105,
    20,
    { align: "center" }
  );

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(resumeData.personalDetails.email, 105, 28, { align: "center" });
  doc.text(
    `${resumeData.personalDetails.contact} | ${resumeData.personalDetails.address}`,
    105,
    34,
    { align: "center" }
  );

  yPosition = 50;

  // Reset text color for content
  doc.setTextColor(0, 0, 0);

  // Employment History
  if (resumeData.employmentHistory.length > 0) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYMENT HISTORY", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    resumeData.employmentHistory.forEach((job) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(job.jobTitle, 15, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${job.employer} | ${job.city}`, 15, yPosition + 5);
      doc.text(
        `${formatDate(job.startDate)} - ${formatDate(job.endDate)}`,
        150,
        yPosition + 5
      );
      yPosition += 10;

      if (job.description) {
        const descLines = doc.splitTextToSize(job.description, 180);
        doc.text(descLines, 15, yPosition);
        yPosition += descLines.length * 5 + 5;
      }
      yPosition += 5;
    });
  }

  // Education
  if (resumeData.education.length > 0) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("EDUCATION", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    resumeData.education.forEach((edu) => {
      doc.setFont("helvetica", "bold");
      doc.text(edu.institution, 15, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${edu.degree} | ${edu.city}`, 15, yPosition + 5);
      doc.text(formatDate(edu.year), 150, yPosition + 5);
      yPosition += 10;

      if (edu.description) {
        const descLines = doc.splitTextToSize(edu.description, 180);
        doc.text(descLines, 15, yPosition);
        yPosition += descLines.length * 5 + 5;
      }
      yPosition += 5;
    });
  }

  // Skills
  if (resumeData.skills.length > 0) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const skillsPerColumn = Math.ceil(resumeData.skills.length / 2);
    const column1Skills = resumeData.skills.slice(0, skillsPerColumn);
    const column2Skills = resumeData.skills.slice(skillsPerColumn);

    let currentY = yPosition;

    // First column
    column1Skills.forEach((skill) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 30;
      }

      const skillText = `• ${skill.skill}`;
      doc.text(skillText, 15, currentY);

      const proficiency = getProficiencyIndicator(skill.level);
      doc.setFont("helvetica", "bold");
      doc.text(proficiency, 80, currentY);
      doc.setFont("helvetica", "normal");

      currentY += 6;
    });

    // Second column
    currentY = yPosition;
    column2Skills.forEach((skill) => {
      if (currentY > 270) return;

      const skillText = `• ${skill.skill}`;
      doc.text(skillText, 110, currentY);

      const proficiency = getProficiencyIndicator(skill.level);
      doc.setFont("helvetica", "bold");
      doc.text(proficiency, 175, currentY);
      doc.setFont("helvetica", "normal");

      currentY += 6;
    });

    yPosition = Math.max(yPosition + skillsPerColumn * 6 + 10, currentY + 10);

    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Proficiency Levels:", 15, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      "● Novice ●● Beginner ●●● Skillful ●●●● Experienced ●●●●● Expert",
      15,
      yPosition + 5
    );
  }

  // Save the PDF
  const fileName = `Resume_${resumeData.personalDetails.firstName}_${resumeData.personalDetails.lastName}.pdf`;
  doc.save(fileName);

  alert("Professional Resume PDF generated successfully!");
}

// Helper function to create proficiency indicators
function getProficiencyIndicator(level) {
  switch (level) {
    case 1:
      return "●";
    case 2:
      return "●●";
    case 3:
      return "●●●";
    case 4:
      return "●●●●";
    case 5:
      return "●●●●●";
    default:
      return "●";
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return "Present";
  const date = new Date(dateString + "-01");
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", function () {
  initApp();
});
