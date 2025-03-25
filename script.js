// =====================
//    MODO ESCURO/CLARO
// =====================
const toggleBtn = document.getElementById("toggleBtn");
const toggleImg = document.getElementById("toggleImg");
const body = document.getElementById("body");

toggleBtn.addEventListener("click", function () {
    const isLightMode = toggleImg.dataset.theme === "light";
    
    toggleImg.src = isLightMode ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
    toggleImg.alt = isLightMode ? "icon-moon" : "icon-sun";
    toggleImg.dataset.theme = isLightMode ? "dark" : "light";
    
    body.className = isLightMode ? "container-light" : "container-dark";
});

// =====================
//     FETCH DATA
// =====================
let data_list = [];

fetch("./data.json")
    .then(response => response.json())
    .then(data => {
        console.log("Fetched data:", data);
        data_list = data;
        renderList(data_list);
    })
    .catch(error => console.error("Error fetching data:", error));

// =====================
//     RENDER LIST
// =====================
function renderList(filteredData) {
    const parentDiv = document.getElementById("dynamicListDiv");
    parentDiv.innerHTML = "";

    if (!filteredData || filteredData.length === 0) {
        console.log("No data found!");
        return;
    }

    filteredData.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-div");

        itemDiv.innerHTML = `
            <div class="item-inner-top-div">
                <img src="${item.logo}" alt="${item.name}"/>
                <div class="item-text-div">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                </div>
            </div>
            <div class="item-inner-bottom-div">
                <button class="remove-btn" type="button" data-index="${index}">
                    Remove
                </button>
                <label class="switch">
                    <input type="checkbox" ${item.isActive ? "checked" : ""} data-index="${index}" aria-label="Toggle status"/>
                    <span class="slider round"></span>
                </label>
            </div>
        `;

        parentDiv.appendChild(itemDiv);
    });

    // Adiciona eventos após renderizar os itens
    addEventListeners();
}

// =====================
//  ADICIONAR EVENTOS
// =====================
function addEventListeners() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.dataset.index;
            data_list.splice(index, 1);
            renderList(data_list);
        });
    });

    document.querySelectorAll(".switch input").forEach(switchBtn => {
        switchBtn.addEventListener("change", function () {
            const index = this.dataset.index;
            data_list[index].isActive = this.checked;
            console.log(`Updated ${data_list[index].name}: isActive = ${this.checked}`);
        });
    });
}

// =====================
//   FILTRAR LISTA
// =====================
document.getElementById("allBtn").addEventListener("click", function () {
    updateActiveButton(this);
    renderList(data_list);
});

document.getElementById("activeBtn").addEventListener("click", function () {
    updateActiveButton(this);
    const filteredList = data_list.filter(item => item.isActive);
    renderList(filteredList);
});

document.getElementById("inactiveBtn").addEventListener("click", function () {
    updateActiveButton(this);
    const filteredList = data_list.filter(item => !item.isActive);
    renderList(filteredList);
});

// =====================
// ATUALIZAR BOTÃO ATIVO
// =====================
function updateActiveButton(selectedBtn) {
    document.querySelectorAll(".category-button").forEach(btn => btn.classList.remove("active"));
    selectedBtn.classList.add("active");
}
