from time import sleep
from datetime import datetime
from random import randrange
for i in range(0, 500):
    sleep(0.002)
    tmp = datetime.now().microsecond / 10000.0
    print tmp, float(str(tmp)[-1]) * 2 + tmp/10