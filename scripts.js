async function fetchData() {
    const response = await fetch("data.json");
    const data = await response.json();
    return data;
}

function createNode(title) {
    const node = document.createElement("div");
    node.classList.add("node");
    node.textContent = title;
    return node;
}

function createLevel() {
    const level = document.createElement("div");
    level.classList.add("level");
    return level;
}

function removeDeeperLevels(container, level) {
    while (container.children.length > level + 1) {
        container.removeChild(container.lastChild);
    }
}

function buildTree(data, container, level = 0) {
    if (!data || !data.length) {
        return;
    }

    const currentLevel = container.children[level] || createLevel();
    container.appendChild(currentLevel);

    currentLevel.innerHTML = "";
    data.forEach(item => {
        const node = createNode(item.name);
        currentLevel.appendChild(node);

        node.addEventListener("click", () => {
            if (item.children) {
                buildTree(item.children, container, level + 1);
            } else {
                removeDeeperLevels(container, level);
            }
            showNodeDescription(item.description);
        });
    });

    removeDeeperLevels(container, level);
}

function showNodeDescription(description) {
    const nodeDescription = document.getElementById("node-description");
    nodeDescription.style.opacity = 0;
    setTimeout(() => {
        nodeDescription.textContent = description || "";
        nodeDescription.style.opacity = 1;
    }, 100);
}

const container = document.getElementById("tree-container");

fetchData().then(data => {
    buildTree([data], container);
});