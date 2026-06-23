const state = {
    data: null,
    selectedDepartment: null
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadData();

    renderStats();
    renderDepartments();
    renderLabs();
    renderUpcominglabs();
}

async function loadData() {
    const response = await fetch("./data/data.json");
    state.data = await response.json();
}

function renderStats() {

    const container =
        document.getElementById("statsContainer");

    const totalDepartments =
        state.data.departments.length;

    const totalLabs =
        state.data.departments.reduce(
            (sum, dept) => sum + dept.labs.length,
            0
        );

    const totalExperiments =
        state.data.departments.reduce(
            (sum, dept) =>
                sum +
                dept.labs.reduce(
                    (s, lab) => s + lab.experiments.length,
                    0
                ),
            0
        );

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">🏬</div>
            <h2>${totalDepartments}</h2>
            <p>Departments</p>
        </div>

        <div class="stat-card">
            <div class="stat-icon">⚗️</div>
            <h2>${totalLabs}</h2>
            <p>Labs</p>
        </div>

        <div class="stat-card">
            <div class="stat-icon">🔬</div>
            <h2>180+</h2>
            <p>Experiments</p>
        </div>
        <div class="stat-card">
            <div class="stat-icon">🚀</div>
            <h2>${state.data.summary.upcomingLabs}</h2>
            <p>Upcoming</p>
        </div>
    `;
}

function renderDepartments() {

    const container =
        document.getElementById("departmentList");

    container.innerHTML = "";

    state.data.departments.forEach(department => {

        const btn =
            document.createElement("button");

        btn.innerHTML = `
            <span>
                ${department.icon}
                ${department.name}
            </span>

            <span>
                ${department.labs.length}
            </span>
        `;

        btn.addEventListener(
            "click",
            () => {

                state.selectedDepartment =
                    department.id;

                renderLabs();

                document.getElementById(
                    "currentDepartment"
                ).textContent =
                    department.name;

            }
        );

        container.appendChild(btn);

    });

}


function renderLabs() {

    const container =
        document.getElementById("labList");

    container.innerHTML = "";

    let departments =
        state.data.departments;

    if (state.selectedDepartment) {

        departments =
            departments.filter(
                d => d.id === state.selectedDepartment
            );

    }

    departments.forEach((department) => {
  department.labs.forEach((lab) => {
    const details = document.createElement("details");
    details.className = "lab-card";

    details.innerHTML = `
    details.setAttribute("open", "");
    <summary>
    <div>
    <h2>🎯 ${lab.name}</h2>
    
          <small>${department.name} • ${lab.experiments.length} Experiments <span class="status hosted">Hosted</span></small>
        </div>

<a
  href="${lab.url}"
  target="_blank"
  onclick="event.stopPropagation()"
>
  Open Lab
</a>      </summary>

       <ul class="experiment-list">
        ${lab.experiments
          .map(
            (exp) => `
              <li class="experiment-item">
                <div class="experiment-info">
                  <span class="experiment-icon">⚗️</span>

                  <span class="experiment-name">
                    ${exp.name}
                  </span>
                </div>

                <a
                  href="${exp.url}"
                  class="experiment-btn"
                  target="_blank"
                >
                  Open →
                </a>
              </li>
            `
          )
          .join("")}
      </ul>
    `;

    container.appendChild(details);
  });
});

}

const search =
    document.querySelector(".search");

search.addEventListener(
    "input",
    e => {

        const keyword =
            e.target.value.toLowerCase();

        document
            .querySelectorAll(".lab-card")
            .forEach(card => {

                card.style.display =
                    card.textContent
                        .toLowerCase()
                        .includes(keyword)
                        ? ""
                        : "none";

            });

    }
);


function renderUpcominglabs(){

  

  
  const upcomingContainer = document.getElementById("upcomingLabsContainer");
state.data.upcomingLabs.forEach((lab) => {
  const card = document.createElement("div");
  card.className = "upcoming-card";

  card.innerHTML = `
    <div class="upcoming-card-top">
      <span class="upcoming-icon">🧪</span>
      <span class="coming-badge">Coming Soon</span>
    </div>

    <h3>${lab.name}</h3>

    <p>${lab.department}</p>
  `;

  upcomingContainer.appendChild(card);
});
}
