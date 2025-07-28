# Langchain-flow-builder: A Chatbot Flow Builder

A sleek and responsive chatbot flow builder built with React and powered by `react-flow` (formerly `xyflow`). This allows users to visually construct chatbot conversation flows by connecting different message nodes, starting with basic text messages.

---

## Screenshots

Here's a look at the NodeNarrative in action:

---

## 🚀 Technologies Used

* **React** - JavaScript library for building user interfaces
* **Vite** - Next-generation frontend tooling
* **React Flow (xyflow)** - Library for building node-based editors
* **JavaScript/TypeScript** - For development (specify which one you used predominantly or if both are supported)

---

## ✨ Features

* **Text Node:** Supports a single type of message node for building conversational flows. Multiple text nodes can be added.
* **Nodes Panel:** An extensible sidebar for dragging and dropping new nodes onto the canvas.
* **Edges:** Connects two nodes to define the flow of conversation.
* **Handles:**
    * **Source Handle:** Allows only **one** outgoing edge.
    * **Target Handle:** Can accept **multiple** incoming edges.
* **Settings Panel:** Replaces the Nodes Panel when a node is selected, allowing for text editing of the selected node.
* **Save Functionality:** Saves the current flow state. Includes validation to prevent saving if multiple nodes have unconnected target handles (ensuring a complete flow).

---

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js installed on your machine.

* [Node.js](https://nodejs.org/en/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/node-narrative.git](https://github.com/YOUR_USERNAME/node-narrative.git)
    cd node-narrative
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **To run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
