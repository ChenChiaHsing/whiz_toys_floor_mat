
// 簡易 WhizToys 智慧地墊 Web Bluetooth 控制

// 這裡使用已知的 Custom Service UUID 與三個 characteristics
// 若裝置實作僅接受 16-bit UUID（fee0/fee1/fee2/fee3），
// 測試時可以改成 'fee0' 等字串形式。

// --- 簡易多語系設定（預設英文，可切換繁體中文） ---
const LANG_EN = 'en';
const LANG_ZH = 'zh-Hant';

let currentLang = LANG_EN;

const translations = {
  [LANG_EN]: {
    title: 'WhizToys Smart Mat Control',
    header_title: 'WhizToys Smart Mat Control',
    label_language: 'Language:',
    section_connect_title: 'Connection',
    connect_button: 'Connect Bluetooth device',
    connection_status_initial: 'Status: Not connected',
    section_layout_title: 'Layout Info',
    read_layout_button: 'Read Layout',
    layout_info_initial: 'Not read yet',
    section_sensor_title: 'Sensor Events',
    sensor_recent_label: 'Recent sensor changes:',
    section_led_title: 'Light Control (Demo)',
    all_on_button: 'Turn all on (use color below)',
    all_off_button: 'Turn all off',
    hint_all_on_off:
      'Tip: Read layout once first to get full row/column info, then use the all-on/all-off buttons.',
    label_color_index: 'Color index:',
    preset_label: 'Main color presets:',
    color_red: 'Red (01)',
    color_yellow: 'Yellow (11)',
    color_green: 'Green (21)',
    color_light_blue: 'Light blue (31)',
    color_blue: 'Blue (41)',
    color_purple: 'Purple (51)',
    color_white: 'White (61)',
    single_on_button: 'Light specific cell',
    single_off_button: 'Turn off specific cell',
    hint_demo: '* Commands above are for demonstration; actual behavior depends on device firmware.',
    footer_note:
      'Only browsers with Web Bluetooth enabled are supported (e.g. Chrome / Edge over HTTPS or localhost).',
    status_disconnected: 'Status: Not connected',
    status_searching: 'Status: Searching for Bluetooth devices…',
    status_connected: name => `Status: Connected to ${name || 'device'}`,
    alert_no_bluetooth:
      'This browser does not support Web Bluetooth. Please use Chrome / Edge over HTTPS or localhost.',
    alert_connect_failed: msg => `Connection failed: ${msg}`,
    alert_read_layout_failed: msg => `Read layout failed: ${msg}`,
    alert_send_led_failed: msg => `Send LED command failed: ${msg}`,
    layout_info: (rows, cols, checksumOk) =>
      `Rows=${rows}, Cols=${cols}, checksum=${checksumOk ? 'OK' : 'NG'}`,
    device_disconnected_event: 'Device disconnected',
    connected_with_notify_event: 'Connected and sensor notifications enabled',
    level_text: v => {
      switch (v) {
        case 0:
          return 'No press';
        case 1:
          return 'Level_1';
        case 2:
          return 'Level_2';
        case 3:
          return 'Level_3';
        default:
          return 'Unknown';
      }
    },
    sensor_event: ({ rowIndex, colIndex, leftTop, leftBottom, rightBottom, rightTop }) =>
      `row=${rowIndex}, col=${colIndex}, sensors=[LT:${leftTop}, LB:${leftBottom}, RB:${rightBottom}, RT:${rightTop}]`,
    error_no_led_write: 'This browser does not support writing to the LED characteristic (writeValue*).'
  },
  [LANG_ZH]: {
    title: 'WhizToys 智慧地墊控制',
    header_title: 'WhizToys 智慧地墊控制',
    label_language: '介面語言：',
    section_connect_title: '連線',
    connect_button: '連線藍牙裝置',
    connection_status_initial: '狀態：尚未連線',
    section_layout_title: 'Layout 資訊',
    read_layout_button: '讀取 Layout',
    layout_info_initial: '尚未讀取',
    section_sensor_title: '感測事件',
    sensor_recent_label: '最近幾筆感測變化：',
    section_led_title: '燈光控制（示範）',
    all_on_button: '全部亮（使用下方顏色）',
    all_off_button: '全部關燈',
    hint_all_on_off:
      '※ 建議先按一次「讀取 Layout」按鈕，取得完整行列資訊後再使用全部亮/全部關。',
    label_color_index: '顏色索引:',
    preset_label: '主要顏色快選：',
    color_red: '紅 (01)',
    color_yellow: '黃 (11)',
    color_green: '綠 (21)',
    color_light_blue: '淺藍 (31)',
    color_blue: '藍 (41)',
    color_purple: '紫 (51)',
    color_white: '白 (61)',
    single_on_button: '指定格亮燈',
    single_off_button: '指定格關燈',
    hint_demo: '* 以上為示範指令，實際效果需依裝置韌體為準。',
    footer_note: '僅支援啟用 Web Bluetooth 的瀏覽器（如 Chrome / Edge，需 HTTPS 或 localhost）。',
    status_disconnected: '狀態：尚未連線',
    status_searching: '狀態：搜尋藍牙裝置中…',
    status_connected: name => `狀態：已連線到 ${name || '裝置'}`,
    alert_no_bluetooth: '此瀏覽器不支援 Web Bluetooth，請使用 Chrome / Edge 並在 HTTPS 或 localhost 環境。',
    alert_connect_failed: msg => `連線失敗：${msg}`,
    alert_read_layout_failed: msg => `讀取 Layout 失敗：${msg}`,
    alert_send_led_failed: msg => `傳送燈光指令失敗：${msg}`,
    layout_info: (rows, cols, checksumOk) =>
      `行數(rows)=${rows}, 列數(cols)=${cols}, checksum=${checksumOk ? 'OK' : 'NG'}`,
    device_disconnected_event: '裝置已斷線',
    connected_with_notify_event: '已連線並啟用感測通知',
    level_text: v => {
      switch (v) {
        case 0:
          return '無按壓';
        case 1:
          return 'Level_1';
        case 2:
          return 'Level_2';
        case 3:
          return 'Level_3';
        default:
          return '未知';
      }
    },
    sensor_event: ({ rowIndex, colIndex, leftTop, leftBottom, rightBottom, rightTop }) =>
      `row=${rowIndex}, col=${colIndex}, sensors=[左上:${leftTop}, 左下:${leftBottom}, 右下:${rightBottom}, 右上:${rightTop}]`,
    error_no_led_write: '此瀏覽器不支援寫入 LED 特徵 (writeValue*)'
  }
};

function t(key, ...args) {
  const dict = translations[currentLang] || translations[LANG_EN];
  const value = dict[key];
  if (typeof value === 'function') {
    return value(...args);
  }
  return value != null ? value : key;
}

function applyStaticTranslations() {
  // document title
  document.title = t('title');
  document.documentElement.lang = currentLang;

  // elements with data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) {
      el.textContent = text;
    }
  });
}

function setLanguage(lang) {
  currentLang = lang === LANG_ZH ? LANG_ZH : LANG_EN;
  localStorage.setItem('whiz_lang', currentLang);
  applyStaticTranslations();
  // 依目前狀態更新幾個動態文字
  updateConnectionStatusUI();
}

function initLanguage() {
  const saved = localStorage.getItem('whiz_lang');
  currentLang = saved === LANG_ZH ? LANG_ZH : LANG_EN;
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', () => {
      setLanguage(langSelect.value);
    });
  }
  applyStaticTranslations();
}

const SERVICE_UUID = '0000fee0-0000-1000-8000-00805f9b34fb';
const LAYOUT_CHAR_UUID = '0000fee1-0000-1000-8000-00805f9b34fb';
const SENSOR_CHAR_UUID = '0000fee2-0000-1000-8000-00805f9b34fb';
const LED_CHAR_UUID = '0000fee3-0000-1000-8000-00805f9b34fb';

let device = null;
let server = null;
let layoutChar = null;
let sensorChar = null;
let ledChar = null;

// 由 Layout 解析到的行列數，用於全部亮/全部關
let layoutRows = 0;
let layoutCols = 0;

// Firebase / RTDB support
let firebaseEnabled = false;
let firebaseDb = null;
let sessionId = null;
const DEFAULT_GROUP_ID = 1; // per user request, default groupId = 1

function initFirebase() {
  try {
    if (window && window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey) {
      // using compat build included in index.html
      firebase.initializeApp(window.FIREBASE_CONFIG);
      firebaseDb = firebase.database();
      firebaseEnabled = true;
      console.log('Firebase RTDB enabled');
    } else {
      console.log('Firebase config not provided; RTDB disabled');
    }
  } catch (err) {
    console.error('Firebase init failed', err);
    firebaseEnabled = false;
    firebaseDb = null;
  }
}

const connectBtn = document.getElementById('connectBtn');
const connectionStatus = document.getElementById('connectionStatus');
const readLayoutBtn = document.getElementById('readLayoutBtn');
const layoutInfo = document.getElementById('layoutInfo');
const layoutRaw = document.getElementById('layoutRaw');
const sensorEvents = document.getElementById('sensorEvents');
const allRedBtn = document.getElementById('allRedBtn');
const allOffBtn = document.getElementById('allOffBtn');
const singleGreenBtn = document.getElementById('singleGreenBtn');
const singleOffBtn = document.getElementById('singleOffBtn');
const singleRowInput = document.getElementById('singleRow');
const singleColInput = document.getElementById('singleCol');
const singleColorInput = document.getElementById('singleColor');
const colorPresetButtons = document.querySelectorAll('.color-preset');

// 是否已連線，供語系切換時重算狀態文字
let isConnected = false;

function updateConnectionStatusUI() {
  if (isConnected) {
    connectionStatus.textContent = t('status_connected', device ? device.name : undefined);
  } else {
    connectionStatus.textContent = t('status_disconnected');
  }
}

function setConnectedUI(connected) {
  isConnected = connected;
  updateConnectionStatusUI();

  readLayoutBtn.disabled = !connected;
  allRedBtn.disabled = !connected;
  allOffBtn.disabled = !connected;
  singleGreenBtn.disabled = !connected;
  singleOffBtn.disabled = !connected;

  // 快選顏色按鈕在連線成功後才啟用
  colorPresetButtons.forEach(btn => {
    btn.disabled = !connected;
  });
}

function appendSensorEvent(text) {
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  sensorEvents.prepend(li);

  // 保留最新 50 筆
  while (sensorEvents.children.length > 50) {
    sensorEvents.removeChild(sensorEvents.lastChild);
  }
}

async function connect() {
  if (!navigator.bluetooth) {
    alert(t('alert_no_bluetooth'));
    return;
  }

  try {
    connectionStatus.textContent = t('status_searching');

    device = await navigator.bluetooth.requestDevice({
      // 依照 BLE Scanner 顯示的裝置名稱 WTS2 來篩選
      // 若之後型號有變，可以改成 namePrefix: 'WTS'
      filters: [
        {
          name: 'WTS2'
        }
      ],
      // 這裡列出之後要存取的 Service，包含自訂 FEE0
      optionalServices: [
        SERVICE_UUID,
        '00001800-0000-1000-8000-00805f9b34fb',
        '00001801-0000-1000-8000-00805f9b34fb'
      ]
    });

    device.addEventListener('gattserverdisconnected', () => {
      setConnectedUI(false);
      appendSensorEvent('裝置已斷線');
    });

    server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);

    layoutChar = await service.getCharacteristic(LAYOUT_CHAR_UUID);
    sensorChar = await service.getCharacteristic(SENSOR_CHAR_UUID);
    ledChar = await service.getCharacteristic(LED_CHAR_UUID);

    // 啟用感測通知
    await sensorChar.startNotifications();
    sensorChar.addEventListener('characteristicvaluechanged', handleSensorNotify);

    setConnectedUI(true);
    appendSensorEvent(t('connected_with_notify_event'));
    // create a session id for this connection (used when pushing events)
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    console.log('sessionId=', sessionId);

    // Auto-read layout 1s after connection to populate rows/cols
    setTimeout(() => {
      try {
        onReadLayout();
      } catch (e) {
        console.warn('Auto read layout failed', e);
      }
    }, 1000);
  } catch (err) {
    console.error(err);
    alert(t('alert_connect_failed', err.message));
    setConnectedUI(false);
  }
}

function parseLayout(value) {
  // value: DataView
  const len = value.byteLength;
  if (len < 2) {
    return { rows: 0, cols: 0, rawStates: [], validChecksum: false };
  }

  const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  const first = bytes[0];
  const rows = first >> 4;
  const cols = first & 0x0f;

  const checksumByte = bytes[bytes.length - 1];
  let xor = 0;
  for (let i = 0; i < bytes.length - 1; i++) {
    xor ^= bytes[i];
  }
  const validChecksum = xor === checksumByte;

  // 中間 bytes (1 ~ len-2) 為感測器 layout 資訊，每個 byte 4 個感測器
  const middle = bytes.slice(1, bytes.length - 1);

  return { rows, cols, rawStates: middle, validChecksum };
}

async function onReadLayout() {
  if (!layoutChar) return;

  try {
    const value = await layoutChar.readValue();
    const parsed = parseLayout(value);

    // 記住目前 layout 行列，讓全部亮/全部關可以套用到每一格
    layoutRows = parsed.rows;
    layoutCols = parsed.cols;

    layoutInfo.textContent = t('layout_info', parsed.rows, parsed.cols, parsed.validChecksum);

    // 顯示部分原始內容 (hex)
    const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    layoutRaw.textContent = hex;
  } catch (err) {
    console.error(err);
    alert(t('alert_read_layout_failed', err.message));
  }
}

function handleSensorNotify(event) {
  const value = event.target.value; // DataView
  const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

  // 每 2 bytes 一組資料
  for (let i = 0; i + 1 < bytes.length; i += 2) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];

    const rowIndex = b0 >> 4;
    const colIndex = b0 & 0x0f;

    // 四個感測器各 2 bit：最低的 2bit 為 sensor0，依此類推
    const s0 = b1 & 0b11;
    const s1 = (b1 >> 2) & 0b11;
    const s2 = (b1 >> 4) & 0b11;
    const s3 = (b1 >> 6) & 0b11;

    // 依韌體文件：2bit 對應感測器狀態
    // 00: 無按壓, 01: Level_1, 10: Level_2, 11: Level_3
    const levelText = v => translations[currentLang].level_text(v);

    // 依文件順序：左上、左下、右下、右上 四個位置
    const rightTop = `${s0}(${levelText(s0)})`;
    const rightBottom = `${s1}(${levelText(s1)})`;
    const leftBottom = `${s2}(${levelText(s2)})`;
    const leftTop = `${s3}(${levelText(s3)})`;

    appendSensorEvent(
      translations[currentLang].sensor_event({
        rowIndex,
        colIndex,
        leftTop,
        leftBottom,
        rightBottom,
        rightTop
      })
    );

    // Push press event to Firebase Realtime Database when any of the 4 sensors indicates a press
    try {
      const anyPressed = [s0, s1, s2, s3].some(v => v > 0);
      if (anyPressed && firebaseEnabled && firebaseDb) {
        const cols = layoutCols > 0 ? layoutCols : 16; // fallback columns if layout not read
        const matNumber = rowIndex * cols + colIndex + 1; // left-to-right, top-to-bottom numbering
        const dateIso = new Date().toISOString();
        const localized = new Date().toLocaleString('zh-Hant', { hour12: true });

        const payload = {
          date: dateIso,
          groupId: DEFAULT_GROUP_ID,
          matNumber,
          sessionId,
          timestamp: localized,
          // server-assigned timestamp for reliable sorting/querying
          serverTime: firebase.database.ServerValue.TIMESTAMP,
          // add grid coordinates and layout size
          rowIndex,
          colIndex,
          rows: layoutRows > 0 ? layoutRows : 0,
          cols,
          // per-position sensor values with text level mapping and Chinese names
          sensors: {
            leftTop: { code: s3, level: levelText(s3), nameZh: '左上' },
            leftBottom: { code: s2, level: levelText(s2), nameZh: '左下' },
            rightBottom: { code: s1, level: levelText(s1), nameZh: '右下' },
            rightTop: { code: s0, level: levelText(s0), nameZh: '右上' }
          },
          // explicit binary-to-level mapping for reference
          levelDefinitionsBinary: {
            '00': levelText(0),
            '01': levelText(1),
            '10': levelText(2),
            '11': levelText(3)
          }
        };

        firebaseDb.ref('mat_presses').push(payload);
        console.log('Firebase: pushed mat press', payload);
      }
    } catch (err) {
      console.error('Failed to push to Firebase', err);
    }
  }
}

// 燈光控制封包：依文件說明，採用 XOR checksum
function buildLedCommand(entries) {
  // entries: [{ row, col, mode, color }]
  // 文件定義：
  // Byte0 = 後續資料長度（只包含每組 3bytes 的資料，不含最後 checksum）
  // 之後每 3 bytes: Location, Mode, Color
  // 最後多 1 byte 為 XOR checksum
  const dataLength = entries.length * 3; // 只計算每組 3bytes 的資料長度
  const buffer = new Uint8Array(1 + dataLength + 1); // Byte0 + 資料 + checksum
  buffer[0] = dataLength;

  let offset = 1;
  for (const e of entries) {
    const loc = ((e.row & 0x0f) << 4) | (e.col & 0x0f);
    buffer[offset++] = loc;
    buffer[offset++] = e.mode & 0xff;
    buffer[offset++] = e.color & 0xff;
  }

  let xor = 0;
  // checksum = 先前所有 bytes 的 XOR（包含長度與資料，不含最後 checksum 本身）
  for (let i = 0; i < buffer.length - 1; i++) {
    xor ^= buffer[i];
  }
  buffer[buffer.length - 1] = xor;

  return buffer;
}

async function sendLedCommand(entries) {
  if (!ledChar) return;
  const cmd = buildLedCommand(entries);
  try {
    // 依照瀏覽器支援情況與特徵屬性，選擇合適的寫入方式
    if (typeof ledChar.writeValueWithoutResponse === 'function') {
      await ledChar.writeValueWithoutResponse(cmd);
    } else if (typeof ledChar.writeValue === 'function') {
      // 相容舊版 Web Bluetooth API
      await ledChar.writeValue(cmd);
    } else if (typeof ledChar.writeValueWithResponse === 'function') {
      await ledChar.writeValueWithResponse(cmd);
    } else {
      throw new Error(t('error_no_led_write'));
    }
  } catch (err) {
    console.error(err);
    alert(t('alert_send_led_failed', err.message));
  }
}

// 一些示範用的 mode：
// bit1~3: 亮燈位置, 0=整片亮
// bit4: 觸發機制, 0=直接觸發
// bit5~7: 回饋模式, 0=不指定
// bit8: 時間, 0=短
// 這裡先用「整片亮 + 直接觸發 + 不指定 + 短時間」=> 0x00
// 實際亮燈範圍由 Location (rowIndex/colIndex) 決定：
// - 全部亮紅/關燈：Location=0x00 (廣播)
// - 指定格：Location=非 0 值 (例如 0x11 代表 row=1,col=1)，以韌體實作為準
const MODE_SIMPLE_ON = 0x00;

// 全部亮紅 (顏色索引 1)
async function onAllRed() {
  const color = Number(singleColorInput.value) | 0;

  // 若已讀取過 Layout，依行列對每一格下指令；否則退回單一 (0,0)
  if (layoutRows > 0 && layoutCols > 0) {
    const entries = [];
    for (let r = 0; r < layoutRows; r++) {
      for (let c = 0; c < layoutCols; c++) {
        entries.push({ row: r, col: c, mode: MODE_SIMPLE_ON, color });
      }
    }
    await sendLedCommand(entries);
  } else {
    await sendLedCommand([{ row: 0, col: 0, mode: MODE_SIMPLE_ON, color }]);
  }
}

// 全部關燈 (顏色索引 0, 黑)
async function onAllOff() {
  if (layoutRows > 0 && layoutCols > 0) {
    const entries = [];
    for (let r = 0; r < layoutRows; r++) {
      for (let c = 0; c < layoutCols; c++) {
        entries.push({ row: r, col: c, mode: MODE_SIMPLE_ON, color: 0 });
      }
    }
    await sendLedCommand(entries);
  } else {
    await sendLedCommand([{ row: 0, col: 0, mode: MODE_SIMPLE_ON, color: 0 }]);
  }
}

// 指定格亮燈
async function onSingleGreen() {
  // 依文件假設 rowIndex/colIndex 從 1 開始，0 可能作為廣播值
  // UI 輸入為 1-based，送出時直接使用
  const row = Number(singleRowInput.value) | 0;
  const col = Number(singleColInput.value) | 0;
  const color = Number(singleColorInput.value) | 0; // 預設 21 (綠色)

  await sendLedCommand([{ row, col, mode: MODE_SIMPLE_ON, color }]);
}

// 指定格關燈（顏色索引 0）
async function onSingleOff() {
  const row = Number(singleRowInput.value) | 0;
  const col = Number(singleColInput.value) | 0;
  await sendLedCommand([{ row, col, mode: MODE_SIMPLE_ON, color: 0 }]);
}

connectBtn.addEventListener('click', () => {
  connect();
});

readLayoutBtn.addEventListener('click', () => {
  onReadLayout();
});

allRedBtn.addEventListener('click', () => {
  onAllRed();
});

allOffBtn.addEventListener('click', () => {
  onAllOff();
});

singleGreenBtn.addEventListener('click', () => {
  onSingleGreen();
});

singleOffBtn.addEventListener('click', () => {
  onSingleOff();
});

// 主要顏色快選：點選後直接帶入顏色索引
colorPresetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = Number(btn.dataset.color) | 0;
    singleColorInput.value = String(val);
  });
});

// 初始化語系後再設定 UI 狀態
initLanguage();
// 初始化 Firebase（若在 index.html 提供 window.FIREBASE_CONFIG）
initFirebase();
setConnectedUI(false);
