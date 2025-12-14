# WhizToys 智慧地墊 Web 控制範例

這是一個使用 Web Bluetooth API 連線 WhizToys 智慧地墊控制盒的簡易網頁，只實作基本功能：

- 連線藍牙裝置 (Custom Service `0xFEE0`)
- 讀取 Layout (`fee1`)
- 接收感測事件通知 (`fee2`)
- 傳送簡單的燈光控制指令 (`fee3`)

> **注意**：實際 UUID 與指令細節仍需以裝置韌體版本為準，如無法連線或控制，可依實測調整 `main.js` 中的 UUID 或封包格式。

## 使用方式

1. 啟動一個本機靜態網站伺服器 (以專案根目錄 `floor_mat` 為例)：

   在 Windows PowerShell 中：

   ```powershell
   cd "c:\Users\biabo\SynologyDrive\個人_2025\Project\floor_mat"
   python -m http.server 8000
   ```

   或者若已安裝 Node.js：

   ```powershell
   cd "c:\Users\biabo\SynologyDrive\個人_2025\Project\floor_mat"
   npx serve .
   ```

2. 使用支援 Web Bluetooth 的瀏覽器 (Chrome / Edge)：

   - 前往 `http://localhost:8000/web/` (或對應的伺服器網址)

3. 操作步驟：

   - 按下 **「連線藍牙裝置」**
     - 從彈出的裝置清單中選擇 WhizToys 控制盒
   - 連線成功後：
     - 可以按 **「讀取 Layout」** 檢視行列與原始資料
     - 感測區塊會即時顯示最近的壓力變化 (Notify)
     - 在「燈光控制（示範）」區可以測試：
       - **「全部亮紅」**
       - **「全部關燈」**
       - 輸入 Row / Col / 顏色索引，再按 **「指定格亮燈」**

## 調整與擴充

- 若控制盒實際只使用 16-bit UUID：
  - 可將 `main.js` 中的 `SERVICE_UUID` / `*_CHAR_UUID` 改為 `'fee0'`, `'fee1'`, `'fee2'`, `'fee3'`。
- 若文件中對於 LED 指令 checksum 有不同演算法：
  - 請修改 `buildLedCommand` 中的 checksum 計算邏輯。
- 要做更完整的地墊視覺化：
  - 可以根據 Layout 資訊 (`rows`, `cols`) 產生一個網格，
  - 並根據 Notify 更新每一格的顯示與顏色。

---

此範例僅作為開發時的參考起點，可依實際需求再調整 UI 與功能。
