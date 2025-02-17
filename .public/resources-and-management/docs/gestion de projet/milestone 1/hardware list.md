# Hardware list

Final hardware picks adapted to project requirements

## Inground sensors

Temperature sensor:
[Programmable Resolution 1-Wire Digital Thermometer](https://www.analog.com/media/en/technical-documentation/data-sheets/DS18B20.pdf)
[DS18B20](https://www.analog.com/en/products/ds18b20.html)

- **Precision:** ±0.5°C accuracy from -10°C to +85°C
- **Consumption:** 1.5mA (maximum operating current during active temp conversions and memory access)
- **Price:** 2.70 euros
- convenient 1-Wire communication interface

Capacitive soil moisture sensor:
[Gravity: IP65 Waterproof & Corrosion-Resistant Capacitive Soil Moisture Sensor](https://fr.rs-online.com/web/p/kits-de-developpement-pour-capteur/2049905?searchId=dd258be7-0477-4060-ad04-d54c399e6b89&gb=s)
[SEN0308](https://wiki.dfrobot.com/Waterproof_Capacitive_Soil_Moisture_Sensor_SKU_SEN0308)

- **Precision:**
- **Consumption:**
- **Price:** 14.76 euros HT
- analog output
- corrosion-resistent and waterproof
- 3.3V/5V main board compatible

Optional pH-meter

## Outground sensors

All-in-one temperature, humidity and carbon dioxide sensor:
[True CO2 Temperature and Humidity Sensor](https://sensirion.com/media/documents/48C4B7FB/66E05452/CD_DS_SCD4x_Datasheet_D1.pdf)
[SCD41](https://www.adafruit.com/product/5190)

- **Precision:**
  - CO2 sensing performance: ±(40 ppm + 5% of reading) for 400 ppm to 5000 ppm measurement conditions
  - Temperature sensing performance: ± 1.5 °C for measurements between -10 °C and 60 °C
  - Humidity sensing performance: ±9 %RH

- **Consumption:**
  - 15 mA (typical average supply current for periodic 5-second-interval measurements)
  - 0.5 mA (average supply current for 5-minute-interval measurements)

- **Price:** 49.95$
- I2C interface
- PCB base with standard STEMMA QT connectors

GPIO-compatible camera:
[Camera Breakout - 120 Degree Lens with Autofocus](https://cdn-learn.adafruit.com/downloads/pdf/adafruit-ov5640-camera-breakout.pdf)
[OV5640](https://www.adafruit.com/product/5838)

- **Precision:** 5 MP resolution, <1% distortion
- **Consumption:** 140 mA (active), 20 uA (standby)
- **Price:** 14.95$
- 120-degree fisheye lens
- Autofocus motor to adapt to plant motion
- GPIO-connector based, as opposed to more common NAP communication
- 3.3V power supply-compatible and I2C support

Luminance and color sensor:
[Luminance and color sensor BH1745 Breakout](https://www.kubii.com/en/modules-sensors/2866-luminance-and-color-sensor-bh1745-breakout-3272496300620.html)
[BH1745](file:///C:/Users/valen/Downloads/BH1745%20datasheet.pdf)

- **Precision:** highly precise, 0.1 to 40,000 Lux
- **Consumption:** 0.8 uA in sleep mode, and 130 uA in measure mode
- **Price:** 10.96€
- 3.3V power supply-compatible and I2C support

## Microcontroller

[F1 Smart Module - SG Wireless](https://docs.sgwireless.com)
[SGW3501](https://sgwireless.com/product/f1/)

- **Price:** 39.62$
- supports multiple connection protocols such as WiFi, Bluetooth BLE 5.0, Cellular LTE and most importantly, LoRa(WAN)
- ESP32 MCU compatible
- MicroPython programmable with 27 IOs on module pads
- extremely low power

## Solar panel

We did not perform detailed research for possible solar panels, but one possible options will be the following:

Solar panel - Aliexpress:

- price 1€
- 5V & ~160mA output
- small package, 70 * 90mm

[Purchase link](https://fr.aliexpress.com/item/1005002996845292.html?spm=a2g0n.productlist.0.0.3f6a504adAED2o&browser_id=9912822ba7104565be8b54cba042be38&aff_platform=msite&m_page_id=uhemhfyihucauiqa1949d31b18a11be4e5b4169a4f&gclid=&pdp_npi=4%40dis%21EUR%213.65%210.99%21%21%213.71%211.00%21%402103894417378040671818237e8bad%2112000023131955730%21sea%21FR%210%21ABX&algo_pvid=fbef27f0-ebd8-4d19-bb38-3ce8c8e70ac6&search_p4p_id=202501250321072425412939565280013268461_3&_gl=1*1y16e74*_ga*MjE1MjE3MzMwLjE3Mzc4MDQwNjk.*_ga_VED1YSGNC7*MTczNzgwNDA2OC4xLjAuMTczNzgwNDA3MC42MC4wLjA.*_gcl_au*MjAyMzQ1MDk0Ny4xNzM3ODA0MDcx)
