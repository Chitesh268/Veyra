// Veyra catalogue. Prices are indicative ex-showroom values (₹ lakh, ~2025-26); trim prices inside a model's range are
// ESTIMATED (interpolated in trim order) and specs are manufacturer-claimed figures entered from public sources.
// Verify exact trim prices and features with the brand or dealer before buying.
export type Eng = { id: string; name: string; fuel: string; disp: number; cyl: number; ps: number; psRpm: number; nm: number; nmRpm: number; asp: string; eff: number; ev: boolean };
export type PT = { name: string; e: Eng; tx: string; price: number };
export type Feat = { sunroof: number; adas: boolean; cam360: boolean; vent: boolean; wireless: boolean; cruise: boolean };
export type Car = { id: string; brand: string; model: string; body: string; min: number; max: number; wiki: string; seats: number; boot: number; gc: number; ncap: number; len: number; wid: number; hgt: number; wb: number; tank: number; airStd: number; airMax: number; screen: number; f: Feat; vars: PT[] };

// id|name|fuel|cc (kWh for EV)|cyl|ps|ps rpm|Nm|Nm rpm|induction|claimed km/l (CNG km/kg, EV km range)
const E = `k10|1.0L K10C DualJet|Petrol|998|3|66|5500|89|3500|Naturally aspirated|24.4
z12|1.2L Z-Series DualJet|Petrol|1197|3|82|5700|112|4300|Naturally aspirated|24.8
k12|1.2L K12C DualJet|Petrol|1197|4|90|6000|113|4400|Naturally aspirated|22.3
bj1|1.0L Boosterjet|Petrol|998|3|100|5500|148|2000|Turbocharged|21.5
k15|1.5L K15C Smart Hybrid|Petrol|1462|4|103|6000|137|4400|Naturally aspirated + mild hybrid|20.2
j15|1.5L K15B|Petrol|1462|4|105|6000|134|4000|Naturally aspirated|16.9
sh|1.5L Strong Hybrid|Hybrid|1490|3|116|5500|141|3600|Atkinson cycle + electric motor|27.9
hy20|2.0L Hybrid|Hybrid|1987|4|186|6000|188|4400|Atkinson cycle + electric motor|23.2
p20|2.0L Dynamic Force|Petrol|1987|4|174|6600|205|4500|Naturally aspirated|16.1
d24|2.4L GD Diesel|Diesel|2393|4|150|3400|343|1400|Turbocharged|15.1
d28|2.8L GD Diesel|Diesel|2755|4|204|3000|500|1600|Turbocharged|11
hv25|2.5L Hybrid|Hybrid|2487|4|218|5700|221|3600|Atkinson cycle + electric motor|23
hl25|2.5L Hybrid (Lexus)|Hybrid|2487|4|242|6000|239|4300|Atkinson cycle + electric motor|17
h15i|1.5L i-VTEC|Petrol|1498|4|121|6600|145|4300|Naturally aspirated|17.8
h12i|1.2L i-VTEC|Petrol|1199|4|90|6000|110|4800|Naturally aspirated|18.6
ehev|1.5L e:HEV|Hybrid|1498|4|126|6000|253|1000|Atkinson cycle + electric motor|27.1
h12|1.2L Kappa MPi|Petrol|1197|4|83|6000|114|4200|Naturally aspirated|20
h15|1.5L Smartstream MPi|Petrol|1497|4|115|6300|144|4500|Naturally aspirated|17.4
h15t|1.5L Turbo GDi|Petrol|1482|4|160|5500|253|1500|Turbocharged|18.4
h10t|1.0L Turbo GDi|Petrol|998|3|120|6000|172|1500|Turbocharged|18.3
h15d|1.5L U2 CRDi|Diesel|1493|4|116|4000|250|1500|Turbocharged|20
h20d|2.0L R CRDi|Diesel|1995|4|186|4000|416|2000|Turbocharged|15
h20p|2.0L Nu MPi|Petrol|1999|4|156|6200|192|4500|Naturally aspirated|13
k22d|2.2L CRDi|Diesel|2151|4|193|3800|441|1750|Turbocharged|14.9
t12n|1.2L Revotron|Petrol|1199|3|86|6000|115|3300|Naturally aspirated|20.1
t12t|1.2L Revotron Turbo|Petrol|1199|3|120|5500|170|1750|Turbocharged|17.4
t15d|1.5L Revotorq|Diesel|1497|4|115|3750|260|1500|Turbocharged|23.2
t20d|2.0L Kryotec|Diesel|1956|4|170|3750|350|1750|Turbocharged|16.8
m12p|1.2L mPower|Petrol|1197|3|111|5000|200|1500|Turbocharged|18.9
m12t|1.2L mStallion TGDi|Petrol|1197|3|130|5000|230|1500|Turbocharged|18.9
m15d|1.5L mHawk|Diesel|1497|3|117|3750|300|1500|Turbocharged|20.6
m20t|2.0L mStallion TGDi|Petrol|1997|4|200|5000|380|1750|Turbocharged|12
m22a|2.2L mHawk (132 PS)|Diesel|2184|4|132|3750|300|1600|Turbocharged|15.4
m22b|2.2L mHawk (175 PS)|Diesel|2184|4|175|3500|400|1750|Turbocharged|14.4
m22c|2.2L mHawk (185 PS)|Diesel|2184|4|185|3500|450|1750|Turbocharged|16
m20n|2.0L mStallion (Thar)|Petrol|1997|4|152|5000|300|1250|Turbocharged|12.4
m20r|2.0L mStallion (Roxx)|Petrol|1997|4|162|5000|330|1500|Turbocharged|12
m22r|2.2L mHawk (Roxx)|Diesel|2184|4|152|3500|330|1500|Turbocharged|15
g15t|1.5L Turbo|Petrol|1451|4|143|5000|250|1600|Turbocharged|13.8
g15|1.5L VTi-Tech|Petrol|1498|4|110|6000|144|4400|Naturally aspirated|14.8
g20d|2.0L MultiJet II|Diesel|1956|4|170|3750|350|1750|Turbocharged|15.6
g20t|2.0L Twin-turbo Diesel|Diesel|1996|4|218|4000|480|1500|Bi-turbo|11
s10|1.0L TSI|Petrol|999|3|115|5000|178|1750|Turbocharged|19
s15|1.5L TSI Evo|Petrol|1498|4|150|5000|250|1500|Turbo + cylinder deactivation|18.7
s20|2.0L TSI|Petrol|1984|4|190|4200|320|1500|Turbocharged|13.5
s20c|2.0L TSI (265 PS)|Petrol|1984|4|265|5300|400|2000|Turbocharged|12
r8|1.0L Energy (Kwid)|Petrol|999|3|68|5500|91|4250|Naturally aspirated|21.5
r10|1.0L Energy|Petrol|999|3|72|6250|96|3500|Naturally aspirated|20.5
r10t|1.0L Turbo|Petrol|999|3|100|5000|160|2800|Turbocharged|19
c12|1.2L PureTech 82|Petrol|1199|3|82|5750|115|3750|Naturally aspirated|19.8
c12t|1.2L PureTech 110|Petrol|1199|3|110|5500|190|1750|Turbocharged|18.7
mb15|1.5L Mild-hybrid (M252)|Petrol|1496|4|204|5800|300|1800|Turbo + 48V mild hybrid|14
mb20|2.0L Mild-hybrid (M254)|Petrol|1999|4|258|5800|400|1800|Turbo + 48V mild hybrid|12
mb20d|2.0L Diesel (OM654)|Diesel|1993|4|197|3600|440|1800|Turbocharged|16
mb30|3.0L Inline-6 (M256)|Petrol|2999|6|367|5500|500|1800|Turbo + 48V mild hybrid|9
mb30d|3.0L Inline-6 Diesel (OM656)|Diesel|2989|6|367|3600|750|1200|Turbocharged|11
bm20a|2.0L B48 (190 PS)|Petrol|1998|4|190|5000|280|1500|Turbocharged|14
bm20|2.0L B48 (258 PS)|Petrol|1998|4|258|5000|400|1600|Turbocharged|13
bm20d|2.0L B47 Diesel|Diesel|1995|4|190|4000|400|1750|Turbocharged|18
bm30|3.0L B58 Inline-6|Petrol|2998|6|381|5500|520|1850|Turbocharged|10
bm30d|3.0L B57 Inline-6 Diesel|Diesel|2993|6|286|4000|650|1500|Turbocharged|13
au55|3.0L V6 TFSI|Petrol|2995|6|340|5200|500|1370|Turbocharged|9.5
vo|2.0L B5 Mild-hybrid|Petrol|1969|4|250|5400|360|1800|Turbo + 48V mild hybrid|12.5
lr20d|2.0L Ingenium Diesel|Diesel|1997|4|204|3750|430|1750|Turbo + mild hybrid|13
lr30d|3.0L Ingenium Diesel (D300)|Diesel|2997|6|300|4000|650|1500|Turbo + mild hybrid|11
po20|2.0L Turbo|Petrol|1984|4|265|5000|400|1800|Turbocharged|10
ev19|19.2 kWh motor|Electric|19.2|0|61|0|110|0|Permanent-magnet motor|250
ev24|24 kWh motor|Electric|24|0|75|0|114|0|Permanent-magnet motor|315
ev25|25 kWh motor|Electric|25|0|82|0|114|0|Permanent-magnet motor|265
ev35|35 kWh motor|Electric|35|0|122|0|190|0|Permanent-magnet motor|421
ev45|45 kWh motor|Electric|45|0|144|0|215|0|Permanent-magnet motor|489
evmc|17.3 kWh motor|Electric|17.3|0|42|0|110|0|Permanent-magnet motor|230
evw|38 kWh motor|Electric|38|0|136|0|200|0|Permanent-magnet motor|332
evzs|50.3 kWh motor|Electric|50.3|0|176|0|280|0|Permanent-magnet motor|461
evat|60.5 kWh motor|Electric|60.5|0|204|0|310|0|Permanent-magnet motor|521
evem|71.8 kWh motor|Electric|71.8|0|204|0|310|0|Permanent-magnet motor|530
evse|82.5 kWh dual motor|Electric|82.5|0|530|0|670|0|Dual permanent-magnet motors (AWD)|580
evb59|59 kWh motor|Electric|59|0|231|0|380|0|Permanent-magnet motor|535
evb79|79 kWh motor|Electric|79|0|286|0|380|0|Permanent-magnet motor|682
evc42|42 kWh motor|Electric|42|0|135|0|200|0|Permanent-magnet motor|390
evc51|51.4 kWh motor|Electric|51.4|0|171|0|255|0|Permanent-magnet motor|473
evi4|83.9 kWh motor|Electric|83.9|0|340|0|430|0|Permanent-magnet motor|590
ck10|1.0L K10C S-CNG|CNG|998|3|57|5300|82|3400|Naturally aspirated + factory CNG|33.85
cz12|1.2L Z-Series S-CNG|CNG|1197|3|69|5700|102|2900|Naturally aspirated + factory CNG|32.85
ck12|1.2L K12C S-CNG|CNG|1197|4|77|6000|98|4300|Naturally aspirated + factory CNG|30.61
cfx|1.2L K12C S-CNG (SUV)|CNG|1197|4|77|6000|98|4300|Naturally aspirated + factory CNG|28.51
ck15|1.5L K15C S-CNG|CNG|1462|4|88|5500|121|4200|Naturally aspirated + factory CNG|26.1
eeco|1.2L G12B|Petrol|1197|4|81|6000|104|3000|Naturally aspirated|19.7
ceco|1.2L G12B S-CNG|CNG|1197|4|71|6000|95|3500|Naturally aspirated + factory CNG|26.78
ch12|1.2L Kappa Bi-Fuel|CNG|1197|4|69|6000|95|4000|Naturally aspirated + factory CNG|27.1
ct12|1.2L Revotron iCNG|CNG|1199|3|73|6000|95|3500|Naturally aspirated + factory CNG|26.5
ct12t|1.2L Revotron Turbo iCNG|CNG|1199|3|100|5000|170|1750|Turbocharged + factory CNG|24
p27|2.7L Petrol|Petrol|2694|4|166|5200|245|4000|Naturally aspirated|10
m22d|2.2L mHawk (155 PS)|Diesel|2184|4|155|3500|360|1750|Turbocharged|16
mn100|1.5L mHawk D100|Diesel|1493|3|100|3750|260|1750|Turbocharged|17.3
mn75|1.5L mHawk D75|Diesel|1493|3|75|3600|210|1600|Turbocharged|16
g20s|2.0L Diesel (163 PS)|Diesel|1996|4|163|3750|375|1500|Turbocharged|13
lr20p|2.0L Ingenium P300|Petrol|1997|4|300|5500|400|1500|Turbocharged|9
jw|2.0L GME T4 Turbo|Petrol|1995|4|270|5250|400|3000|Turbocharged|11
evi5|72.6 kWh motor|Electric|72.6|0|217|0|350|0|Permanent-magnet motor|631
evc45|45 kWh motor|Electric|45|0|150|0|215|0|Permanent-magnet motor|502
evc55|55 kWh motor|Electric|55|0|167|0|215|0|Permanent-magnet motor|585
evh65|65 kWh motor|Electric|65|0|238|0|315|0|Permanent-magnet motor|538
evh75|75 kWh dual motor|Electric|75|0|313|0|504|0|Dual motors (AWD)|627
evat49|49.9 kWh motor|Electric|49.9|0|204|0|310|0|Permanent-magnet motor|468
evem55|55.4 kWh motor|Electric|55.4|0|163|0|310|0|Permanent-magnet motor|420
evse61|61.4 kWh motor|Electric|61.4|0|204|0|310|0|Permanent-magnet motor|510
evse82|82.5 kWh single motor|Electric|82.5|0|313|0|360|0|Permanent-magnet motor|650
evec3|29.2 kWh motor|Electric|29.2|0|57|0|143|0|Permanent-magnet motor|320
evix1|66.4 kWh motor|Electric|66.4|0|204|0|250|0|Permanent-magnet motor|531`;
export const ENGINES: Record<string, Eng> = {};
E.split("\n").forEach(l => { const [id, name, fuel, d, c, ps, pr, nm, nr, asp, eff] = l.split("|"); ENGINES[id] = { id, name, fuel, disp: +d, cyl: +c, ps: +ps, psRpm: +pr, nm: +nm, nmRpm: +nr, asp, eff: +eff, ev: fuel === "Electric" }; });
ENGINES["s20b"] = { ...ENGINES["s20"], id: "s20b", name: "2.0L TSI (204 PS)", ps: 204, psRpm: 4500 };

// brand|model|body|min|max (₹ lakh)|wikipedia title|seats|boot L|ground clearance mm|NCAP stars (0 = unknown)|length|width|height|wheelbase mm|tank L|airbags std/max|screen inch|flags(sunroof 0/1/2, ADAS, 360 cam, vented seats, wireless charger, cruise: top trim)|trims (Name:engine/gearbox, cheapest first)
const M = `Maruti Suzuki|Alto K10|Hatchback|4.23|6.21|Maruti_Suzuki_Alto|5|214|180|2|3530|1490|1520|2380|27|2/2|7|000000|Std:k10/M;LXi:k10/M;VXi:k10/M;VXi+:k10/M;VXi AGS:k10/A;VXi+ AGS:k10/A;LXi S-CNG:ck10/M;VXi S-CNG:ck10/M
Maruti Suzuki|S-Presso|Hatchback|4.26|6.12|Maruti_Suzuki_S-Presso|5|240|180|1|3565|1520|1567|2380|27|2/2|7|000000|Std:k10/M;LXi:k10/M;VXi:k10/M;VXi+:k10/M;VXi AGS:k10/A;VXi+ AGS:k10/A;LXi CNG:ck10/M;VXi CNG:ck10/M
Maruti Suzuki|Celerio|Hatchback|5.64|7.37|Maruti_Suzuki_Celerio|5|313|170|0|3695|1655|1555|2435|32|2/2|7|000000|LXi:k10/M;VXi:k10/M;ZXi:k10/M;ZXi+:k10/M;VXi AMT:k10/A;ZXi AMT:k10/A;ZXi+ AMT:k10/A;VXi CNG:ck10/M
Maruti Suzuki|Wagon R|Hatchback|5.54|7.38|Maruti_Suzuki_Wagon_R|5|341|165|1|3655|1620|1675|2435|32|2/6|7|000000|LXi 1.0:k10/M;VXi 1.0:k10/M;ZXi 1.2:k12/M;ZXi+ 1.2:k12/M;VXi 1.0 AMT:k10/A;ZXi 1.2 AMT:k12/A;LXi CNG:ck10/M;VXi CNG:ck10/M
Maruti Suzuki|Eeco|MPV|5.32|6.58|Maruti_Suzuki_Eeco|5|0|160|0|3675|1475|1825|2350|40|2/2|0|000000|5 Seater Std:eeco/M;5 Seater AC:eeco/M;7 Seater:eeco/M;5 Seater AC CNG:ceco/M
Maruti Suzuki|Swift|Hatchback|6.49|9.64|Suzuki_Swift|5|265|163|0|3860|1735|1520|2450|37|6/6|9|000001|LXi:z12/M;VXi:z12/M;VXi AMT:z12/A;ZXi:z12/M;ZXi AMT:z12/A;ZXi+:z12/M;ZXi+ AMT:z12/A;VXi S-CNG:cz12/M;ZXi S-CNG:cz12/M
Maruti Suzuki|Dzire|Sedan|6.84|10.19|Suzuki_Dzire|5|382|163|5|3995|1735|1525|2450|37|6/6|9|101001|LXi:z12/M;VXi:z12/M;VXi AMT:z12/A;ZXi:z12/M;ZXi AMT:z12/A;ZXi+:z12/M;ZXi+ AMT:z12/A;VXi CNG:cz12/M;ZXi CNG:cz12/M
Maruti Suzuki|Baleno|Hatchback|6.7|9.92|Maruti_Suzuki_Baleno|5|318|170|0|3990|1745|1500|2520|37|6/6|9|001001|Sigma:k12/M;Delta:k12/M;Delta AMT:k12/A;Zeta:k12/M;Zeta AMT:k12/A;Alpha:k12/M;Alpha AMT:k12/A;Delta CNG:ck12/M;Zeta CNG:ck12/M
Maruti Suzuki|Fronx|SUV|7.52|13.04|Maruti_Suzuki_Fronx|5|308|190|0|3995|1765|1550|2520|37|6/6|9|001001|Sigma:k12/M;Delta:k12/M;Delta AMT:k12/A;Delta+:k12/M;Zeta Turbo:bj1/M;Zeta Turbo AT:bj1/A;Alpha Turbo:bj1/M;Alpha Turbo AT:bj1/A;Sigma CNG:cfx/M;Delta CNG:cfx/M
Maruti Suzuki|Brezza|SUV|8.69|14.14|Maruti_Suzuki_Brezza|5|328|198|4|3995|1790|1685|2500|48|6/6|9|101001|LXi:k15/M;VXi:k15/M;ZXi:k15/M;ZXi AT:k15/A;ZXi+:k15/M;ZXi+ AT:k15/A;VXi CNG:ck15/M;ZXi CNG:ck15/M
Maruti Suzuki|Ertiga|MPV|8.97|13.25|Maruti_Suzuki_Ertiga|7|209|180|0|4395|1735|1690|2740|45|2/4|7|000001|LXi:k15/M;VXi:k15/M;ZXi:k15/M;ZXi+:k15/M;VXi AT:k15/A;ZXi AT:k15/A;ZXi+ AT:k15/A;VXi CNG:ck15/M;ZXi CNG:ck15/M
Maruti Suzuki|XL6|MPV|11.84|14.87|Maruti_Suzuki_XL6|6|209|180|0|4445|1775|1755|2740|45|2/4|7|000001|Zeta:k15/M;Alpha:k15/M;Alpha+:k15/M;Zeta AT:k15/A;Alpha AT:k15/A;Alpha+ AT:k15/A
Maruti Suzuki|Grand Vitara|SUV|10.77|19.72|Maruti_Suzuki_Grand_Vitara|5|373|210|0|4345|1795|1645|2600|45|6/6|9|201001|Sigma:k15/M;Delta:k15/M;Delta AT:k15/A;Zeta:k15/M;Zeta AT:k15/A;Alpha:k15/M;Alpha AT:k15/A;Delta CNG:ck15/M;Zeta CNG:ck15/M;Zeta+ Hybrid:sh/A;Alpha+ Hybrid:sh/A
Maruti Suzuki|Victoris|SUV|10.5|19.99|Maruti_Suzuki_Victoris|5|373|210|5|4360|1795|1655|2600|45|6/6|10.1|211011|LXi:k15/M;VXi:k15/M;ZXi:k15/M;ZXi+:k15/M;ZXi AT:k15/A;ZXi+ AT:k15/A;VXi CNG:ck15/M;ZXi CNG:ck15/M;ZXi+ Hybrid:sh/A
Maruti Suzuki|Jimny|SUV|12.32|14.45|Suzuki_Jimny|4|208|210|3|3985|1645|1720|2590|40|6/6|9|000001|Zeta:j15/M;Alpha:j15/M;Zeta AT:j15/A;Alpha AT:j15/A
Maruti Suzuki|Invicto|MPV|25.51|29.22|Maruti_Suzuki_Invicto|7|239|185|0|4755|1850|1795|2850|52|6/6|10.1|201111|Zeta+ 7S:hy20/A;Zeta+ 8S:hy20/A;Alpha+ 7S:hy20/A;Alpha+ 8S:hy20/A
Toyota|Glanza|Hatchback|6.9|10|Toyota_Glanza|5|318|170|0|3990|1745|1500|2520|37|6/6|9|001001|E:k12/M;S:k12/M;S AMT:k12/A;G:k12/M;G AMT:k12/A;V:k12/M;V AMT:k12/A;S CNG:ck12/M;G CNG:ck12/M
Toyota|Urban Cruiser Taisor|SUV|7.7|13.04|Toyota_Urban_Cruiser_Taisor|5|308|190|0|3995|1765|1550|2520|37|6/6|9|001001|E:k12/M;S:k12/M;S AMT:k12/A;G:k12/M;V Turbo:bj1/M;V Turbo AT:bj1/A;S+ CNG:cfx/M
Toyota|Rumion|MPV|10.44|13.8|Toyota_Rumion|7|209|180|0|4420|1735|1690|2740|45|2/4|7|000001|E:k15/M;S:k15/M;G:k15/M;V:k15/M;S AT:k15/A;V AT:k15/A;S CNG:ck15/M
Toyota|Urban Cruiser Hyryder|SUV|11.34|19.99|Toyota_Urban_Cruiser_Hyryder|5|373|210|0|4365|1795|1645|2600|45|6/6|9|201001|E:k15/M;S:k15/M;G:k15/M;S AT:k15/A;G AT:k15/A;S CNG:ck15/M;G CNG:ck15/M;S Hybrid:sh/A;G Hybrid:sh/A;V Hybrid:sh/A
Toyota|Innova Crysta|MPV|19.99|26.3|Toyota_Innova|7|300|178|0|4735|1830|1795|2750|55|3/7|8|000001|GX 7S:d24/M;GX+ 7S:d24/M;VX 7S:d24/M;ZX 7S:d24/M;ZX 7S AT:d24/A
Toyota|Innova Hycross|MPV|19.94|31.34|Toyota_Innova_HyCross|7|300|185|5|4755|1845|1795|2850|52|6/6|10.1|211111|G 7S Petrol:p20/A;GX 7S Petrol:p20/A;VX Hybrid:hy20/A;VX(O) Hybrid:hy20/A;ZX Hybrid:hy20/A;ZX(O) Hybrid:hy20/A
Toyota|Fortuner|SUV|33.78|51.94|Toyota_Fortuner|7|296|225|5|4795|1855|1835|2745|80|7/7|8|001001|4x2 Petrol MT:p27/M;4x2 Petrol AT:p27/A;4x2 Diesel MT:d28/M;4x2 Diesel AT:d28/A;4x4 Diesel MT:d28/M;4x4 Diesel AT:d28/A;Legender 4x2 AT:d28/A;Legender 4x4 AT:d28/A;GR-S 4x4 AT:d28/A
Toyota|Hilux|Pickup|30.4|37.9|Toyota_Hilux|5|0|216|0|5325|1855|1815|3085|80|7/7|8|000001|Standard 4x4 MT:d28/M;High 4x4 MT:d28/M;High 4x4 AT:d28/A
Toyota|Camry|Sedan|48|48|Toyota_Camry|5|493|140|5|4885|1840|1445|2825|50|9/9|9|110011|Hybrid:hv25/A
Hyundai|Grand i10 Nios|Hatchback|5.98|8.62|Hyundai_Grand_i10_Nios|5|260|165|2|3815|1680|1520|2450|37|6/6|8|000000|Era:h12/M;Magna:h12/M;Magna AMT:h12/A;Sportz:h12/M;Sportz AMT:h12/A;Asta:h12/M;Magna CNG:ch12/M;Sportz CNG:ch12/M
Hyundai|Aura|Sedan|6.54|9.11|Hyundai_Aura|5|402|165|0|3995|1680|1520|2450|37|6/6|8|000000|E:h12/M;S:h12/M;SX:h12/M;SX+ AMT:h12/A;S CNG:ch12/M;SX CNG:ch12/M
Hyundai|Exter|SUV|6.2|10.43|Hyundai_Exter|5|391|185|0|3815|1710|1631|2450|37|6/6|8|100000|EX:h12/M;S:h12/M;SX:h12/M;SX(O):h12/M;S AMT:h12/A;SX AMT:h12/A;SX(O) Connect AMT:h12/A;S CNG:ch12/M;SX CNG:ch12/M
Hyundai|i20|Hatchback|7.04|11.25|Hyundai_i20|5|311|170|0|3995|1775|1505|2580|37|6/6|10.25|100000|Magna:h12/M;Sportz:h12/M;Sportz IVT:h12/A;Asta:h12/M;Asta(O):h12/M;Asta(O) IVT:h12/A;N Line N6:h10t/M;N Line N8 DCT:h10t/A
Hyundai|Venue|SUV|7.94|13.53|Hyundai_Venue|5|350|195|0|3995|1770|1617|2500|45|6/6|12.3|200001|E:h12/M;S:h12/M;S(O):h12/M;SX:h12/M;SX(O):h12/M;S(O) Turbo iMT:h10t/M;SX Turbo DCT:h10t/A;SX(O) Turbo DCT:h10t/A;S Diesel:h15d/M;SX Diesel:h15d/M;SX(O) Diesel:h15d/M
Hyundai|Verna|Sedan|11.07|17.55|Hyundai_Verna|5|528|165|5|4535|1765|1475|2670|45|6/6|10.25|110111|EX:h15/M;S:h15/M;SX:h15/M;SX IVT:h15/A;SX(O):h15/M;SX(O) IVT:h15/A;SX(O) Turbo DCT:h15t/A
Hyundai|Creta|SUV|11.11|20.5|Hyundai_Creta|5|433|190|3|4330|1790|1635|2610|50|6/6|10.25|211111|E:h15/M;EX:h15/M;S:h15/M;S(O):h15/M;SX:h15/M;SX Tech:h15/M;SX(O):h15/M;SX(O) IVT:h15/A;S(O) Diesel:h15d/M;SX(O) Diesel:h15d/M;SX(O) Diesel AT:h15d/A;SX(O) Turbo DCT:h15t/A;N Line N8 Turbo DCT:h15t/A
Hyundai|Creta Electric|SUV|17.99|24.38|Hyundai_Creta|5|433|190|0|4330|1790|1635|2610|0|6/6|10.25|211111|Executive:evc42/A;Smart:evc42/A;Smart(O):evc42/A;Premium:evc42/A;Smart(O) LR:evc51/A;Premium LR:evc51/A;Excellence LR:evc51/A
Hyundai|Alcazar|SUV|14.99|21.55|Hyundai_Alcazar|7|180|200|0|4560|1800|1710|2760|50|6/6|10.25|211111|Executive Diesel MT:h15d/M;Prestige Turbo DCT:h15t/A;Prestige Diesel MT:h15d/M;Platinum Turbo DCT:h15t/A;Platinum Diesel AT:h15d/A;Signature(O) Turbo DCT:h15t/A;Signature(O) Diesel AT:h15d/A
Hyundai|Tucson|SUV|29.27|36.04|Hyundai_Tucson|5|539|181|0|4630|1865|1665|2755|54|6/6|10.25|211111|Platinum Petrol AT:h20p/A;Signature Petrol AT:h20p/A;Platinum Diesel AT:h20d/A;Signature Diesel AT 4WD:h20d/A
Hyundai|Ioniq 5|SUV|46.3|46.3|Hyundai_Ioniq_5|5|584|163|5|4635|1890|1605|3000|0|6/6|12.3|211111|Standard:evi5/A
Kia|Sonet|SUV|7.99|15.69|Kia_Sonet|5|385|205|3|3995|1790|1642|2500|45|6/6|10.25|110111|HTE:h12/M;HTK:h12/M;HTK+:h12/M;HTX:h12/M;HTX+ Turbo iMT:h10t/M;HTX Turbo DCT:h10t/A;GTX+ Turbo DCT:h10t/A;HTE Diesel:h15d/M;HTK+ Diesel:h15d/M;HTX Diesel AT:h15d/A;GTX+ Diesel AT:h15d/A
Kia|Seltos|SUV|10.79|19.99|Kia_Seltos|5|433|190|3|4365|1800|1645|2610|50|6/6|10.25|211111|HTE:h15/M;HTK:h15/M;HTK+:h15/M;HTX:h15/M;HTX IVT:h15/A;HTE(O) Diesel:h15d/M;HTK+ Diesel:h15d/M;HTX Diesel:h15d/M;HTX+ Diesel AT:h15d/A;GTX+ Turbo DCT:h15t/A;X-Line Turbo DCT:h15t/A;X-Line Diesel AT:h15d/A
Kia|Carens|MPV|10.52|19|Kia_Carens|7|216|195|3|4540|1800|1708|2780|45|6/6|10.25|100011|HTE:h15/M;HTK:h15/M;HTK+:h15/M;HTX:h15/M;HTK+ Diesel:h15d/M;HTX Diesel:h15d/M;HTX+ Diesel AT:h15d/A;Luxury Plus Turbo DCT:h15t/A;Luxury Plus Diesel AT:h15d/A
Kia|Carnival|MPV|63.9|63.9|Kia_Carnival|7|627|172|0|5155|1995|1775|3090|72|8/8|12.3|211111|Limousine Plus:k22d/A
Tata|Tiago|Hatchback|4.99|8.54|Tata_Tiago|5|242|170|4|3765|1677|1535|2400|35|2/2|10.25|000000|XE:t12n/M;XM:t12n/M;XT:t12n/M;XT(O):t12n/M;XZ:t12n/M;XZ+:t12n/M;XT AMT:t12n/A;XZ+ AMT:t12n/A;XM CNG:ct12/M;XT CNG:ct12/M;XZ+ CNG:ct12/M;XZ+ CNG AMT:ct12/A
Tata|Tigor|Sedan|5.99|9.5|Tata_Tigor|5|419|170|4|3993|1677|1532|2450|35|2/2|7|000000|XE:t12n/M;XM:t12n/M;XZ:t12n/M;XZ+:t12n/M;XZA+ AMT:t12n/A;XM CNG:ct12/M;XZ CNG:ct12/M;XZ+ CNG:ct12/M
Tata|Altroz|Hatchback|6.5|11.16|Tata_Altroz|5|345|165|5|3990|1755|1523|2501|44|2/6|10.25|100001|Smart:t12n/M;Pure:t12n/M;Creative:t12n/M;Creative S:t12n/M;Accomplished S:t12n/M;Pure Diesel:t15d/M;Creative Diesel:t15d/M;Accomplished S Diesel:t15d/M;Pure CNG:ct12/M;Creative CNG:ct12/M;Racer R3 Turbo:t12t/M
Tata|Punch|SUV|5.5|10.32|Tata_Punch|5|366|187|5|3827|1742|1615|2445|37|2/6|10.25|100001|Smart:t12n/M;Pure:t12n/M;Adventure:t12n/M;Accomplished:t12n/M;Creative:t12n/M;Pure AMT:t12n/A;Adventure AMT:t12n/A;Creative AMT:t12n/A;Pure CNG:ct12/M;Adventure CNG:ct12/M;Accomplished CNG:ct12/M;Creative CNG:ct12/M
Tata|Nexon|SUV|7.32|14.99|Tata_Nexon|5|382|208|5|3995|1804|1620|2498|44|6/6|10.25|201111|Smart:t12t/M;Smart+:t12t/M;Pure:t12t/M;Pure+:t12t/M;Creative:t12t/M;Pure+ AMT:t12t/A;Creative AMT:t12t/A;Fearless+ PS DCA:t12t/A;Smart Diesel:t15d/M;Pure Diesel:t15d/M;Creative Diesel:t15d/M;Fearless Diesel AMT:t15d/A;Pure CNG:ct12t/M;Creative CNG:ct12t/M;Fearless+ PS CNG:ct12t/M
Tata|Curvv|SUV|9.99|17.69|Tata_Curvv|5|500|190|5|4308|1810|1630|2560|44|6/6|12.3|211111|Smart:t12t/M;Pure+:t12t/M;Creative:t12t/M;Creative DCA:t12t/A;Accomplished DCA:t12t/A;Smart Diesel:t15d/M;Pure+ Diesel:t15d/M;Creative Diesel AMT:t15d/A;Accomplished Diesel DCA:t15d/A
Tata|Harrier|SUV|14.99|25.89|Tata_Harrier|5|445|205|5|4605|1922|1718|2741|50|6/6|12.3|211111|Smart:t20d/M;Pure:t20d/M;Pure+:t20d/M;Adventure:t20d/M;Fearless:t20d/M;Adventure+ AT:t20d/A;Fearless AT:t20d/A;Fearless+ AT:t20d/A;Stealth AT:t20d/A
Tata|Safari|SUV|15.5|27.25|Tata_Safari|7|73|205|5|4668|1922|1795|2741|50|6/6|12.3|211111|Smart:t20d/M;Pure:t20d/M;Adventure:t20d/M;Accomplished:t20d/M;Adventure+ AT:t20d/A;Accomplished AT:t20d/A;Accomplished+ AT:t20d/A
Tata|Tiago EV|Hatchback|7.99|11.14|Tata_Tiago|5|240|165|4|3769|1677|1535|2400|0|2/2|10.25|000000|XE MR:ev19/A;XT MR:ev19/A;XT LR:ev24/A;XZ+ LR:ev24/A;XZ+ Tech Lux LR:ev24/A
Tata|Punch EV|SUV|9.99|14.44|Tata_Punch|5|366|190|5|3857|1742|1633|2445|0|6/6|10.25|100001|Smart:ev25/A;Smart+:ev25/A;Adventure:ev25/A;Empowered:ev25/A;Adventure LR:ev35/A;Empowered LR:ev35/A;Empowered+ LR:ev35/A
Tata|Nexon EV|SUV|12.49|17.19|Tata_Nexon|5|350|190|5|3995|1804|1620|2498|0|6/6|12.3|201111|Creative 45:ev45/A;Fearless 45:ev45/A;Empowered 45:ev45/A;Empowered+ 45:ev45/A
Tata|Curvv EV|SUV|17.49|21.99|Tata_Curvv|5|500|186|5|4310|1810|1637|2560|0|6/6|12.3|211111|Creative 45:evc45/A;Accomplished 45:evc45/A;Accomplished+ 55:evc55/A;Empowered+ 55:evc55/A
Tata|Harrier EV|SUV|21.49|30.23|Tata_Harrier|5|502|205|5|4607|1922|1740|2741|0|6/6|14.5|211111|Adventure 65:evh65/A;Fearless+ 65:evh65/A;Fearless+ 75:evh75/A;Empowered 75 AWD:evh75/A
Mahindra|Thar|SUV|11.5|17.6|Mahindra_Thar|4|0|226|4|3985|1820|1850|2450|57|2/2|9|000001|AX(O) RWD Diesel MT:mn100/M;LX RWD Diesel AT:mn100/A;AX(O) 4x4 Diesel MT:m22a/M;LX 4x4 Diesel MT:m22a/M;LX 4x4 Diesel AT:m22a/A;AX(O) 4x4 Petrol MT:m20n/M;LX 4x4 Petrol MT:m20n/M;LX 4x4 Petrol AT:m20n/A
Mahindra|Thar Roxx|SUV|12.99|23.09|Mahindra_Thar_Roxx|5|447|200|5|4428|1870|1923|2850|57|6/6|10.25|211111|MX1 Petrol MT:m20r/M;MX1 Diesel MT:m22r/M;MX3 Petrol MT:m20r/M;MX3 Diesel MT:m22r/M;MX3 Diesel AT:m22r/A;MX5 Petrol AT:m20r/A;MX5 Diesel AT:m22r/A;AX7L Petrol AT:m20r/A;AX7L Diesel 4x4 AT:m22r/A
Mahindra|XUV 3XO|SUV|7.52|15.8|Mahindra_XUV_3XO|5|364|201|5|3990|1821|1647|2600|42|6/6|10.25|211001|MX1:m12p/M;MX2:m12p/M;MX2 Pro:m12p/M;MX3:m12p/M;AX5:m12p/M;AX5 L:m12p/M;MX3 TGDi:m12t/M;AX7 TGDi AT:m12t/A;AX7L TGDi AT:m12t/A;MX2 Diesel:m15d/M;AX5 Diesel:m15d/M;AX7L Diesel AT:m15d/A
Mahindra|XUV700|SUV|13.99|25.74|Mahindra_XUV700|7|240|200|5|4695|1890|1755|2750|60|7/7|10.25|211111|MX Petrol:m20t/M;AX3 Petrol:m20t/M;AX5 Petrol:m20t/M;AX7 Petrol AT:m20t/A;MX Diesel:m22d/M;AX5 Diesel:m22d/M;AX7 Diesel AT:m22c/A;AX7L Diesel AT:m22c/A;AX7L Diesel AT AWD:m22c/A
Mahindra|Scorpio-N|SUV|13.99|24.89|Mahindra_Scorpio|7|460|187|5|4662|1917|1849|2750|57|6/6|8|101001|Z2 Petrol MT:m20t/M;Z4 Petrol MT:m20t/M;Z8 Petrol AT:m20t/A;Z2 Diesel MT:m22a/M;Z4 Diesel MT:m22a/M;Z6 Diesel MT:m22a/M;Z8 Diesel MT:m22b/M;Z8 Diesel AT:m22b/A;Z8L Diesel 4x4 AT:m22b/A
Mahindra|Scorpio Classic|SUV|13.62|17.42|Mahindra_Scorpio|7|0|180|0|4456|1820|1995|2680|60|2/2|9|000000|S:m22a/M;S11:m22a/M
Mahindra|Bolero|SUV|9.79|10.91|Mahindra_Bolero|7|370|180|0|3995|1745|1880|2680|60|2/2|0|000000|B4:mn75/M;B6:mn75/M;B6(O):mn75/M
Mahindra|Bolero Neo|SUV|8.49|10|Mahindra_Bolero_Neo|7|384|160|0|3995|1795|1817|2680|55|2/2|9|000000|N4:mn100/M;N8:mn100/M;N10:mn100/M;N10(O):mn100/M
Mahindra|BE 6|SUV|18.9|26.9|Mahindra_BE_6|5|455|207|5|4371|1907|1627|2775|0|7/7|12.3|211111|Pack One:evb59/A;Pack One Above:evb59/A;Pack Two:evb59/A;Pack Three Select:evb79/A;Pack Three:evb79/A
Mahindra|XEV 9e|SUV|21.9|31.25|Mahindra_XEV_9e|5|663|207|5|4789|1907|1694|2775|0|7/7|12.3|211111|Pack One Above:evb59/A;Pack Two:evb59/A;Pack Three Select:evb79/A;Pack Three:evb79/A
Honda|Amaze|Sedan|8.1|11.2|Honda_Amaze|5|416|172|0|3995|1733|1500|2470|35|6/6|8|010001|V:h12i/M;V CVT:h12i/A;VX:h12i/M;VX CVT:h12i/A;ZX:h12i/M;ZX CVT:h12i/A
Honda|City|Sedan|11.95|20.75|Honda_City|5|506|165|4|4583|1748|1489|2600|40|6/6|8|110011|SV:h15i/M;V:h15i/M;V CVT:h15i/A;VX:h15i/M;VX CVT:h15i/A;ZX:h15i/M;ZX CVT:h15i/A;V eHEV:ehev/A;ZX eHEV:ehev/A
Honda|Elevate|SUV|11.91|16.73|Honda_Elevate|5|458|220|0|4312|1790|1650|2650|40|6/6|10.25|110001|SV:h15i/M;V:h15i/M;V CVT:h15i/A;VX:h15i/M;VX CVT:h15i/A;ZX:h15i/M;ZX CVT:h15i/A
MG|Comet EV|Hatchback|7|9.84|MG_Comet_EV|4|0|0|0|2974|1505|1640|2010|0|2/2|10.25|000000|Executive:evmc/A;Excite:evmc/A;Excite FC:evmc/A;Exclusive:evmc/A;Exclusive FC:evmc/A
MG|Windsor EV|SUV|13.99|16.5|MG_Windsor_EV|5|604|186|5|4295|1850|1677|2700|0|6/6|15.6|200001|Excite:evw/A;Exclusive:evw/A;Essence:evw/A;Essence Pro:evw/A
MG|Astor|SUV|9.99|17.9|MG_Astor|5|488|0|0|4323|1809|1650|2585|48|2/6|10.1|210001|Sprint:g15/M;Shine:g15/M;Select:g15/M;Sharp Pro:g15/M;Select CVT:g15/A;Sharp Pro CVT:g15/A;Savvy Pro CVT:g15/A
MG|Hector|SUV|14|22.89|MG_Hector|5|587|192|0|4655|1835|1760|2750|55|6/6|14|211111|Style:g15t/M;Smart:g15t/M;Select Pro:g15t/M;Sharp Pro:g15t/M;Sharp Pro CVT:g15t/A;Savvy Pro CVT:g15t/A;Select Pro Diesel:g20d/M;Sharp Pro Diesel:g20d/M
MG|ZS EV|SUV|17.99|24.99|MG_ZS_EV|5|448|177|5|4323|1809|1649|2585|0|6/6|10.1|211011|Excite Pro:evzs/A;Exclusive Plus:evzs/A;Essence:evzs/A
MG|Gloster|SUV|39.57|44.74|MG_Gloster|7|0|0|0|4985|1926|1867|2950|75|6/6|12.3|211101|Super 7S 4x2:g20s/A;Sharp 7S 4x2:g20s/A;Savvy 7S 4x4:g20t/A;Snowstorm 4x4:g20t/A;Desertstorm 4x4:g20t/A
Skoda|Kylaq|SUV|7.59|14.4|Skoda_Kylaq|5|446|189|5|3995|1783|1619|2566|45|6/6|10.1|100111|Classic:s10/M;Signature:s10/M;Signature+:s10/M;Signature+ AT:s10/A;Prestige:s10/M;Prestige AT:s10/A
Skoda|Slavia|Sedan|10.69|18.69|Škoda_Slavia|5|521|179|5|4541|1752|1507|2651|50|6/6|10.1|100111|Classic:s10/M;Signature:s10/M;Signature AT:s10/A;Sportline:s10/M;Sportline AT:s10/A;Prestige:s10/M;Prestige AT:s10/A;Monte Carlo 1.5 DSG:s15/A;Prestige 1.5 DSG:s15/A
Skoda|Kushaq|SUV|10.99|19.01|Škoda_Kushaq|5|385|188|5|4225|1760|1612|2651|50|6/6|10.1|200111|Classic:s10/M;Signature:s10/M;Signature AT:s10/A;Sportline:s10/M;Prestige:s10/M;Prestige AT:s10/A;Monte Carlo 1.5 DSG:s15/A;Prestige 1.5 DSG:s15/A
Skoda|Kodiaq|SUV|39.99|46.89|Škoda_Kodiaq|7|0|0|5|4758|1864|1659|2791|60|9/9|13|211111|Sportline:s20/A;L&K:s20/A
Skoda|Superb|Sedan|54|54|Škoda_Superb|5|0|0|5|4869|1864|1469|2841|66|9/9|13|211111|L&K:s20c/A
Volkswagen|Virtus|Sedan|10.99|19.41|Volkswagen_Virtus|5|521|179|5|4561|1752|1507|2651|50|6/6|10.1|100111|Comfortline:s10/M;Highline:s10/M;Highline AT:s10/A;Topline:s10/M;Topline AT:s10/A;GT Line 1.5 DSG:s15/A;GT Plus 1.5 DSG:s15/A
Volkswagen|Taigun|SUV|10.99|19.41|Volkswagen_Taigun|5|385|188|5|4221|1760|1612|2651|50|6/6|10.1|200111|Comfortline:s10/M;Highline:s10/M;Highline AT:s10/A;Topline:s10/M;Topline AT:s10/A;GT Line 1.5 DSG:s15/A;GT Plus 1.5 DSG:s15/A
Volkswagen|Tiguan R-Line|SUV|48.99|48.99|Volkswagen_Tiguan|5|652|0|5|4509|1839|1665|2681|58|9/9|12.9|211111|R-Line:s20b/A
Renault|Kwid|Hatchback|4.7|6.45|Renault_Kwid|5|279|184|0|3731|1579|1490|2422|28|2/2|8|000000|RXE:r8/M;RXL(O):r8/M;RXT:r8/M;Climber:r8/M;RXT AMT:r8/A;Climber AMT:r8/A
Renault|Triber|MPV|6.1|8.97|Renault_Triber|7|625|182|4|3990|1739|1643|2636|40|2/4|8|000000|Authentic:r10/M;Evolution:r10/M;Techno:r10/M;Emotion:r10/M;Evolution AMT:r10/A;Techno AMT:r10/A;Emotion AMT:r10/A
Renault|Kiger|SUV|6.1|11.23|Renault_Kiger|5|405|205|4|3991|1750|1605|2500|40|2/4|8|000000|RXE:r10/M;RXL:r10/M;RXT:r10/M;RXZ:r10/M;RXL AMT:r10/A;RXZ AMT:r10/A;RXT Turbo:r10t/M;RXZ Turbo CVT:r10t/A
Nissan|Magnite|SUV|5.99|11.14|Nissan_Magnite|5|336|205|4|3994|1758|1572|2500|40|2/6|8|000000|Visia:r10/M;Visia+:r10/M;Acenta:r10/M;N-Connecta:r10/M;Tekna:r10/M;Acenta AMT:r10/A;Tekna Turbo:r10t/M;Tekna+ Turbo CVT:r10t/A
Citroen|C3|Hatchback|6.23|10.19|Citroën_C3|5|315|180|0|3981|1733|1604|2540|30|2/2|10.2|000000|Live:c12/M;Feel:c12/M;Shine:c12/M;Shine Turbo:c12t/M;Shine Turbo AT:c12t/A
Citroen|eC3|Hatchback|11.61|13.5|Citroën_C3|5|315|180|0|3981|1733|1604|2540|0|2/2|10.2|000000|Live:evec3/A;Feel:evec3/A;Shine:evec3/A
Citroen|Basalt|SUV|7.99|13.62|Citroën_Basalt|5|470|180|0|4352|1765|1593|2651|45|2/6|10.2|000000|Plus:c12/M;Plus Turbo:c12t/M;Max Turbo:c12t/M;Max Turbo AT:c12t/A
Citroen|C3 Aircross|SUV|8.49|14.55|Citroën_C3_Aircross|5|444|200|0|4323|1796|1669|2671|45|2/2|10.2|000000|Plus 5S Turbo:c12t/M;Max 5S Turbo:c12t/M;Max 7S Turbo:c12t/M;Max Turbo AT:c12t/A
Jeep|Compass|SUV|18.99|32.41|Jeep_Compass|5|438|198|5|4405|1818|1640|2636|60|6/6|10.1|210111|Sport:g20d/M;Longitude:g20d/M;Night Eagle:g20d/M;Limited(O) AT:g20d/A;Model S(O) 4x4 AT:g20d/A;Trailhawk 4x4 AT:g20d/A
Jeep|Meridian|SUV|24.99|38.79|Jeep_Meridian|7|0|0|5|4769|1859|1698|2794|55|6/6|10.1|210111|Longitude:g20d/M;Limited:g20d/M;Limited AT:g20d/A;Overland 4x4 AT:g20d/A
Jeep|Wrangler|SUV|67.65|71.65|Jeep_Wrangler|5|0|0|0|4882|1894|1841|3008|81|6/6|8.4|000000|Unlimited:jw/A;Rubicon:jw/A
BYD|Atto 3|SUV|24.99|33.99|BYD_Atto_3|5|440|175|5|4455|1875|1615|2720|0|7/7|12.8|211111|Dynamic:evat49/A;Premium:evat/A;Superior:evat/A
BYD|eMAX 7|MPV|26.9|29.9|BYD_M6|7|0|0|0|4710|1810|1690|2800|0|6/6|12.8|211011|Premium 6S:evem55/A;Premium 7S:evem55/A;Superior 6S:evem/A;Superior 7S:evem/A
BYD|Seal|Sedan|41|53.15|BYD_Seal|5|400|0|5|4800|1875|1460|2920|0|9/9|15.6|211111|Dynamic RWD:evse61/A;Premium RWD:evse82/A;Performance AWD:evse/A
Lexus|NX 350h|SUV|68.02|71.17|Lexus_NX|5|0|0|5|4660|1865|1660|2690|55|10/10|14|211111|Exquisite:hl25/A;Luxury:hl25/A;F Sport:hl25/A
Mercedes-Benz|C-Class|Sedan|59.5|65|Mercedes-Benz_C-Class|5|455|0|5|4751|1820|1437|2865|66|7/7|11.9|201111|C 200 Avantgarde:mb15/A;C 220d:mb20d/A;C 300 AMG Line:mb20/A
Mercedes-Benz|GLC|SUV|76.7|80|Mercedes-Benz_GLC|5|620|0|5|4716|1890|1640|2888|62|7/7|11.9|211111|GLC 300 4MATIC:mb20/A;GLC 220d 4MATIC:mb20d/A
Mercedes-Benz|E-Class LWB|Sedan|78.5|89|Mercedes-Benz_E-Class|5|540|0|5|5092|1880|1493|3094|66|7/7|14.4|211111|E 220d:mb20d/A;E 450 4MATIC:mb30/A
Mercedes-Benz|GLE|SUV|99|120|Mercedes-Benz_GLE-Class|5|630|0|5|4961|2013|1772|2995|85|9/9|12.3|211111|GLE 450 4MATIC:mb30/A;GLE 450d 4MATIC:mb30d/A
BMW|2 Series Gran Coupe|Sedan|43.9|46.9|BMW_2_Series_Gran_Coupé|5|430|0|0|4526|1800|1420|2670|51|6/6|10.25|100001|220i M Sport:bm20a/A
BMW|3 Series Gran Limousine|Sedan|62.6|74.5|BMW_3_Series|5|480|0|5|4823|1827|1463|2961|59|6/6|12.3|201111|320Ld M Sport:bm20d/A;330Li M Sport:bm20/A
BMW|X5|SUV|97|110|BMW_X5|5|650|0|5|4935|2004|1766|2975|83|6/6|12.3|211111|xDrive40i M Sport:bm30/A;xDrive30d M Sport:bm30d/A
BMW|i4|Sedan|72.5|72.5|BMW_i4|5|470|0|5|4783|1852|1448|2856|0|8/8|14.9|211111|eDrive40 M Sport:evi4/A
BMW|iX1 LWB|SUV|49|49|BMW_iX1|5|490|0|5|4616|1845|1642|2802|0|6/6|10.7|211111|eDrive20L M Sport:evix1/A
Audi|Q3|SUV|44.99|55.64|Audi_Q3|5|530|0|5|4484|1849|1616|2680|62|6/6|10.1|211111|Premium Plus:s20/A;Technology:s20/A
Audi|Q7|SUV|88.66|105|Audi_Q7|7|865|0|5|5063|1970|1741|2994|85|8/8|10.1|211111|55 TFSI Premium Plus:au55/A;55 TFSI Technology:au55/A
Volvo|XC60|SUV|71.9|71.9|Volvo_XC60|5|505|0|5|4708|1902|1653|2865|71|6/6|11.2|211111|B5 Ultra:vo/A
Volvo|XC90|SUV|100|100|Volvo_XC90|7|302|0|5|4953|2008|1776|2984|71|6/6|11.2|211111|B5 Ultra:vo/A
Land Rover|Defender|SUV|105|160|Land_Rover_Defender_(L663)|5|0|0|5|4758|1996|1967|3022|90|6/6|11.4|211111|110 P300 S:lr20p/A;110 D300 SE:lr30d/A;110 D300 HSE:lr30d/A
Porsche|Macan|SUV|96|96|Porsche_Macan|5|488|0|5|4726|1927|1621|2807|65|6/6|10.9|211111|Macan 2.0:po20/A`;
export const CARS: Car[] = M.split("\n").map((l, i) => {
  const p = l.split("|"); const min = +p[3] * 1e5, max = +p[4] * 1e5, fl = p[17], air = p[15].split("/");
  const tr = p[18].split(";"); const n = tr.length;
  const vars: PT[] = tr.map((s, j) => { const k = s.lastIndexOf(":"), [id, t] = s.slice(k + 1).split("/"); return { name: s.slice(0, k), e: ENGINES[id], tx: t === "M" ? "Manual" : "Automatic", price: Math.round((min + (max - min) * (n > 1 ? j / (n - 1) : 0)) / 1000) * 1000 }; });
  return { id: String(i), brand: p[0], model: p[1], body: p[2], min, max, wiki: p[5], seats: +p[6], boot: +p[7], gc: +p[8], ncap: +p[9], len: +p[10], wid: +p[11], hgt: +p[12], wb: +p[13], tank: +p[14], airStd: +air[0], airMax: +air[1], screen: +p[16], f: { sunroof: +fl[0], adas: fl[1] === "1", cam360: fl[2] === "1", vent: fl[3] === "1", wireless: fl[4] === "1", cruise: fl[5] === "1" }, vars };
});
export const BRANDS = [...new Set(CARS.map(c => c.brand))].sort();
export const BODIES = [...new Set(CARS.map(c => c.body))].sort();
export const FUELS = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
export const fuelsOf = (c: Car) => FUELS.filter(f => c.vars.some(v => v.e.fuel === f));
export const lakh = (n: number) => n >= 1e7 ? "₹" + (n / 1e7).toFixed(2) + " Cr" : "₹" + (n / 1e5).toFixed(2) + " L";
export const rng = (c: Car) => c.min === c.max ? lakh(c.min) : `${lakh(c.min)} - ${lakh(c.max)}`;
// On-road price = ex-showroom + RTO/road tax + first-year insurance + other (TCS, FASTag, handling). Rates are typical averages.
export function breakup(ex: number, ev: boolean) {
  const [r, i, o] = ev ? [0, .035, .015] : ex <= 1e6 ? [.07, .03, .02] : ex <= 2.5e6 ? [.1, .03, .03] : ex <= 5e6 ? [.13, .025, .045] : [.17, .02, .06];
  const rto = ex * r, ins = ex * i, other = ex * o; return { ex, rto, ins, other, total: ex + rto + ins + other };
}
export const onRoad = (p: number, ev: boolean) => breakup(p, ev).total;
export const emiOf = (P: number, r: number, y: number) => { const m = r / 1200, n = y * 12; if (P <= 0) return 0; return m === 0 ? P / n : P * m * Math.pow(1 + m, n) / (Math.pow(1 + m, n) - 1); };
export const effUnit = (e: Eng) => e.ev ? "km range" : e.fuel === "CNG" ? "km/kg" : "km/l";
export const fuelPrice: Record<string, number> = { Petrol: 105, Diesel: 92, CNG: 76, Hybrid: 105, Electric: 8 };
const SVC: Record<string, number> = { "Maruti Suzuki": 5500, Toyota: 8000, Hyundai: 7000, Kia: 7500, Tata: 6500, Mahindra: 8500, Honda: 8000, MG: 9000, Skoda: 12000, Volkswagen: 12000, Renault: 6500, Nissan: 6500, Citroen: 8000, Jeep: 15000, BYD: 9000, Lexus: 30000, "Mercedes-Benz": 55000, BMW: 45000, Audi: 50000, Volvo: 40000, "Land Rover": 70000, Porsche: 80000 };
export const svcBase = (b: string) => SVC[b] || 9000;
// Fuel/charging + servicing + tyres + wear. Insurance is calculated separately in insurance().
export function runCosts(c: Car, v: PT, kmMonth: number, mileage?: number) {
  const e = v.e, price = fuelPrice[e.fuel];
  const real = e.ev ? e.eff * .75 : (mileage && mileage > 0 ? mileage : e.eff * (e.fuel === "CNG" ? .85 : .8));
  const fuel = e.ev ? kmMonth / real * e.disp * 1.1 * price : kmMonth / real * price;
  const kmYr = kmMonth * 12, svcYr = svcBase(c.brand) * (e.ev ? .55 : e.fuel === "Petrol" ? 1 : e.fuel === "CNG" ? 1.05 : 1.1) * (.7 + .3 * Math.min(2, kmYr / 10000));
  const tyres = kmMonth * (.35 + v.price / 1e5 * .04), misc = kmMonth * .3;
  return { fuel, service: svcYr / 12, tyres, misc, total: fuel + svcYr / 12 + tyres + misc, real };
}
// Insurance estimate from IRDAI-style components (verify current rates with your insurer).
export const AGE_DEP: [string, number][] = [["New car", .05], ["1 year", .2], ["2 years", .3], ["3 years", .4], ["4 years", .5], ["5+ years", .6]];
export function insurance(c: Car, v: PT, ageIdx: number, cover: "Comprehensive" | "Third-party only", zeroDep: boolean, ncb: number) {
  const e = v.e, idv = v.price * (1 - AGE_DEP[ageIdx][1]);
  const odRate = e.ev ? .03283 : e.disp < 1000 ? .03127 : e.disp <= 1500 ? .03283 : .0344;
  const kw = e.ps * .7355;
  const tp = (e.ev ? (kw <= 30 ? 1780 : kw <= 65 ? 2904 : 6712) : e.disp < 1000 ? 2094 : e.disp <= 1500 ? 3416 : 7897) + (e.fuel === "CNG" ? 60 : 0);
  const comp = cover === "Comprehensive", od = comp ? idv * odRate : 0, ncbOff = od * ncb / 100, zd = comp && zeroDep ? od * .15 : 0, pa = 330;
  const sub = od - ncbOff + zd + tp + pa, gst = sub * .18;
  return { idv, odRate, od, ncbOff, zd, tp, pa, gst, total: sub + gst, rows: [["Insured value (IDV)", idv], ["Own-damage premium", od], ["No-claim bonus discount", -ncbOff], ["Zero-depreciation add-on (about 15% of OD)", zd], ["Third-party premium (fixed by IRDAI)", tp], ["Owner-driver personal accident cover", pa], ["GST at 18%", gst]] as [string, number][] };
}
export function curve(e: Eng) {
  const pts: { rpm: number; ps: number; nm: number }[] = [];
  if (e.ev) { const base = e.ps * 7121 / e.nm, max = base * 3.2; for (let i = 0; i <= 40; i++) { const r = max * i / 40, nm = r <= base ? e.nm : e.ps * 7121 / r; pts.push({ rpm: r, nm, ps: nm * r / 7121 }); } return pts; }
  const red = e.psRpm * 1.12, end = e.nmRpm < e.psRpm * .5 ? e.psRpm * .62 : e.nmRpm, tq = Math.min(e.nm, e.ps * 7121 / e.psRpm);
  for (let i = 0; i <= 36; i++) {
    const r = 1000 + (red - 1000) * i / 36; let nm: number;
    if (r < e.nmRpm) nm = e.nm * (.62 + .38 * Math.pow((r - 1000) / (e.nmRpm - 1000), .7));
    else if (r <= end) nm = e.nm; else if (r <= e.psRpm) nm = e.nm + (tq - e.nm) * (r - end) / (e.psRpm - end);
    else nm = tq * (1 - .12 * (r - e.psRpm) / (red - e.psRpm));
    pts.push({ rpm: r, nm, ps: nm * r / 7121 });
  }
  return pts;
}
