# WhizToys Smart Mat Web Controller

English version is first, followed by Traditional Chinese.

---

## Overview (EN)

This is a simple web UI that uses the Web Bluetooth API to connect to the WhizToys smart floor mat controller. It currently implements basic features:

- Connect to the Bluetooth device (Custom Service `0xFEE0`)
- Read mat layout (`fee1`)
- Receive sensor events via notifications (`fee2`)
- Send simple LED control commands (`fee3`)

> **Note**: Actual UUIDs and command formats depend on the firmware version. If connection or control does not work, adjust the UUIDs or packet formats in `main.js` according to real device behavior.

### Features

- Live sensor event list (shows latest changes)
- Layout info (rows/cols and raw hex data)
- Simple LED demo controls:
  - Turn all cells on / off
  - Light up or turn off a specific cell by Row / Col / color index
- UI language switcher (header select box):
  - Default: English
  - Switchable to: Traditional Chinese (繁體中文)
  - Language preference is stored in `localStorage` (`whiz_lang`).

### How to run (EN)

1. Start a local static web server from the project root (`Whiz_toys_floor_mat`, the folder containing `index.html`):

   In Windows PowerShell with Python installed:

   ```powershell
   cd "c:\Users\ChiaHsing\SynologyDrive\個人_2025\Project\Whiz_toys_floor_mat"
   python -m http.server 8000
   ```

   Or with Node.js installed:

   ```powershell
   cd "c:\Users\ChiaHsing\SynologyDrive\個人_2025\Project\Whiz_toys_floor_mat"
   npx serve .
   ```

2. Open a browser that supports Web Bluetooth (Chrome / Edge):

   - Navigate to `http://localhost:8000/` (or the corresponding server URL).

3. Basic usage:

   - Click **“Connect Bluetooth device”** and choose the WhizToys controller from the device list.
   - After a successful connection:
     - Click **“Read Layout”** to see rows/cols and the raw data.
     - The **Sensor Events** section will show the latest pressure changes in real time.
     - In **Light Control (Demo)** you can:
       - Use **“Turn all on (use color below)”** / **“Turn all off”**.
       - Enter Row / Col / Color index, then click **“Light specific cell”** or **“Turn off specific cell”**.
   - Use the language dropdown in the header to switch between **English** and **繁體中文** at any time.

### Customization / Extension (EN)

- If the controller only uses 16‑bit UUIDs:
  - Change `SERVICE_UUID` / `*_CHAR_UUID` in `main.js` to `'fee0'`, `'fee1'`, `'fee2'`, `'fee3'`.
- If your documentation specifies a different checksum algorithm for LED commands:
  - Update the checksum logic inside `buildLedCommand` in `main.js`.
- For a richer visualization of the mat:
  - Use layout info (`rows`, `cols`) to render a grid in the UI.
  - Update each cell’s state and color according to sensor notifications.

---

## WhizToys 智慧地墊 Web 控制範例（繁體中文）

這是一個使用 Web Bluetooth API 連線 WhizToys 智慧地墊控制盒的簡易網頁，目前實作的功能包含：

- 連線藍牙裝置 (Custom Service `0xFEE0`)
- 讀取 Layout (`fee1`)
- 接收感測事件通知 (`fee2`)
- 傳送簡單的燈光控制指令 (`fee3`)

> **注意**：實際 UUID 與指令細節仍需以裝置韌體版本為準，如無法連線或控制，可依實測調整 `main.js` 中的 UUID 或封包格式。

### 功能說明

- 感測事件清單：即時顯示最新的壓力變化。
- Layout 資訊：顯示行列數與原始十六進位資料。
- 燈光控制示範：
  - 全部亮 / 全部關
  - 指定 Row / Col / 顏色索引，操作單一格亮燈或關燈。
- 介面語言切換：
  - 預設為英文介面。
  - 可在頁面上方選擇「繁體中文」，即可切換所有標題與按鈕文字。
  - 使用者選擇會儲存在 `localStorage`（key：`whiz_lang`）。

### 使用方式（繁中）

1. 啟動本機靜態網站伺服器（以 `Whiz_toys_floor_mat` 為專案根目錄）：

   在 Windows PowerShell 中（已安裝 Python）：

   ```powershell
   cd "c:\Users\ChiaHsing\SynologyDrive\個人_2025\Project\Whiz_toys_floor_mat"
   python -m http.server 8000
   ```

   或者若已安裝 Node.js：

   ```powershell
   cd "c:\Users\ChiaHsing\SynologyDrive\個人_2025\Project\Whiz_toys_floor_mat"
   npx serve .
   ```

2. 使用支援 Web Bluetooth 的瀏覽器 (Chrome / Edge)：

   - 前往 `http://localhost:8000/`（或對應的伺服器網址）。

3. 操作步驟：

   - 按下 **「Connect Bluetooth device / 連線藍牙裝置」**
     - 從彈出的裝置清單中選擇 WhizToys 控制盒。
   - 連線成功後：
     - 可以按 **「Read Layout / 讀取 Layout」** 檢視行列與原始資料。
     - 感測區塊會即時顯示最近的壓力變化 (Notify)。
     - 在「Light Control (Demo) / 燈光控制（示範）」區可以測試：
       - **「Turn all on / 全部亮」**
       - **「Turn all off / 全部關燈」**
       - 輸入 Row / Col / 顏色索引，再按 **「Light specific cell / 指定格亮燈」**。
   - 可隨時使用頁首的語言選單在英文與繁中之間切換。

### 調整與擴充（繁中）

- 若控制盒實際只使用 16-bit UUID：
  - 可將 `main.js` 中的 `SERVICE_UUID` / `*_CHAR_UUID` 改為 `'fee0'`, `'fee1'`, `'fee2'`, `'fee3'`。
- 若文件中對於 LED 指令 checksum 有不同演算法：
  - 請修改 `buildLedCommand` 中的 checksum 計算邏輯。
- 若要做更完整的地墊視覺化：
  - 可以根據 Layout 資訊 (`rows`, `cols`) 產生一個網格，
  - 並根據 Notify 更新每一格的顯示與顏色。

---

此範例僅作為開發時的參考起點，可依實際需求再調整 UI、多語系文案與功能。
