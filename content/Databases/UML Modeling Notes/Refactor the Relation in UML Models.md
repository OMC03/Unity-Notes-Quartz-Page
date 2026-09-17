## Redundancy & Integrity

Databases need to able to store all of the necessary data a company may need/produce over its running lifespan. This can have some varying complications if the data is not handled correctly. As an example if the database needs to store information regarding the weight of a package but the current database has no column or row to store that specific piece of information, the entire database would need to be restructured to accommodate the new attribute value. Similarly if a database stores unnecessary information this could cause risk/liability, and wastes storage if the data is not handled properly. The best practice to avoid this is to store all data as basic text strings in generic column names such as cloA, cloB, cloC. It is also worth noting to set them to maximum widths to avoid any potential overflows.

Accurate data is widely considered accurate data, Another interpretation is to see this as data that is not impossible/corrupted. Although this is the ideal scenario data can be very reasonable and unreasonable. For example, if someone get your date of birth wrong they still chose a real date on a calendar. 

Data inaccuracy can occur for many potential reasons:

- The user misinterpreted the data.
    - This is particularly likely if the database structure is not descriptive. Naming a column something like "cola" provides nothing in the way of the intended meaning of the data stored in that column.
    - If the data value is a quantity, and the units are not specified, or the user fails to take the units into account. For instance, if a column is recorded in kg but the user thought it represented pounds.
- The data was wrong in the first place.
    - For instance a person's birth date was entered with the wrong year.
    - The data value could **never** have been right.
        - The datatype of the entered value was wrong. For instance, putting a person's name in the column designated for their birth date.
        - The value was impossible.
            - For instance, a semester name of 'Summer IV' when there are never more than three sessions in the summer.
            - For instance, putting in the name of a non-existent instructor for a section.
- The data was right to begin with, but became out of date. For instance, if your database manages inventory records and that includes the quantity on hand for each product, when a sale occurs, the quantity on hand must be decremented to reflect the sales transaction, or the data becomes wrong because it is no longer accurate.
- The data is contradictory. The same piece of information can be stored more than once in the database. If that is the case, those multiple copies of the same information **could** disagree with each other.

Some good strategies to enforce integrity throughout the database include:
- **Descriptive Naming & Data Dictionary:** Use clear structural names and maintain a narrative **data dictionary** (glossary) so users understand what data is being recorded.
    
- **Strict Datatypes:** Avoid defaulting to text strings. Use specific datatypes (such as native `Date` formats) to allow the database system to automatically reject invalid inputs (e.g., Feb 30th) and provide useful built-in operators.
    
- **Domain Constraints & Lookup Tables:** Restrict allowed values using rules (e.g., age constraints) or **Lookup Tables** (e.g., a master list of valid semesters) to prevent impossible data entries.

One final thing to keep note of when building and storing databases is to be aware of redundancy in terms of repeated attributes. These are spread across three main data anomalies:
- **Insertion Anomalies:** Inconsistent or contradictory data can easily be introduced when inserting a new record (e.g., adding a course with a misspelled department chair name).
    
- **Update Anomalies:** Changing a single shared fact (e.g., updating a department chair) requires modifying every duplicate row. Missing a single row results in conflicting data.
    
- **Deletion Anomalies:** Deleting an entity (e.g., removing a department's last remaining course offering) inadvertently wipes out all stored knowledge about the parent entity (e.g., losing the entire department's office location and chair information).

The solution is to refractor the database schemas. This ensures each fact is captured in a single place. instead of per each instance.

## Functional Dependencies

Functional Dependencies describes relationships between attributes within a database relation
- **Notation:** $X \rightarrow Y$ (Read as: _"X functionally determines Y"_ or _"Y is functionally dependent on X"_).
    
- **Core Principle:** If two rows agree on the value(s) of attribute set $X$, they **must** agree on the value(s) of attribute set $Y$.
    
- **Determinant:** $X$ is called the **determinant** (the left-hand operand).
    
- **Business Rule Connection:** FDs formally express business rules that rule out impossible data states.
	- in other words, functional dependencies show connections between attributes to prevent impossible data from being validated

Some examples include:
- `{department} → {chair}` $\rightarrow$ Knowing the department tells you the department's chair.
    
- `{department, course_number} → {name}` $\rightarrow$ Knowing both department and course number uniquely identifies the course name.

These are based on Armstrong's Axioms which comprise of three different rules
**reflexivity**
- If X is a set of attributes and Y is a subset of X, then X functionally determines Y. More formally, if Y⊆X then X→Y.
**augmentation**
- If X, Y, and Z are sets of attributes in the same relation scheme, and X functionally determines Y, then XZ functionally determines YZ. More formally, if X→Y then XZ→YZ.
**transitivity**
- If X functionally determines Y and Y functionally determines Z, then X functionally determines Z. More formally, if X→Y and Y→Z then X→Z.

From these there are also secondary rules that can be proven which can save time when proving new functional dependencies.
Union: If X→Y and X→Z then
1. X→Y (Given)
2. X→Z (Given)
3. X→XZ (By applying the Augmentation axiom to #2 and X)
4. XZ→YZ (By applying the Augmentation axiom to #1 and Z)
5. X→YZ (By applying Transitivity to 3 and 4)

Decomposition: if X→YZ then X→Y **and** X→Z.
1. X→YZ (Given)
2. YZ→Y (Reflexivity)
3. X→Y (transitivity of 1 & 2)

Given Armstrong's axioms, the secondary rules, and the functional dependencies cited above, we can prove that {department, course_number}→{chair, building, room, name, units} and {department, name}→{chair, building, room, course_number, units} as follows:
1. {department}→{chair} (given)
2. {department}→{building} (given)
3. {department}→{room} (given)
4. {department}→{chair, building, room} (By the Union secondary rule)
5. {department, course_number}→{name} (given)
6. {department, course_number}→{units} (given)
7. {department, course_number}→(name, units) (By the Union secondary rule)
8. {department, course_number}→{chair, building, room, name, units} (By applying composition to 4 and 7, i.e. if $A \rightarrow B$ and $C \rightarrow D$, then $AC \rightarrow BD$)
9. {department, name}→{course_number, units} (Just as we did #7 above)
10. {department, name}→{chair, building, room, course_number, units} (Just as we did 8 above)

However before proving super keys we first need to look at everything a set can determine using attribute closures:

- **Definition:** $X^+$ is the set of all attributes that are functionally determined by $X$ under a set of FDs.
- **How it works:**
    1. Start with $X^+ = X$.
    2. Search your list of FDs for any dependency $A \rightarrow B$ where $A \subseteq X^+$.
    3. Add $B$ to $X^+$.
    4. Repeat until $X^+$ stops growing.
- **Key Rule:** If $X^+ = R$ (all attributes in the schema), then **$X$ is a Superkey**.

**Trivial vs Non-Trivial functional dependencies:**
- **Trivial FD:** An FD $X \rightarrow Y$ is trivial if $Y \subseteq X$ (e.g., $\{\text{department, course\_number}\} \rightarrow \{\text{department}\}$). These add no new information and are always true by Reflexivity.
    
- **Non-Trivial FD:** An FD where $Y$ is not a subset of $X$ (e.g., $\{\text{department}\} \rightarrow \{\text{chair}\}$). Database design focuses entirely on non-trivial FDs.

A **Superkey** is any set of one or more attributes that functionally determines **all attributes in the relation scheme $R$**.

If $R = \{\text{department, chair, building, room, course\_number, name, units}\}$, then any set $X$ where $X \rightarrow R$ is a superkey:
- **Proof #8:** $\{\text{department, course\_number}\} \rightarrow \{\text{chair, building, room, name, units}\}$
- **Proof #10:** $\{\text{department, name}\} \rightarrow \{\text{chair, building, room, course\_number, units}\}$

Because both $\{\text{department, course\_number}\}$ and $\{\text{department, name}\}$ functionally determine **every other attribute in the table**, both of these sets are **Superkeys**.

Imagine you query a relation table that enforces these superkey rules.
#### Scenario A: Using $\{\text{department, course\_number}\}$ as a Superkey

- You tell the database: _"Look up the row where `department = 'CECS'` and `course_number = 323`."_
- Because $\{\text{department}\} \rightarrow \{\text{chair, building, room}\}$, knowing `CECS` immediately locks in `chair = 'Aliasgari'`, `building = 'ECS'`, and `room = 540`.
    
- Because $\{\text{department, course\_number}\} \rightarrow \{\text{name, units}\}$, knowing `CECS 323` immediately locks in `name = 'Database Fundamentals'` and `units = 3`.
    
- **Result:** There can **never** be two different rows for `CECS 323` that have different chairs, rooms, or course names. The database guarantees that this combination points to **exactly one unique set of values**.
    

#### Scenario B: Using $\{\text{department, name}\}$ as a Superkey

- You tell the database: "Look up the row where `department = CECS and name = Database Fundamentals."

- Following the exact same logic, knowing the department name and course title allows the database to derive `course_number = 323`, `units = 3`, `chair = 'Aliasgari'`, etc.

- **Result:** $\{\text{department, name}\}$ is also a valid unique identifier for any row in the table.

With all this layout here is the ordering in hierarchy of primary keys, super keys, and candidate keys
- **Superkey:** Any combination of attributes that determines all remaining attributes.
    - Example: $\{\text{department, course\_number, building}\}$ is a superkey because it determines everything in the row. However, `building` isn't actually needed!
        
- **Candidate Key:** A **minimal** superkey. If you remove even one attribute from it, it loses the ability to determine all remaining attributes.
- $K$ is a Candidate Key for schema $R$ if and only if:
	1. $K \rightarrow R$ ($K$ is a superkey), AND
	2. For any attribute $A \in K$, $(K - \{A\}) \not\rightarrow R$ (no proper subset of $K$ is a superkey).
- $\{\text{department, course\_number}\}$ is a Candidate Key (if you remove `course_number`, `{department}` alone cannot determine the course `name`).
- $\{\text{department, name}\}$ is also a Candidate Key.

- **Primary Key:** The single Candidate Key chosen by the database designer to act as the official identifier for rows in the table (typically $\{\text{department, course\_number}\}$).

The reason we look for superkeys in the at all is to remove redundancy. Look back through our examples, the attribute `department` shows up in multiple contexts, we proved this by creating functional dependencies which reveals a partial dependency (where a non-key attribute depends on only _part_ of the candidate key $\{\text{department, course\_number}\}$) With this partial dependency it proves redundancy causing us to split the scheme into two separate relations (tables)
## Subkey Resolution

Here is a table that describes the variables in relation to the school course table

| **Variable** | **Definition**                                                           | **Significance / Role**                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **$R$**      | The original relation schema.                                            | The initial table structure being evaluated for redundancy (e.g., $R = \{\text{department, chair, building, room, course\_number, name, units}\}$).                 |
| **$W$**      | The determinant set of attributes causing the subkey/partial dependency. | A minimal proper subset of $R$ that functionally determines other attributes, but **does not** determine all attributes in $R$ (e.g., $W = \{\text{department}\}$). |
| **$Z$**      | The set of attributes dependent solely on $W$.                           | The attributes that are functionally determined by $W$, but are redundant when stored alongside $R$ (e.g., $Z = \{\text{chair, building, room}\}$).                 |
| **$R_1$**    | The newly created parent/lookup relation scheme.                         | $R_1 = W \cup Z$. It isolates $W$ and $Z$ into a standalone table so that $W \rightarrow Z$ is stored **exactly once** (e.g., the `DEPARTMENTS` table).             |
| **$R_2$**    | The newly created child/referencing relation scheme.                     | $R_2 = R - Z$. It keeps $W$ as a foreign key to link back to $R_1$, while stripping out $Z$ to eliminate duplicate data (e.g., the new `COURSES` table).            |

To spot redundanncy within a given data set we can follow two main steps:

| **Step**               | **Action**                                                     | **Purpose**                                                         |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| **1. Identify FDs**    | Formulate dependencies like $W \rightarrow Z$                  | Expose subkeys and prove where redundancy occurs.                   |
| **2. Refactor Schema** | Split $R$ into two tables ($R_1 = W \cup Z$ and $R_2 = R - Z$) | Eliminate duplicate data, update anomalies, and deletion anomalies. |

When discovering redundancy we refractor the current functional dependencies into their own tables in order to get rid of sub keys. By doing this a few issue are resolved with our current school course dataset, those include:
- **Insertion Anomalies Resolved:** New courses can be added without repeating or risking contradictory department data.    
- **Update Anomalies Resolved:** If a department chair changes, the modification is made in a single tuple in the new department relation.
- **Deletion Anomalies Resolved:** Deleting all courses from a department no longer erodes the existence of the department itself.

With our table now split into $R_1$ and $R_2$  we need to ensure nothing was lost during the split. We can also call it lossless,  to determine this we need to look at a couple things:
- **Definition:** A decomposition is **lossless** if joining $R_1$ and $R_2$ back together via a relational `JOIN` (e.g., `INNER JOIN ... USING(department)`) reproduces the exact original set of tuples in $R$.
- **Criteria:** No original rows are lost, and no spurious/false rows are generated during the join operation.

Now lets take a look at the general break down for creating lookup tables based on keys found in functional dependencies

The algorithm takes a bloated relation scheme $R$ and splits it into two smaller schemes $R_1$ and $R_2$ using a problematic functional dependency $W \rightarrow Z$:

- **Original Relation Scheme ($R$):**    $$R = \{\text{department, chair, building, room, course\_number, name, units}\}$$
- **The Problematic FD ($W \rightarrow Z$):**$$\{\text{department}\} \rightarrow \{\text{chair, building, room}\}$$
    - $W = \{\text{department}\}$ (the minimal determinant causing redundancy).
	    - This can also be known as the minimal sub key
    - $Z = \{\text{chair, building, room}\}$ (the non-key attributes being repeated).
	    - This can also be known as the dependencies of the minimal sub key

To isolate the redundancy, we construct two separate relations:
1. **Creating $R_1 = W \cup Z$ (The Lookup / Parent Table):**
    
    - Combine $W$ and $Z$:$$R_1 = \{\text{department}\} \cup \{\text{chair, building, room}\} = \{\text{department, chair, building, room}\}$$
    - **Why?** This table isolates department-specific information so that each department's chair, building, and room are defined **exactly once**.
        
2. **Creating $R_2 = R - Z$ (The Child Table):**
    
    - Remove $Z$ from the original attributes $R$:
    - $R_2$ = {department, chair, building, room, course_number, name, units}\} - {chair, building, room}
    - $R_2$ = {department, course_number, name, units}

    - **Why?** We subtract $Z$ to stop repeating chair, building, and room inside every course record. Notice $W$ ($\{\text{department}\}$) remains in $R_2$ so it can act as a **Foreign Key** to link back to $R_1$.

The algorithm loops recursively: after creating $R_1$ and $R_2$, you must test both new tables to ensure neither contains any hidden subkey redundancies.

#### Evaluating $R_1$ (`departments`):

- **Functional Dependency in $R_1$:** $\{\text{department}\} \rightarrow \{\text{chair, building, room}\}$
    
- **Total Attributes in $R_1$:** $\{\text{department, chair, building, room}\}$
    
- **Analysis:** The determinant $\{\text{department}\}$ functionally determines **all** remaining attributes in $R_1$. Therefore, $\{\text{department}\}$ is a candidate key for $R_1$.
    
- **Conclusion:** Because the determinant is a candidate key for the entire relation $R_1$, **no redundancy exists in $R_1$**.
    

#### Evaluating $R_2$ (`courses`):

- **Functional Dependencies in $R_2$:**
    1. $\{\text{department, course\_number}\} \rightarrow \{\text{name, units}\}$
    2. $\{\text{department, name}\} \rightarrow \{\text{course\_number, units}\}$
        
- **Total Attributes in $R_2$:** $\{\text{department, course\_number, name, units}\}$
    
- **Analysis:**
    
    - In FD #1, $\{\text{department, course\_number}\}$ determines all remaining attributes in $R_2$ ($\text{name}$ and $\text{units}$). Thus, $\{\text{department, course\_number}\}$ is a candidate key for $R_2$.
        
    - In FD #2, $\{\text{department, name}\}$ determines all remaining attributes in $R_2$ ($\text{course\_number}$ and $\text{units}$). Thus, $\{\text{department, name}\}$ is also a candidate key for $R_2$.
        
- **Conclusion:** Since both determinants determine the entirety of $R_2$ (there are no attributes left over that depend on only a partial key or non-key attribute), **no redundancy exists in $R_2$**.
## Relation Substitution Inference Rule

The **Substitution Inference Rule** is a secondary rule (or shortcut) derived from Armstrong's Axioms.

- **Proposition:** If $A \rightarrow B$ and $B \rightarrow A$ (meaning $A$ and $B$ are equivalent determinants), then:
    - $B$ can replace $A$ in any functional dependency to produce an equally valid functional dependency.
    - $A$ can replace $B$ in any functional dependency to produce an equally valid functional dependency.
#### Case 1: Simple Substitution ($A \rightarrow C \implies B \rightarrow C$)

1. $B \rightarrow A$ (Given)
2. $A \rightarrow C$ (Given)
3. $B \rightarrow C$ (By Transitivity on 1 and 2)
    

#### Case 2: Determinant Set Substitution ($\{A, C\} \rightarrow \{D\} \implies \{B, C\} \rightarrow \{D\}$)

1. $\{B, C\} \rightarrow \{B\}$ (By Decomposition)
2. $\{B\} \rightarrow \{A\}$ (Given)
3. $\{B, C\} \rightarrow \{A, B, C\}$ (By Augmentation / Transitivity)
4. $\{B, C\} \rightarrow \{A, C\}$ (By Decomposition)
5. $\{A, C\} \rightarrow \{D\}$ (Given)
6. $\{B, C\} \rightarrow \{D\}$ (By Transitivity on 4 and 5)
    

#### Case 3: Dependent Set Substitution ($\{C\} \rightarrow \{A, D\} \implies \{C\} \rightarrow \{B, D\}$)

1. $\{C\} \rightarrow \{A, D\}$ (Given)
2. $\{C\} \rightarrow \{A\}$ (By Decomposition)
3. $\{A\} \rightarrow \{B\}$ (Given)
4. $\{C\} \rightarrow \{A, B, D\}$ (By Augmentation / Transitivity)
5. $\{C\} \rightarrow \{B, D\}$ (By Decomposition)
    
When attributes are interchangeable (e.g., $\text{department\_abbreviation} \leftrightarrow \text{department\_name}$), they generate duplicate pairs of functional dependencies:

6. $\{\text{dept\_abbr}, \text{course\_num}\} \rightarrow \{\text{dept\_abbr}, \text{course\_name}\}$
7. $\{\text{dept\_abbr}, \text{course\_name}\} \rightarrow \{\text{dept\_abbr}, \text{course\_num}\}$
8. $\{\text{dept\_name}, \text{course\_num}\} \rightarrow \{\text{dept\_name}, \text{course\_name}\}$
9. $\{\text{dept\_name}, \text{course\_name}\} \rightarrow \{\text{dept\_name}, \text{course\_num}\}$

- **Mutual Redundancy:** FD #1 and FD #3 are **mutually redundant**—you only need to keep **one** of them in your final schema set. Similarly, FD #2 and FD #4 are mutually redundant, requiring only one.
- **Minimal Cover:** Removing these redundant duplicate pairs simplifies the set of FDs into a **Minimal Functional Dependency Cover**.

 **Common Misconception:** If $A \rightarrow B$ and $B \rightarrow A$ are both true, neither $A \rightarrow B$ nor $B \rightarrow A$ is individually redundant. You **cannot** apply Armstrong's Axioms to eliminate either $A \rightarrow B$ or $B \rightarrow A$ from your dependency set. They are both necessary to establish that $A$ and $B$ are equivalent before applying substitution rules.
