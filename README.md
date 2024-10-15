# Forum Application Backend

Welcome to the Forum Application Backend! This project serves as the backend for a forum platform where students can create and manage questions, and instructors can provide answers. The application follows the principles of Clean Architecture to ensure maintainability and scalability.

## Features

- **CRUD Operations for Questions**: Students can create, read, update, and delete their questions.
- **CRUD Operations for Answers**: Instructors can create, read, update, and delete answers to student questions.
- **Attachments**: Both questions and answers support file attachments for enhanced context.
- **Comments**: Users can leave comments on both questions and answers for additional discussion.
- **Caching**: Utilizing Redis for efficient caching to enhance performance and reduce load times.
- **Testing**: Comprehensive testing implemented using Vitest to ensure reliability and correctness.

## Architecture

This project is designed with Clean Architecture principles, promoting separation of concerns and enhancing maintainability. The architecture is divided into three primary layers: **Domain**, **Interface/Gateways**, and **External**.

### Domain Layer

- **Business Logic**: Contains the core business rules and entities of the application.

### Interface/Gateways Layer

- Serves as the bridge between the internal (Domain) and external layers.
- Responsible for data treatment, including mappers and presenters to transform data for use in the application.
- Handles requests and responses, ensuring smooth communication between different layers.

### External Layer

- Responsible for data persistence and integration with external services.
- Manages file uploads via **Cloudflare R2** for scalable storage of attachments.
- Provides caching through **Redis** to optimize performance.
- Handles encryption services and other external integrations.

This layered approach ensures that modifications to external services or infrastructure components do not impact the core business logic, allowing for easier maintenance and scalability.


## File Uploads

For handling file uploads, we utilize **Cloudflare R2**. This service allows for scalable and cost-effective storage of attachments, ensuring that users can seamlessly upload and access files.

## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    > git clone https://github.com/matheusbarcc/forum-nest-clean.git
    ```

2. Navigate to the project directory:
   ```sh
   > cd forum-nest-clean
   ```

3. Install dependencies:
   ```sh
   > pnpm install
   ```

4. Configure your environment variables. Create a `.env` and `.env.test` files and set up your Database, Cloudflare R2, and JWT keys.

5. Run the application:
   ```sh
   > pnpm start:dev
   ```

## Running Tests

To run the unit test suite, use the following command:

```sh
> pnpm test
```

To run the e2e test suite, use the following command:

```sh
> pnpm test:e2e
```

This project uses **Vitest** for testing, providing fast and reliable tests to ensure the quality of the application.

---

Thank you for checking out the Forum Application Backend!
```

Feel free to modify any sections or add additional information as needed!
