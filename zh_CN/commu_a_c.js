const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sgn(n) {
    if (n > 0) {
        return 1;
    } else if (n < 0) {
        return -1;
    } else {
        return 0;
    }
}

function fndeg(d, m, s) {
    return d + sgn(d) * (m / 60 + s/ 3600);
}

function fnacs(x) {
    return Math.PI / 2 - 2 * Math.atan(x / (1 + Math.sqrt(1 - x * x)));
}

function calc(tlongd, tlatd, rlongd, rlatd) {
    let ro = 6370;

    let gcdkm;
    let btrd;
    let brtd;

    let r2d = 180 / Math.PI;
    let d2r = Math.PI / 180;

    let tlong = tlongd * d2r;
    let tlat = tlatd * d2r;
    let rlong = rlongd * d2r;
    let rlat = rlatd * d2r;

    if (tlong < 0) {
        tlong = Math.PI * 2 + tlong;
    }
    if (rlong < 0) {
        rlong = Math.PI * 2 + rlong;
    }
    
    let dlong = tlong - rlong;
    if (Math.abs(dlong) > Math.PI) {
        dlong = dlong - Math.PI * 2 * sgn(dlong);
    }
    
    let x = Math.sin(tlat) * Math.sin(rlat) + Math.cos(tlat) * Math.cos(rlat) * Math.cos(dlong);
    let gcd = fnacs(x);

    if (gcd < 0.0000001) {
        gcd = 0.0000001;
    }
    
    if (Math.cos(tlat) - 0.0000001 <= 0) {
        let btr;
        if (tlat >= 0) {
            btr = 0;
        } else {
            btr = Math.PI;
        }
        
        if (Math.cos(rlat) - 0.0000001 > 0) {
            x = (Math.sin(tlat) - Math.sin(rlat) * Math.cos(gcd)) / (Math.cos(rlat) * Math.sin(gcd));
            let brt = fnacs(x);
            if (dlong < 0) {
                brt = Math.PI * 2 - brt;
            }
            gcdkm = gcd * ro;
            btrd = btr * r2d;
            brtd = brt * r2d;
        } else {
            let brt;
            if (rlat >= 0) {
                brt = 0;
            } else {
                brt = Math.PI;
            }
            gcdkm = gcd * ro;
            btrd = btr * r2d;
            brtd = brt * r2d;
        }
    } else {
        x = (Math.sin(rlat) - Math.sin(tlat) * Math.cos(gcd)) / (Math.cos(tlat) * Math.sin(gcd));
        let btr = fnacs(x);

        if (dlong > 0) {
            btr = Math.PI * 2 - btr;
        }
            
        if (Math.cos(rlat) - 0.0000001 > 0) {
            x = (Math.sin(tlat) - Math.sin(rlat) * Math.cos(gcd)) / (Math.cos(rlat) * Math.sin(gcd));
            let brt = fnacs(x);
            if (dlong < 0) {
                brt = Math.PI * 2 - brt;
            }
            gcdkm = gcd * ro;
            btrd = btr * r2d;
            brtd = brt * r2d;
        } else {
            let brt;
            if (rlat >= 0) {
                brt = 0;
            } else {
                brt = Math.PI;
            }
            gcdkm = gcd * ro;
            btrd = btr * r2d;
            brtd = brt * r2d;
        }
    }
    
    return [gcdkm, btrd, brtd];
}

function main() {
    console.log("《计算通信方位角和大圆距离程序》")

    let gcdkm;
    let btrd;
    let brtd;

    rl.question("发信点经度（度，分，秒）=", function(tmp) {
        tmp = tmp.toString().split(",")
        let tmp2 = [];
        for (let i=0;i<tmp.length;i++) {
            tmp2.push(parseInt(tmp[i]))
        }
        let tlongd = fndeg(tmp2[0], tmp2[1], tmp2[2]);
        rl.question("发信点纬度（度，分，秒）=", function(tmp3) {
            tmp3 = tmp3.toString().split(",")
            let tmp4 = [];
            for (let i=0;i<tmp3.length;i++) {
                tmp4.push(parseInt(tmp3[i]))
            }
            let tlatd = fndeg(tmp4[0], tmp4[1], tmp4[2]);
            rl.question("收信点经度（度，分，秒）=", function(tmp5) {
                tmp5 = tmp5.toString().split(",")
                let tmp6 = [];
                for (let i=0;i<tmp5.length;i++) {
                    tmp6.push(parseInt(tmp5[i]))
                }
                let rlongd = fndeg(tmp6[0], tmp6[1], tmp6[2]);
                rl.question("收信点纬度（度，分，秒）=", function(tmp7) {
                    tmp7 = tmp7.toString().split(",")
                    let tmp8 = [];
                    for (let i=0;i<tmp7.length;i++) {
                        tmp8.push(parseInt(tmp7[i]))
                    }
                    let rlatd = fndeg(tmp8[0], tmp8[1], tmp8[2]);
        
                    let temp = calc(tlongd, tlatd, rlongd, rlatd);
                    let gcdkm = temp[0];
                    let btrd = temp[1];
                    let brtd = temp[2];

                    console.log("大圆距离为" + gcdkm + "(km)");
                    let dt = Math.trunc(btrd);
                    let mt = Math.trunc((btrd - dt) * 60);
                    let st = (btrd - dt - mt / 60) * 3600;
                    console.log("发信点对收信点的方位角为" + dt + "度" + mt + "分" + st + "秒");
                    let dr = Math.trunc(brtd);
                    let mr = Math.trunc((brtd - dr) * 60);
                    let sr = (brtd - dr - mr / 60) * 3600;
                    console.log("收信点对发信点的方位角为" + dr + "度" + mr + "分" + sr + "秒");
                    process.exit(0);
                });
            });
        });
    });
}

main()