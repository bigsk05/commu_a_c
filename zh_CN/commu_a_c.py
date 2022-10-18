import math
import sys

sgn = lambda n: 1 if n > 0 else -1 if n < 0 else 0
fndeg = lambda d, m, s: d + sgn(d) * (m / 60 + s/ 3600)
fnacs = lambda x: math.pi / 2 - 2 * math.atan(x / (1 + math.sqrt(1 - x * x)))
    
def calc(tlongd, tlatd, rlongd, rlatd):
    ro = 6370

    tlong = math.radians(tlongd)
    tlat = math.radians(tlatd)
    rlong = math.radians(rlongd)
    rlat = math.radians(rlatd)

    if tlong < 0:
        tlong = math.pi * 2 + tlong
    if rlong < 0:
        rlong = math.pi * 2 + rlong
    
    dlong = tlong - rlong
    if abs(dlong) > math.pi:
        dlong = dlong - math.pi * 2 * sgn(dlong)
    
    x = math.sin(tlat) * math.sin(rlat) + math.cos(tlat) * math.cos(rlat) * math.cos(dlong)
    gcd = fnacs(x)

    if gcd < 0.0000001:
        gcd = 0.0000001
    
    if math.cos(tlat) - 0.0000001 <= 0:
        if tlat >= 0:
            btr = 0
        else:
            btr = math.pi
        
        if math.cos(rlat) - 0.0000001 > 0:
            x = (math.sin(tlat) - math.sin(rlat) * math.cos(gcd)) / (math.cos(rlat) * math.sin(gcd))
            brt = fnacs(x)
            if dlong < 0:
                brt = math.pi * 2 - brt
            gcdkm = gcd * ro
            btrd = math.degrees(btr)
            brtd = math.degrees(brt)
        else:
            if rlat >= 0:
                brt = 0
            else:
                brt = math.pi
            gcdkm = gcd * ro
            btrd = math.degrees(btr)
            brtd = math.degrees(brt)
    else:
        x = (math.sin(rlat) - math.sin(tlat) * math.cos(gcd)) / (math.cos(tlat) * math.sin(gcd))
        btr = fnacs(x)

        if dlong > 0:
            btr = math.pi * 2 - btr
            
        if math.cos(rlat) - 0.0000001 > 0:
            x = (math.sin(tlat) - math.sin(rlat) * math.cos(gcd)) / (math.cos(rlat) * math.sin(gcd))
            brt = fnacs(x)
            if dlong < 0:
                brt = math.pi * 2 - brt
            gcdkm = gcd * ro
            btrd = math.degrees(btr)
            brtd = math.degrees(brt)
        else:
            if rlat >= 0:
                brt = 0
            else:
                brt = math.pi
            gcdkm = gcd * ro
            btrd = math.degrees(btr)
            brtd = math.degrees(brt)
    
    return gcdkm, btrd, brtd


def main():
    print("《计算通信方位角和大圆距离程序》")

    while True:
        tmp = input("发信点经度（度，分，秒）=")
        try:
            tmp = [int(t) for t in tmp.split(",")]
            tlongd = fndeg(tmp[0], tmp[1], tmp[2])
        except Exception as e:
            print("错误：", e)
        else:
            break
    while True:
        tmp = input("发信点纬度（度，分，秒）=")
        try:
            tmp = [int(t) for t in tmp.split(",")]
            tlatd = fndeg(tmp[0], tmp[1], tmp[2])
        except Exception as e:
            print("错误：", e)
        else:
            break
    while True:
        tmp = input("收信点经度（度，分，秒）=")
        try:
            tmp = [int(t) for t in tmp.split(",")]
            rlongd = fndeg(tmp[0], tmp[1], tmp[2])
        except Exception as e:
            print("错误：", e)
        else:
            break
    while True:
        tmp = input("收信点纬度（度，分，秒）=")
        try:
            tmp = [int(t) for t in tmp.split(",")]
            rlatd = fndeg(tmp[0], tmp[1], tmp[2])
        except Exception as e:
            print("错误：", e)
        else:
            break

    gcdkm, btrd, brtd = calc(tlongd, tlatd, rlongd, rlatd)

    print("大圆距离为", gcdkm, "(km)")
    d = int(btrd)
    m = int((btrd - d) * 60)
    s = (btrd - d - m / 60) * 3600
    print("发信点对收信点的方位角为", d, "度", m, "分", s, "秒")
    d = int(brtd)
    m = int((brtd - d) * 60)
    s = (brtd - d - m / 60) * 3600
    print("收信点对发信点的方位角为", d, "度", m, "分", s, "秒")

if __name__ == "__main__":
    while True:
        main()
        while True:
            a = input("您是否对其他收信点继续计算？(Y/N)")
            if a.lower() not in ("y", "n"):
                continue
            if a.lower() == "y":
                break
            else:
                sys.exit(0)