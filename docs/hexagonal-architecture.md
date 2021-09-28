# Hexagonal Architecture

Hexagonal architecture is a technique used to completely separate business logic from technical code. Technical code is the code that runs the tech stack you are using. It is also referred to as Ports & Adapters Architecture.

The hexagonal approach allows the business logic to be technically agnostic, meaning it doesn' matter if you use MongoDB on the backend or PostgreSQL. Switching from one teck stack to another will have no affect on the business logic. 

# Design

In order to implement the hexagonal pattern, all of the business logic is placed into a section called the Domain. All other technical code is outside of the domain. The domain only relies on itself and any dependecies come from outside the domain.

Surrounding the domain are business interfaces that allow the domain to connect with the outside. These interfaces are the ports and the outside implementation are the adapters. Interaces used for querying are referred to API and interfaces that provide information are called SPI (Service Provider Interface).
<br />
<br />
![Implementation of Hexagonal Architecture](https://beyondxscratch.com/wp-content/uploads/2020/08/implementation-of-the-hexagonal-architecture-1200x649.png)
<br />
<br />
# Implementation

When implementing the hexagonal pattern, it is suggested that you start inside the hexagon (domain). This allows you to focus on the business features without tech stack details getting in the way. It also allows you to delay technical implementation in the early stages of development. As the business logic develops, decisions for technical details will also become clear.
<br />
<br />
![Adapters modularity in Hexagonal Architecture](https://beyondxscratch.com/wp-content/uploads/2020/08/hexagonal-architecture-adapters-modularity-1200x465.png)



_source: [Hexagonal Architecture: the practical guide for a clean architecture](https://beyondxscratch.com/2017/08/19/hexagonal-architecture-the-practical-guide-for-a-clean-architecture/)_