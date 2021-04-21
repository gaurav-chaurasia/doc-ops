import json
import os
import sys

path = os.path.abspath(f"addons\python\{sys.argv[1]}").replace('\\', '\\\\')
print(path)
with open(path) as json_data:
	for entry in json_data:
	 print(entry)

