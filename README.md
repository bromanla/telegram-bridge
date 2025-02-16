# Telegram Bridge 🚀

> This project is still in development, and the documentation is a work in
> progress.

A bridge application for seamless message transfer between social networks.
Effortlessly sync your conversations and notifications across multiple platforms
without needing to log in to each one. Stay connected with friends and
communities in one unified chat experience.

This project showcases cutting-edge technologies and a modular architecture,
making it easy to scale and maintain.

---

### About the Project 💡

The project is a **monorepository** built on [Deno](https://deno.land/),
integrating several key modules for database management, message exchange, and
social network integration.

#### **Project Structure:**

- **libs/store** – A module for working with **PostgreSQL**, utilizing
  [Kysely](https://github.com/koskimas/kysely) for type-safe SQL queries. It
  includes schemas, types, and database migrations.
- **libs/common** – A collection of utilities, including logging, caching,
  validation with [Zod](https://github.com/colinhacks/zod), parsing, and other
  essential tools.
- **libs/bus** – A message bus based on [NATS](https://nats.io/) for routing
  various message types (text, images, voice, stickers, etc.) between bots.
- **apps/vk** – A bot for [VK](https://vk.com/), using
  [vk-io](https://github.com/negezor/vk-io) to interact with the VK API.
- **apps/telegram** – A Telegram bot built with the
  [grammy](https://grammy.dev/) framework, supporting localization and message
  parsing.

The project is written in **TypeScript**, ensuring strong typing and
maintainability. **AsyncLocalStorage** is used for managing asynchronous
operations, while decorators are applied for caching and other business logic
aspects. The monorepository structure simplifies centralized dependency
management, configuration, and development tooling.

---

## Repository Structure 📁

```plaintext
.
├── apps
│   ├── telegram        # Telegram bot (application)
│   └── vk              # VK bot (application)
├── libs
│   ├── bus             # Message bus
│   ├── common          # Shared utilities and tools
│   └── store           # Database management and migrations
└── deno.jsonc          # Monorepository configuration
```
