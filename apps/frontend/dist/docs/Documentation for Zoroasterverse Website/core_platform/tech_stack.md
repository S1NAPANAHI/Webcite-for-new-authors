# Core Platform: Technology Stack

This document defines the core programming languages, frameworks, and libraries chosen for the development of the Zoroasterverse website.

---

## 1. Overall Strategy: Full JavaScript/TypeScript Stack

To ensure a highly interactive, user-friendly experience and streamline development, a unified JavaScript/TypeScript stack will be utilized across both frontend and backend.

## 2. Frontend Technology: React (with TypeScript)

*   **Framework:** React
*   **Language:** TypeScript (superset of JavaScript)

### 2.1. Rationale

*   **Interactivity & User Experience:** React excels at building dynamic and responsive user interfaces, crucial for the shop, worldbuilding, and personalized user profiles.
*   **Component-Based Architecture:** Promotes modularity, reusability, and easier maintenance of UI elements.
*   **Strong Ecosystem:** A vast collection of libraries, tools, and a large community provide extensive support and resources.
*   **Type Safety (TypeScript):** TypeScript enhances code quality, reduces runtime errors, and improves developer productivity, especially in larger, collaborative projects.

## 3. Backend Technology: Node.js (with NestJS)

*   **Runtime:** Node.js
*   **Framework:** NestJS
*   **Language:** TypeScript

### 3.1. Rationale

*   **Unified Language:** Using TypeScript across frontend and backend simplifies the development process, allows for full-stack developer roles, and reduces context switching.
*   **Scalability:** Node.js is highly performant for I/O-bound operations, making it suitable for handling numerous concurrent user requests (e.g., shop transactions, content delivery).
*   **Structured Architecture (NestJS):** NestJS provides an opinionated, modular, and scalable application structure (inspired by Angular). This is ideal for managing the complexity of the shop, subscription models, user management, and worldbuilding APIs, ensuring long-term maintainability and extensibility.
*   **TypeScript Integration:** NestJS is built with TypeScript, providing end-to-end type safety and developer tooling benefits.

## 4. Database (To be detailed in [Database Schema](./database_schema.md))

*   The choice of database will be detailed in a separate document, but it will be selected to integrate seamlessly with the Node.js backend and support the complex content model (potentially a graph database for worldbuilding).

## 5. Other Considerations (To be detailed)

*   **State Management:** (e.g., Redux, Zustand, React Context for Frontend)
*   **Styling:** (e.g., CSS-in-JS, Tailwind CSS, Sass)
*   **Build Tools:** (e.g., Webpack, Vite)
*   **Testing Frameworks:** (e.g., Jest, React Testing Library, Supertest)
*   **Deployment Strategy:** (e.g., Docker, Kubernetes, Serverless)

## 6. Initial Application Setup

*   **Frontend Application:** A basic React (with TypeScript) application structure has been initiated in `../Zoroasterverse/src/frontend/` to serve as the foundation for the website's home page and user interface. This includes `index.html`, `App.tsx`, and `index.tsx`.