---
tags:
  - indevelopment
---
> [!warning]+ Disclaimer > Before Starting Dialogue System
>**Disclaimer: Before starting with these set of notes it is assumed that you have a basic knowledge of the Unity Engine/C# scripting and a basic understanding of Object Oriented Programming.**
## Dialogue Script

When doing Object Oriented Programming in Unity there are two main components used in its implementation. The `Instruction(Logic)` and the `Information(Data)`. The instructions are used to tell the scripts and unity engine how to behave/act. While the information is used as a foundation for the instructions supplying the needed data to carry out the requested tasks.

This particular Dialogue script is heavily focused on a visual novel type of game. As such, certain features will be implemented so that they can be set in the editor rather through code  allowing for the developer to decide when certain events take place throughout the story.

Given that this is the `data` section of our dialogue system we start this script by removing the `MonoBehaviour` extension and rather include  `[System.Serializable]` above the class declaration.

```
[System.Serializable]
public class Dialogue
{

}
```

`[System.Serializable]` is used as a way to allow a classes public variables to be edited within the inspector. An important note here is the difference between public variables in Unity and a public class in Unity.:
- When variables are public other scripts are able to "look into" the Dialogue script and access the data within those variables
- When a class is set to `[System.Serializable]` rather than just having a script access the public data members, this allows other scripts to rebuild the class itself when needed allowing for unique interactions and possibilities in each instance

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

In order to display our character's dialogue, decide when this section of dialogue should end, and be able to easily change it in the future we will create an array of strings called `sentences` and a boolean called `isEndpoint`.

```
public string[] sentences;
public bool isEndPoint; // Only check this for the VERY last dialogue of the scene
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

Since we are making a dialogue system we need a variable that will hold the name of the scene we would transition to next following the end of the current dialogue.
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
**Note:** The values set here are for my specific setup and screen width/height. It is best to change them to align with whatever game you are making.

##### Dialogue Next Trigger

We will also need a trigger where we store the next instance of dialogue. This creates a set of linked components where the dialogue will play in order.

```
public DialogueTrigger nextTrigger;
```

Here is the view in the inspector
![[next-dialogue-trigger.png]]

##### Dialogue Choice Data

We have now completed all the data required for the main dialogue system. Next up is the data for the choices system, starting off we need a list in our `Dialogue` class that will reference the new class below it.

```
public List<ChoiceData> choices; // This creates a list in your Inspector
```

Next we need to create a new class called `ChoiceData`. Remember to also add `[System.Serializable]`. 

The reason for creating a new class is partially for organization. However, if we leave all the features in one class we would be stuck with a linear time line and be unable to create branching storylines. By creating a separate class and creating a list of it in the original we are able to continuously add to it as well as deciding which dialogue options need a choice. It is also worth mentioning that C# doesn't matter the declaration order within the script, rather you choose where to use it within other scripts.

| **If you kept it in one class...**                                | **By using a second class (ChoiceData)...**          |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| You'd be limited to 1 choice per line.                            | You can have 0, 1, 2, or 20 choices.                 |
| The Inspector would be a messy list of "Choice1", "Choice2", etc. | The Inspector is an organized, expandable List.      |
| Harder to add choice-specific features later.                     | Easy to add "Choice Costs" or "Choice Sounds" later. |

Next we need to have a variable that will determine what the button says and a trigger to play the next dialogue trigger once a specific choice is selected.

```
public string choiceText;// What the button says (e.g., "Argue" or "Agree")
public DialogueTrigger linkedTrigger; // Where it goes
```

Lastly we will need another string that will once again hold the name of the scene we would want to transition to if we so choose.
```
public string nextSceneName; // Leave blank if staying in the same scene
```

Once these are in place and saved it should look like this in the inspector.

![[choice-element.png]]

## Dialogue Trigger Script

Now that we have the data of our dialogue system we need a way to bridge the gap between the Unity Inspector. This is also how we'll pass that data to the manager, so it can construct and run the dialogue system throughout the game.

To start we need to create a new script called `DialogueTrigger` it is also important to have this class extend `MonoBehaviour` so as it can be attached to a game object.

With this new class we will be able to call the Dialogue class as a public variable. 

```
public Dialogue dialogue;
```

This will rebuild the Dialogue script within the trigger script allowing for all the class to be fully editable for each instance.

Next we'll make a single function that starts this dialogue sequence by handing it off to the Dialogue Manager. This is accomplished by first searching the scene for a game object with a Dialogue Manager script on it. Then, call the Start Dialogue function within that script via an external UI component such as a button or on click, remember to also make the function public so that any class can access it. This all works because `Dialogue` is a serializable class, which is what allows it to be embedded as a public variable inside another script — like this one — giving each instance of `DialogueTrigger` its own fully editable copy of the dialogue data.

## Sprite Display Script

Moving onto the sprite display script this one is used to add more customization to the scenes within the game where sprites can move around the scene depending on what dialogue the game is on. This makes them feel more alive since normally all characters stay in their own positions and don't move aside from sprite swapping.



## Dialogue Manager Script

Input Text Here

## Dialogue Choice Script

Input Text Here (TEST)

## Pop Text Script

Input Text Here
