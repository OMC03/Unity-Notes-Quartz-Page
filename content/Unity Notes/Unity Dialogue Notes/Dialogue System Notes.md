---
tags:
  - indevelopment
---
**Disclaimer: Before starting with these set of notes it is assumed that you have a basic knowledge of the Unity Engine/C# scripting and a basic understanding of Object Oriented Programming.**
## Dialogue Script

When doing Object Oriented Programming in Unity there are to main components used in its implementation. The `Instruction(Logic)` and the `Information(Data)`. The instructions are used to tell the scripts and unity engine to behave/act. While the information i used as a foundation for the instructions supplying the needed data to carry out the requested tasks.

This particular Dialogue script is heavily focused on a visual novel type of game. As such, certain features will be implemented so that they can be set in the editor rather through code  allowing for the developer to decide when certain events take place throughout the story.

Given that this is the `data` section of our dialogue system we start this script by removing the `MonoBehaviour` extension and rather include  `[System.Serializable]` above the class declaration.

```
[System.Serializable]
public class Dialogue
{

}
```

`[System.Serializeable]` is used as a way to allow a classes public variables to be edited within the inspector. An important note here i the difference between public variables in Unity and a public class in Unity.:
- When variables are public other scripts are able to "look into" the Dialogue script and access the data within those variables
- When a class is set to `[System.Serializeable]` rather than just having a script access the public data members, this allows other scripts to rebuild the class itself when needed allowing for unique interactions and possibilities in each instance

| **Feature** | `public` **variable**      | `[System.Serializable]` **class**    |
| ----------- | -------------------------- | ------------------------------------ |
| **Purpose** | Access from other scripts. | Visibility/Saving in the Inspector.  |
| **Scope**   | One single variable.       | An entire blueprint/template.        |
| **Analogy** | A "Public" sign on a door. | A manual on how to rebuild the room. |

Now that the class has been created and is serializable we can start simple by adding a public string variable that will hold the speakers name

```
public string name;
```

##### Dialogue Text

In order to display our characters dialogue, decide when this section of dialogue should end, and be able to easily change it in the future we will create an array of strings called `sentences` and a boolean called `isEndpoint`.

```
public string[] sentences;
public bool isEndPoint;
```

The current setup will provide the following result.

![[Senetences-array.png]]

To make the text box within each array element resemble a dialogue box we need to add a **Decorator**. In Unity a Decorator can modify how the variable is handled by the inspector without changing its type. Without it, you would only be able to see the first line of dialogue you are typing while the rest moves out of sight.

`[TextArea(3, 10)]` Will expand the string array elements text box to be 3 lines high and have it be able to go up to 10 lines before a scroll bar is created. 

The set up should now look as follows

![[expanded-sentences-array.png]]

##### Dialogue Sprites

Lets now move onto the sprite set up. In the game I am making I have four characters:

```
    [Header("Sprite Setup")]
    public Sprite char1;
    public Sprite char2;
    public Sprite char3;
    public Sprite char4;
```

The sprite values will now appear within the script as shown below. We can then be able to later change the sprite based on which instance of dialogue we are on.

![[sprite-setup.png]]
**Note:** The way this dialogue system is being set up allows for multiple instances of the same script to call each other through a series of triggers. This allows for the sprites to be changed depending on which line of dialogue you are on.

##### Dialogue Scene Swap

Since we are making a dialogue system we need a variable that will hold the name of the scene we would transition too next following the end of the current dialogue.
```
public string nextSceneName;
```

Here it what you should have in the inspector

![[scene-swap.png]]

##### Dialogue Sprite Position

We will also be making our character sprites move across the scenes during certain dialogue lines. Preparing for this, we need a default position that the sprites will be in so as to not need to adjust them for every instance:
```
public float char1X = 232f;
public float char2X = -245f;
public float char3X = 735f;
public float char4X = -739f;
```

##### Dialogue Next Trigger

We will also need a trigger where we store the next instance of dialogue. This creates a set of linked components where the dialogue will play in order.

```
public DialogueTrigger nextTrigger;
```

Here is the vie in the inspector
![[next-dialogue-trigger.png]]

##### Dialogue Choice Data

We have now completed all the data required for the main dialogue system. Next up is the data for the choices system, starting off we need a list in our `Dialogue` class that ill reference the new class below it.
```
public List<ChoiceData> choices; // This creates a list in your Inspector
```

Next we need to create a new class called `ChoiceData`. Remember to also add `[System.Serializable]`. 

Next we need to have a variable that will determine what the button says and a trigger to play the next dialogue trigger once a specific choice is selected.

```
public string choiceText;// What the button says (e.g., "Argue" or "Agree")
public DialogueTrigger linkedTrigger; // Where it goes
```

Lastly we will need another string that will once again hold the name of the scene we would want to transition too if we so choose.
```
public string nextSceneName; // Leave blank if staying in the same scene
```

Once these are in place and saved it should look like this in the inspector.

![[choice-element.png]]

## Dialogue Trigger Script

Input Text Here

## Dialogue Choice Script

Input Text Here

## Sprite Display Script

Input Text Here

## Dialogue Manager Script

Input Text Here

## Pop Text Script

Input Text Here
