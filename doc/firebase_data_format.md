# Firebase Data Format — WhizToys Smart Mat

This document describes the structure of records uploaded to Firebase Realtime Database by the web app.

- Path: `mat_presses`
- Write model: `push` to `mat_presses` (each record under an auto-generated id)

## EN — Record Fields

- **date**: ISO-8601 timestamp string from client (e.g. `2025-12-21T11:22:33.444Z`).
- **timestamp**: Localized human-readable timestamp string (Traditional Chinese, 12-hour).
- **serverTime**: Server-assigned numeric timestamp (`ServerValue.TIMESTAMP`) for reliable ordering.
- **groupId**: Numeric group identifier. Default `1`.
- **sessionId**: Unique id for the current connection session (e.g. `session_1734760000000_abcd1234`).
- **matNumber**: Sequential plate number (left-to-right, top-to-bottom) calculated as `rowIndex * cols + colIndex + 1`.
- **rowIndex**: Zero-based row index parsed from sensor notify.
- **colIndex**: Zero-based column index parsed from sensor notify.
- **rows**: Total rows from layout. `0` if layout not read yet.
- **cols**: Total columns from layout. Fallback to `16` if layout not read yet.
- **sensors**: Object containing per-corner sensor values.
  - **leftTop**: `{ code, level, nameZh }`
  - **leftBottom**: `{ code, level, nameZh }`
  - **rightBottom**: `{ code, level, nameZh }`
  - **rightTop**: `{ code, level, nameZh }`
  - Where **code** is a 2-bit integer: `0 | 1 | 2 | 3` and **level** is mapped text.
- **levelDefinitionsBinary**: Explicit binary-to-level mapping reference.
  - `"00"`: `No press`
  - `"01"`: `Level_1`
  - `"10"`: `Level_2`
  - `"11"`: `Level_3`

### Example (EN)

```json
{
  "date": "2025-12-21T11:22:33.444Z",
  "timestamp": "2025/12/21 上午11:22:33",
  "serverTime": 1734760953444,
  "groupId": 1,
  "sessionId": "session_1734760953000_x1y2z3a4",
  "matNumber": 42,
  "rowIndex": 2,
  "colIndex": 9,
  "rows": 16,
  "cols": 16,
  "sensors": {
    "leftTop": { "code": 3, "level": "Level_3", "nameZh": "左上" },
    "leftBottom": { "code": 2, "level": "Level_2", "nameZh": "左下" },
    "rightBottom": { "code": 1, "level": "Level_1", "nameZh": "右下" },
    "rightTop": { "code": 0, "level": "No press", "nameZh": "右上" }
  },
  "levelDefinitionsBinary": {
    "00": "No press",
    "01": "Level_1",
    "10": "Level_2",
    "11": "Level_3"
  }
}
```

### Notes (EN)

- `rows/cols` are populated after the layout is read; before that `rows=0`, `cols=16` fallback is applied.
- Use `serverTime` for sorting and time-based queries; `timestamp` is for display.
- `groupId` is configurable per deployment; default is `1`.
- `sessionId` is generated on each successful Bluetooth connection.

---

## 繁中 — 資料欄位說明

- **date**：客戶端 ISO-8601 時間字串（例如 `2025-12-21T11:22:33.444Z`）。
- **timestamp**：本地（繁中、12 小時制）可讀時間字串。
- **serverTime**：伺服器指派的數值時間戳（`ServerValue.TIMESTAMP`），用於可靠排序。
- **groupId**：群組編號（數值）。預設為 `1`。
- **sessionId**：本次連線的唯一識別字串（例如 `session_1734760000000_abcd1234`）。
- **matNumber**：地墊格號（由左到右、由上到下），計算式：`rowIndex * cols + colIndex + 1`。
- **rowIndex**：零起始的列（Row）索引，來自感測通知。
- **colIndex**：零起始的行（Col）索引，來自感測通知。
- **rows**：Layout 總列數，若尚未讀取則為 `0`。
- **cols**：Layout 總行數，若尚未讀取則回退為 `16`。
- **sensors**：各角落的感測數值物件。
  - **leftTop**：`{ code, level, nameZh }`（左上）
  - **leftBottom**：`{ code, level, nameZh }`（左下）
  - **rightBottom**：`{ code, level, nameZh }`（右下）
  - **rightTop**：`{ code, level, nameZh }`（右上）
  - 其中 **code** 為 2-bit 整數：`0 | 1 | 2 | 3`；**level** 為對應文字。
- **levelDefinitionsBinary**：二進位至等級文字對照表。
  - `"00"`：`無按壓`
  - `"01"`：`Level_1`
  - `"10"`：`Level_2`
  - `"11"`：`Level_3`

### 資料範例（繁中）

```json
{
  "date": "2025-12-21T11:22:33.444Z",
  "timestamp": "2025/12/21 上午11:22:33",
  "serverTime": 1734760953444,
  "groupId": 1,
  "sessionId": "session_1734760953000_x1y2z3a4",
  "matNumber": 42,
  "rowIndex": 2,
  "colIndex": 9,
  "rows": 16,
  "cols": 16,
  "sensors": {
    "leftTop": { "code": 3, "level": "Level_3", "nameZh": "左上" },
    "leftBottom": { "code": 2, "level": "Level_2", "nameZh": "左下" },
    "rightBottom": { "code": 1, "level": "Level_1", "nameZh": "右下" },
    "rightTop": { "code": 0, "level": "無按壓", "nameZh": "右上" }
  },
  "levelDefinitionsBinary": {
    "00": "無按壓",
    "01": "Level_1",
    "10": "Level_2",
    "11": "Level_3"
  }
}
```

### 備註（繁中）

- `rows/cols` 在讀取 Layout 後才會有值；未讀取前 `rows=0`，`cols` 先以 `16` 作為回退值。
- 時間排序與查詢請使用 `serverTime`；`timestamp` 主要用於顯示。
- `groupId` 可依部署需求調整；預設 `1`。
- `sessionId` 於每次成功藍牙連線時產生。