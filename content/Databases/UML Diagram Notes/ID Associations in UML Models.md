## Basic Structures: Object Relationships

UML model associations generally follow 4 main groupings:
- One to One (1 : 1)
- One to Many (1 : N)
- Many to One (N : 1)
- Many to Many (N : N)

With each endpoint of a class having a min and a max which help us determine which of these four groupings the relationship falls into

| **Left Endpoint Multiplicity** | **Right Endpoint Multiplicity** | **Maximums (Left : Right)** | **Relationship Name** | **Example**                                              |
| ------------------------------ | ------------------------------- | --------------------------- | --------------------- | -------------------------------------------------------- |
| `0..1` or `1..1`               | `0..1` or `1..1`                | **1 : 1**                   | **One-to-One**        | Person $\leftrightarrow$ Passport                        |
| `0..1` or `1..1`               | `0..*` or `1..*`                | **1 : N**                   | **One-to-Many**       | Customer $\leftrightarrow$ Payment                       |
| `0..*` or `1..*`               | `0..1` or `1..1`                | **N : 1**                   | **Many-to-One**       | Payment $\leftrightarrow$ Customer (perspective flipped) |
| `0..*` or `1..*`               | `0..*` or `1..*`                | **N : M**                   | **Many-to-Many**      | Student $\leftrightarrow$ Course                         |

 Moving back a little lets look at each endpoint individually. The minimum and maximum of each endpoints is called the **multiplicity** which is formatted as `[Min]..[Max]`. The multiplicity itself has two parts, **the participation** and **the cardinality**.
 - participation is either mandatory (`1`) or optional (`0`) this is seen as the `[Min]`
 - where the cardinality determines the maximum number of instances that can be related to, this can also be called the constraints this is seen as the `[Max]`

Looking at the Customer $\leftrightarrow$ Payment relationship above, we can see it is a One to Many (1:N) pairing. this can me shown by denoting each endpoint of a class with its respective multiplicity value.
- Customer -> `1..1`: Each payment must be related to one customer, (the 1 at the beginning) and no more than one customer (the 1 at the end)
- Payment -> `0..*`: A customer may not be related to any payments (the 0 at the beginning) or many payments (the * at the end)
- Therefore with this example a multiplicity of 0..0 or 1..0 makes zero sense
When writing out this relation in plain English it would read as follows: "Each customer remits _zero or more_ payments.” (The symbol *  means “many”, and any quantity more than one is considered to be “many” in a database.) Writing it out in simple terms would go as follows: “Each payment is remitted by _one and only one_ customer.”

When writing out the relations in English we can use certain vocabulary terms to help denote the specific multiplicity values at each endpoint. For example we use **must** to signify mandatory participation (1 or more), **may** to signify optional participation (0 or more), and **each** to signify a singular instance of a class (each customer)

In the example above we call this a binary association as it links only two classes together. However, it is possible to link more than two classes together in which case we call it a n-ary association. With binary associations we label one class as the **parent** and one as the **child** with our One to Many(1:N) association the parent is the "one" side of the model (customer) and the **child** is the "many" (payments) side of the model.
## Lookup Tables

**Introduction:** When creating classes we can sometimes run into issues where the values of certain attributes could be out of bounds. For example if a college course is only offered in the fall semester but the string value for semester is spring. we now have an invalid attribute value leading to an error as the database will look at the spring semester and not find the class. This can be solved by creating separate association classes. As a quick note it is important to remember that with each side class created, the main class will need an exact 1..1 multiplicity to ensure referential .

![[UML Lookup Tables.png]]

Looking at thee UML diagram above, The main `Section` class has many look up classes that allow us to verify certain attributes and quantities through  multiplicities.  Going through the table we have:
- `Semester` $\rightarrow$ `Sectionn` (`1..1 to 0..*`)
	- This link means that each section can only be assigned to exactly one semester. Additionally, one semester can have 0 or many sections tied to the same one
- `Building` $\rightarrow$ `Section` (`1..1 to 0..*`)
	- This link tells the sections where it will be located when the class starts
- `Building` $\rightarrow$ `Department` (`1..1 to 0..*`)
	- Building here is reused to also locate department offices
- `Instrucotr` $\rightarrow$ `Section` (`1..1 to 0..*`)
	- This link shows how each section has exactly one assigned Instructor

With this information we can also better understand why look up tables are better than enumeration data types because:

| **Aspect**             | **Enumerations (Enums)**                                       | **Lookup Tables / Classes**                                                          |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Adding New Values**  | Requires updating code/schema and redeploying software.        | Simply insert a new row/document into the lookup table (no code changes).            |
| **Enterprise Sharing** | Difficult to keep synchronized across different apps/services. | Easily shared centrally across the entire database/enterprise.                       |
| **Data Quality**       | Restricted to hardcoded developer options.                     | High quality; multiple application stakeholders interact with and validate the data. |
| **System Integration** | Harder to map across external software.                        | Fosters consistency and simplifies cross-application integration.                    |
