## Resolution Manager

Here are notes on how to make a Resolution Manager in Unity. It is noted that before you start you will need two components within the hierarchy in order to begin. The first one being a Drop Down component and the second one being a Toggle Button. These can be created by right clicking the hierarchy and going to `UI > Toggle` as well as `UI> Drop Down`. 

![[Unity_UI_Objects.png]]

Now that we have these two game objects we can create a new script. To do this right click in the projects section where all the games assets are stored then go to `Create > C# Script`

![[Unity_C__Script 1.png]]

As a note. In later versions of the engine such as 6.0x and beyond the location should have changed to be under a `Create > Scripts` section.

***Namespaces (Imports)***
```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
```

Starting off, we need the following imports to allow us to use the correct methods throughout our script. It should be noted that most of these are generated when a new script is created. The three most important imports for this script are `System.Cellectons`, `UnityEngine.UI`, and `TMPro`. These allow us to use Enumerators, manipulate the functions of our toggle button, and most notably manage and create our dropdown.

***Class Definition***
```
public class Settings_Resolution_Manager : MonoBehavior
```

This line marks the script as a MonoBehavior script. Meaning it can be attached to game objects. It will also come prebuilt with an empty `Start()` and `Update()` function.

***Public UI References***
```
public TMP_Dropdown ResDropDown;
public Toggle FullScreenToggle;
```

These calls allow us to have a place to drag and drop our game objects within the inspector

![[Inspector_Window 1.png]]

As a note. I made a separate empty game object where I placed the script. Then I took the two game objects we created earlier and set them as children of the empty one. This allows the hierarchy to look a little more organized and make it possible for the script to find the game objects without any issue.

***Resolution Constraints***
```
const int MIN_WIDTH = 1200;
const int MIN_HEIGHT = 720;
```

These constants will restrict our drop down from listing any non conventional resolutions. I will explain later on why these are necessary. It also ensures the UI remains usable for most of the players.

***Runtime State Variables***
```
Resolutions[] AllResolutions;
bool isFullScreen;
List<Resolution> SelectedResolutionList = new List<Resolution>();
```

These runtime state variables are crucial for a few different things. Including, grabbing the resolutions, toggling our full screen mode, and building our dropdown.

`Resolutions[] AllResolutions;` - As mentioned above gets the Operating System base resolutions. This will vary depending on everyone's system and set up allowing for specific types of resolution results for each player.

`bool isFullScreen` is a simple boolean value that will allow us to toggle the full screen mode of our game.

`List<Resolution> SelectedResolutionList = new List<Resolution>();` is a little more complicated. In short it creates a filtered deduplicated list used by the drop down game object where we will store the resolutions obtained from `AllResolutions`.

***Monitor Tracking and Safety flags***
```
Resolution lastTrackedMonitorRes;
bool isRefreshingUI = false;
```

`Resolution lastTrackedMonitorRes;`
- Tracks the physical monitor resolution
- Allows for the detection of
	- Monitor Swapping
	- Docking/Undocking
	- Laptop -> External Display
	- Resolution changes outside the game
In other words this line will be responsible for most of the resolution tracking involving external factors.

`bool isRefreshingUI = false;`
- Prevents feedback loops
- Stops drop down events from firing while the code updates the UI of the game
This boolean is basically a safety check to prevents potential bugs from occurring

***Start(): Initialization Sequence***
Within the `Start()` method we will add some variables that will help us setup the games resolution on launch.

`lastTrackedMonitorRes = Screen.currentResolution;`

This line will store the current resolution of the monitor to allow the dropdown to be set correctly when the game is launched. This will also come in handy later to detect monitor changes.

```
isFullScreen = Playerprefs.GetInt("FullScreen", 1) == 1;
FullScreenToggle.isOn = isFullScreen;
```

These lines use Player Preferences (PlayerPrefs) in order to save data across game sessions and syncing the UI toggle button immediately. For example allowing for the game to be re launched out of full screen mode if the setting was previously turned off. This will also automatically default to full screen mode if no change was detected on start up.

```
int savedWidth = PlayerPrefs.GetInt("ResWidth", Screen.width);
int savedHeight = PlayerPrefs.GetInt("ResHeight", Screen.height);
```

These lines allow the script to save the width and height of a players chosen resolution. Which is then applied using:

`Screen.SetResolution(savedWidth, savedHeight, isFullScreen);`. 

Additionally, Unity will clamp the resolution values internally if the previously chosen one is unsupported. This is one of the reasons why we chose to clamp the resolution ourselves with `MIN_WIDTH` and `MIN_HEIGHT`. Once the base lines settings are implemented or reloaded when re launched we can call the `RefreshMenuUI` method which will build the drop down, sync player selections, and ensure correct labeling. This will be created later on.

***Update(): Monitor change detection***
Using the other pre-generated function `Update()` we will be able to check for resolution updates per frame during the players time on the settings menu.

```
if (Screen.currentResolution.width != lastTrackedMonitorRes.width ||
	Screen.currentResolution.height != lastTrackedMonitorRes.height)
```

This if statement allows the script to detect changes in monitor size during the game allowing for the list to update while dragging the screen from one monitor to another. The feature mainly allows for smother visuals across a multi-monitor setup.

`lastTrackedMonitorRes = Screen.currentResolution;`
Once the if statement detects a change in the monitors size the script will immediately change the last tracked monitors resolution to the new current one ensuring it stays up to date.

```
CheckAndClampResolution();

StartCoroutine(DelayedRefresh());
```

The final parts of the `Update()` method are two methods we will create later on that allow us to clamp to the new resolution if the size of the previous monitor was larger to the current one. We then use a `Coroutine()` to sync the refresh rate with the monitor change to make sure the dropdown updates at the correct time.

***Delayed Refresh Coroutine***
```
private IEnumerator DelayedRefresh()
{
	yield return new WaitForEndofFrame()'
	RefreshMenuUI();
}
```

This method allows screen resizing to be asynchronous. Without this method the wrong resolution could be displayed and the dropdown menu could show the wrong resolution options.