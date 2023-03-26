async function veriYukle() {
    const response = await fetch("data.json");
    const data = await response.json();
    return data;
}

function createNode(text, children, details) {
    const node = document.createElement("div");
    node.classList.add("node");

    const label = document.createElement("span");
    label.textContent = text;
    node.appendChild(label);

    function stopPropagation(event) {
        event.stopPropagation();
    }

    if (details) {
        node.addEventListener("click", (event) => {
            stopPropagation(event);
            const nodeDetails = document.getElementById("node-details");
            nodeDetails.textContent = details;
            nodeDetails.classList.remove("hidden");
        });
    }

    if (children) {
        node.setAttribute('data-has-children', 'true');
        node.addEventListener("click", (event) => {
            stopPropagation(event);

            const parent = node.parentNode;
            parent.childNodes.forEach((sibling) => {
                if (sibling !== node && sibling.classList.contains("expanded")) {
                    sibling.classList.remove("expanded");
                    sibling.querySelector(".tree").classList.add("hidden");
                    sibling.classList.remove("active-node");
                    
                }
            });

            if (!node.classList.contains("expanded")) {
                node.classList.add("active-node");
                children.classList.remove("hidden");
                node.classList.add("expanded");

            }
        });

        node.addEventListener("dblclick", (event) => {
            stopPropagation(event);
            if (node.classList.contains("expanded")) {
                node.classList.remove("active-node");
                children.classList.add("hidden");
                node.classList.remove("expanded");
            }
        });

        node.appendChild(children);
    }

    return node;
}

function buildTree(data) {
    if (!data.alt_dallar) return null;

    const tree = document.createElement("div");
    tree.classList.add("tree", "hidden");
    data.alt_dallar.forEach((child) => {
        const subTree = buildTree(child);
        const node = createNode(child.baslik, subTree, child.aciklama);
        tree.appendChild(node);
    });

    return tree;
}


(async function main() {
    const data = await veriYukle();
    const tree = buildTree(data);
    const root = createNode(data.baslik, tree, data.aciklama);

    root.addEventListener("click", () => {
        const nodeDetails = document.getElementById("node-details");
        nodeDetails.textContent = data.aciklama;
        nodeDetails.classList.remove("hidden");
    });

    document.getElementById("root").appendChild(root);
})();
