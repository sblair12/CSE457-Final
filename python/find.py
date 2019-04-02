import sys, math
from pyproj import Proj, transform

inProj = Proj(init='epsg:2204')
outProj = Proj(init='epsg:4326')

r2, r1 = 38.590619, -90.222344
x1, y1 = 899614.2, 1003996
# closest at 2204
c1, c2 = 37.09174906398256, -89.77277633518868
closestVal = 1.5648393433003973

y2, x2 = transform(inProj, outProj, x1 - 107500, y1 + 551000)
print(x2, y2)
print(x2 - r2, y2 - r1)

stuff = [4140, 4152, 4269, 4359, 4360, 4361, 4362, 4617, 4759, 4892, 4893, 4954, 4955, 4956, 4957]

# for i in range(32100, 32200):
#     try:
#         inProj = Proj(init='epsg:' + str(i))
#         y2, x2 = transform(inProj, outProj, x1, y1)
#         calc = (((x2 - r2) ** 2) + ((y2 - r1) ** 2)) ** 0.5
#         if calc < closestVal:
#             c1, c2 = x2, y2
#             print("FOUND at " + str(i))
#             print(c1, c2)
#             closestVal = calc
#     except:
#         print("EXCEPTION at: " + str(i))
