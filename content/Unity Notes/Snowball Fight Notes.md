---
"title:": Snowball Fight Notes
draft: true
tags:
---
## 2P Map Creation

In this set of notes We will create a 2 player game. This will slightly involve different code and mechanics than our 2D platformer. This is to accommodate a 2 player environment.

If the assets we use are blurry or don't math perfectly after setting the pixels per unit to 16 there are a few things we can do in order to fix them. First we will need to set extrude edges to zero. We will then set the filter mode in advanced settings to no filter. We will also set the max size to the size of the picture. In this case its 128. It may vary depending on your assets. Lastly we will have to set the compression to none since it is a pixelated image. Once that is all done we can go into the sprite editor and slice the image by cell size. If the assets come with a bullet and a health icon in the main picture be sure to set the box to fit t hem accordingly. The main difference that we will be doing here is that we will need to drag and drop our map into the world instead of making a tile map. This will causes less terrain bugs for this specific game. After you have dragged and dropped your map tiles into your camera view you will need to play around with the x and y values to see how they fit into the camera frame. In this case the x values were: -8.5, 8.5. and the y values were: -4.5, 4.5. Now that you have built your map we will need to add a box collider to one tile for the floor the ceiling, the left wall, and the right wall. After that we will need to stretch them to cover your map. Once the box colliders are created we will need to set the size for the wall colliders to 0.5 on the x and the offset for the left wall to -0.25 on the x, with the offset of the right wall set to 0.25 on the x. The floor and ceiling colliders will be the same values only the values will be on the y axis. We can now create platforms for our game, after you have dragged them in we can help align them up by holding V and selecting a corner to allow it to snap into place. You can create platforms how ever you like along with adding little decorations to spice up the map. Remember to add box colliders to your platforms.
## 2P Player Movement

