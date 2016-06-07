#!/usr/bin/env python3

import json

with open('moisture.json') as data_file:
    data = json.load(data_file)

print("Number of moisture entries = %d" % len(data["data"]))
