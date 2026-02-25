import time
import random
import keyboard
from pynput.mouse import Button, Controller
#random.randint(14,18)
mouse = Controller()
a = 0
while True:
    if keyboard.is_pressed('q'):
        a+=1
        mouse.press(Button.left)
        mouse.release(Button.left)
        print("clicking",a,end='\r')
        time.sleep(float(str("0.0"+str(int(1000/11)))))
    else:
        time.sleep(0.01)

