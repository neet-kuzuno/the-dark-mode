// ダークモードCSS要素用のID
const DARK_MODE_STYLE_ID = 'the-dark-mode-style';

// --- テーマスタイル定義 ---
const THEME_STYLES = {
    theme1: `
    /* Theme 1: Classic (Dark Gray) - Preview: #121212 / #e0e0e0 */
    html, body {
        background-color: #121212 !important;
        color: #e0e0e0 !important;
    }
    div, section, article, aside, nav, header, footer, main, p, li, ul, ol {
        background-color: inherit !important;
        color: inherit !important;
        border-color: #333 !important;
        box-shadow: none !important;
    }
    h1, h2, h3, h4, h5, h6 { color: #ffffff !important; }
    a { color: #bb86fc !important; }
    img, video, svg, canvas, iframe:not([src*="chrome-extension://"]) {
        filter: brightness(.8) contrast(0.95) !important;
        transition: filter 0.3s ease;
    }
    /* PDFビューア固有スタイル */
    #viewerContainer { background-color: #222 !important; }
    .toolbar { background-color: #333 !important; border-bottom: 1px solid #444 !important; }
    .toolbarButton, .splitToolbarButton { color: #ccc !important; }
    .toolbarButton:hover, .splitToolbarButton:hover { background-color: #555 !important; color: #fff !important; }
    #thumbnailView, #sidebarContent { background-color: #2a2a2a !important; }
    .thumbnail.selected > .thumbnailSelectionRing { border: 2px solid #bb86fc !important; }
    .page { border: 1px solid #444 !important; background-color: #ccc !important; }
    `,
    theme2: `
    /* Theme 2: Black - Preview: #000000 / #bbbbbb */
    html, body {
        background-color: #000000 !important;
        color: #bbbbbb !important;
    }
    div, section, article, aside, nav, header, footer, main, p, li, ul, ol {
        background-color: inherit !important;
        color: inherit !important;
        border-color: #333 !important; /* 濃いボーダー */
        box-shadow: none !important;
    }
    h1, h2, h3, h4, h5, h6 { color: #dddddd !important; }
    a { color: #6b9ac4 !important; } /* 少し青みがかった白 */
    img, video, svg, canvas, iframe:not([src*="chrome-extension://"]) {
        filter: brightness(.75) contrast(1) !important; /* 画像をより暗く */
        transition: filter 0.3s ease;
    }
    /* PDFビューア固有スタイル (Blackテーマに合わせて調整) */
    #viewerContainer { background-color: #0a0a0a !important; }
    .toolbar { background-color: #111 !important; border-bottom: 1px solid #333 !important; }
    .toolbarButton, .splitToolbarButton { color: #aaa !important; }
    .toolbarButton:hover, .splitToolbarButton:hover { background-color: #222 !important; color: #ddd !important; }
    #thumbnailView, #sidebarContent { background-color: #0e0e0e !important; }
    .thumbnail.selected > .thumbnailSelectionRing { border: 2px solid #6b9ac4 !important; }
    .page { border: 1px solid #333 !important; background-color: #bbb !important; } /* PDFページ背景 */
    `,
    theme3: `
    /* Theme 3: Dark Blue - Preview: #0a192f / #64ffda */
    html, body {
        background-color: #0a192f !important; /* プレビューに合わせた濃い青 */
        color: #8892b0 !important; /* やや彩度低めのテキスト色 */
    }
    div, section, article, aside, nav, header, footer, main, p, li, ul, ol {
        background-color: inherit !important;
        color: inherit !important;
        border-color: #172a45 !important; /* 青系のボーダー */
        box-shadow: none !important;
    }
    h1, h2, h3, h4, h5, h6 { color: #ccd6f6 !important; }
    a { color: #64ffda !important; } /* プレビューに合わせたアクセントカラー */
    img, video, svg, canvas, iframe:not([src*="chrome-extension://"]) {
        filter: brightness(.8) contrast(1) !important;
        transition: filter 0.3s ease;
    }
    /* PDFビューア固有スタイル (Dark Blueテーマに合わせて調整) */
    #viewerContainer { background-color: #0f213d !important; }
    .toolbar { background-color: #112a4a !important; border-bottom: 1px solid #173a5f !important; }
    .toolbarButton, .splitToolbarButton { color: #8892b0 !important; }
    .toolbarButton:hover, .splitToolbarButton:hover { background-color: #173a5f !important; color: #ccd6f6 !important; }
    #thumbnailView, #sidebarContent { background-color: #0f2744 !important; }
    .thumbnail.selected > .thumbnailSelectionRing { border: 2px solid #64ffda !important; }
    .page { border: 1px solid #173a5f !important; background-color: #a8b2d1 !important; } /* PDFページ背景 */
    `
};

console.log('The Dark Mode: コンテンツスクリプト document_start');

// --- ★変更点：初期スタイルの即時注入 --- (THEME_STYLES定義後に配置)
function injectInitialStyle() {
  // 既に存在する場合は何もしない（複数回実行防止）
  if (document.getElementById(DARK_MODE_STYLE_ID)) {
    return;
  }

  const initialTheme = 'theme1'; // デフォルトテーマ
  if (!THEME_STYLES[initialTheme]) {
      console.error('The Dark Mode: 初期テーマ theme1 が見つかりません');
      return;
  }
  const initialCssContent = THEME_STYLES[initialTheme];

  const styleElement = document.createElement('style');
  styleElement.id = DARK_MODE_STYLE_ID;
  styleElement.type = 'text/css';
  styleElement.textContent = initialCssContent;

  // head がまだ存在しない場合もあるため、documentElement をターゲットにする
  const target = document.head || document.documentElement;
  if (target) {
      // 可能な限り早く挿入するため、先頭に追加
      target.insertBefore(styleElement, target.firstChild);
      console.log('The Dark Mode: 初期スタイル(theme1)を即時注入しました');
  } else {
      console.error('The Dark Mode: 初期スタイル注入先(head/documentElement)が見つかりません');
  }
}

// スクリプト読み込み直後に初期スタイルを注入 (THEME_STYLES定義後に呼び出す)
injectInitialStyle();

// --- 初期設定の読み込みと調整 --- (THEME_STYLES定義後に配置)
function initializeDarkMode() {
  console.log('The Dark Mode: 初期化処理(DOMContentLoaded)を開始します');
  chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
    console.log('The Dark Mode: 保存された設定:', result);
    const effectiveTheme = result.selectedTheme || 'theme1'; // デフォルトはtheme1

    if (result.darkModeEnabled) {
        console.log('ダークモード有効。選択テーマ:', effectiveTheme);
        // 初期注入されたスタイル(theme1)と選択テーマが異なる場合のみ上書き
        if (effectiveTheme !== 'theme1') {
            applyDarkMode(effectiveTheme); // スタイルタグの内容を書き換える
        } else {
            console.log('選択テーマが初期テーマ(theme1)と同じため、スタイルの上書きは不要です。');
            // 必要であればPDFオブザーバーの設定などをここで行う
             setupPdfObserverIfNeeded();
        }
    } else {
      console.log('ダークモード無効。初期注入スタイルを削除します。');
      // ダークモードが無効なら初期注入したスタイルを削除
      removeDarkModeStyleTag();
    }
    // PDFビューアの監視は、最終的な状態が確定してから開始
    // setupPdfObserverIfNeeded(); // applyDarkMode と removeDarkModeStyleTag 内で呼び出すように変更
  });
}

// DOMContentLoaded を待ってから初期化/調整を行う。
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDarkMode);
} else {
  initializeDarkMode();
}

// メッセージリスナーを設定
chrome.runtime.onMessage.addListener(handleMessage);

// メッセージハンドラー関数 (調整)
function handleMessage(message) {
  try {
    console.log('The Dark Mode: メッセージを処理します', message);
    switch (message.action) {
      case 'enableDarkMode':
        applyDarkMode(message.theme || 'theme1'); // スタイルタグがなければ作成、あれば内容上書き
        break;
      case 'disableDarkMode':
        removeDarkModeStyleTag(); // スタイルタグを削除
        break;
      case 'changeTheme':
         // 有効状態を確認してから適用（applyDarkModeがタグ存在チェック＆上書きを行う）
         chrome.storage.sync.get(['darkModeEnabled'], (result) => {
           if (result.darkModeEnabled) {
               applyDarkMode(message.theme);
           } else {
               // ダークモードが無効な状態でテーマ変更メッセージが来た場合は、
               // スタイルが残らないように念のため削除しておく
               removeDarkModeStyleTag();
           }
        });
        break;
      default:
        console.warn('The Dark Mode: 不明なアクション', message.action);
    }
  } catch (error) {
    console.error('The Dark Mode: メッセージ処理中にエラーが発生しました', error);
  }
}

// PDFビューア監視設定 (必要に応じて呼び出す)
let pdfObserver = null;
function setupPdfObserverIfNeeded() {
    // PDFビューア監視ロジックをここに移動または呼び出す
    if (isPdfViewer()) {
        setupPdfObserver();
    } else {
        // PDFビューアでない場合は既存のオブザーバーを停止
        if (pdfObserver) {
            pdfObserver.disconnect();
            pdfObserver = null;
            console.log('The Dark Mode: PDFビューア監視を停止しました');
        }
    }
}

function isPdfViewer() {
    // PDFビューアかどうかを判定するロジック (変更なし)
    return document.body && document.body.children.length > 0 &&
           document.body.children[0].type === 'application/pdf' &&
           document.body.children[0].id === 'plugin';
}

function setupPdfObserver() {
    // PDFビューアのDOM変更を監視する MutationObserver の設定 (変更なし)
     if (pdfObserver) return; // 既に設定済みなら何もしない

    const targetNode = document.body;
    if (!targetNode) {
        console.warn('The Dark Mode: PDF監視対象(body)が見つかりません');
        return;
    }

    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        console.log('The Dark Mode: PDFビューアのDOM変更を検出');
         chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
            if (result.darkModeEnabled) {
                 console.log('PDFビューア変更検出：ダークモード再適用試行');
                 applyDarkMode(result.selectedTheme || 'theme1');
             }
         });
    };

    pdfObserver = new MutationObserver(callback);
    pdfObserver.observe(targetNode, config);
    console.log('The Dark Mode: PDFビューアのDOM監視を開始しました');

    // 初期ロード時にも適用
     chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
         if (result.darkModeEnabled) {
             applyDarkMode(result.selectedTheme || 'theme1');
         }
     });
}

// ダークモードを適用する関数 (スタイルタグ書き換え/作成方式)
function applyDarkMode(theme = 'theme1') {
  console.log('The Dark Mode: applyDarkMode (書き換え/作成方式) が呼び出されました', theme);

  if (!THEME_STYLES[theme]) {
    console.error('The Dark Mode: テーマが見つかりません:', theme);
    theme = 'theme1'; // フォールバック
  }
  const cssContent = THEME_STYLES[theme];

  // ★★★ 修正: 先に挿入先を確保する ★★★
  let target = document.head;
  if (!target) {
      console.warn('The Dark Mode: document.head が見つかりません。documentElement を試します。');
      target = document.documentElement;
  }
  if (!target) {
      console.warn('The Dark Mode: document.documentElement も見つかりません。body を試します。');
      target = document.body;
  }

  // ★★★ 挿入先が見つかった場合のみ処理 ★★★
  if (target && typeof target.insertBefore === 'function') {
    let styleElement = document.getElementById(DARK_MODE_STYLE_ID);

    if (styleElement) {
      // 既存のスタイルタグがあれば内容を書き換え
      if (styleElement.textContent !== cssContent) {
          styleElement.textContent = cssContent;
          console.log(`The Dark Mode: 既存スタイルタグの内容をテーマ[${theme}]に更新しました`);
          // ★ 追加: 既存タグ更新成功時もPDFオブザーバー設定
          setupPdfObserverIfNeeded();
      } else {
          console.log(`The Dark Mode: スタイルタグの内容は既にテーマ[${theme}]です`);
      }
    } else {
      // なければ新規作成して挿入
      console.warn('The Dark Mode: スタイルタグが見つからないため、新規作成して挿入を試みます (applyDarkMode内)');
      const newStyleElement = document.createElement('style'); // 変数名を変更
      newStyleElement.id = DARK_MODE_STYLE_ID;
      newStyleElement.type = 'text/css';
      newStyleElement.textContent = cssContent;

      // ★★★ 挿入処理を関数化し、再試行ロジックを追加 ★★★
      let attempts = 0;
      const maxAttempts = 5; // 最大5回試行
      const delay = 100; // 100ミリ秒待つ

      function tryInsertStyle() {
        attempts++;
        console.log(`The Dark Mode: スタイル挿入試行 ${attempts}/${maxAttempts}`);

        // 挿入先を毎回再検索 (target 変数は外側のスコープのものを使う)
        let currentTarget = document.head;
        if (!currentTarget) currentTarget = document.documentElement;
        if (!currentTarget) currentTarget = document.body;

        if (currentTarget && typeof currentTarget.insertBefore === 'function') {
          try {
            currentTarget.insertBefore(newStyleElement, currentTarget.firstChild);
            console.log(`The Dark Mode: 新しいスタイルタグ(テーマ[${theme}])を ${currentTarget.tagName} に挿入成功 (試行 ${attempts}回)`);
            // 成功したらPDFオブザーバー設定
            setupPdfObserverIfNeeded();
          } catch (e) {
            console.error(`The Dark Mode: スタイル挿入試行 ${attempts}回目 エラー:`, e, ' Target:', currentTarget);
            if (attempts < maxAttempts) {
              console.log(`The Dark Mode: ${delay}ms後に再試行します...`);
              setTimeout(tryInsertStyle, delay);
            } else {
              console.error('The Dark Mode: スタイル挿入の最大試行回数を超えました。挿入を諦めます。');
              // 失敗してもPDFオブザーバー設定は試みる
              setupPdfObserverIfNeeded();
            }
          }
        } else {
          console.error(`The Dark Mode: 有効な挿入先が見つかりません (試行 ${attempts}回)`);
          if (attempts < maxAttempts) {
            console.log(`The Dark Mode: ${delay}ms後に再試行します...`);
            setTimeout(tryInsertStyle, delay);
          } else {
            console.error('The Dark Mode: 挿入先の最大試行回数を超えました。挿入を諦めます。');
             // 失敗してもPDFオブザーバー設定は試みる
             setupPdfObserverIfNeeded();
          }
        }
      }
      // 最初の挿入試行を開始
      tryInsertStyle();
      // ★★★ ここまで変更 ★★★
    }
  } else {
      // ★ 挿入先が最初から見つからなかった場合のエラーログ (以前の else ブロック)
      console.error('The Dark Mode: 有効なスタイル適用先(head/documentElement/body)が初期段階で見つかりません (applyDarkMode内)', 'Target:', target);
      // この場合もPDFオブザーバーは念のため呼ぶ
      setupPdfObserverIfNeeded();
  }

  // ★ 注意: setupPdfObserverIfNeeded の呼び出し位置を修正
  // PDFオブザーバーは成功時 or リトライ終了時に tryInsertStyle 内で呼ばれるか、
  // 既存タグ更新成功時に呼ばれるか、
  // 初期ターゲット探索失敗時に呼ばれるため、ここでの呼び出しは不要
  // setupPdfObserverIfNeeded(); 

}

// ダークモードを削除する関数
function removeDarkModeStyleTag() {
  const styleElement = document.getElementById(DARK_MODE_STYLE_ID);
  if (styleElement) {
    styleElement.remove();
    console.log('The Dark Mode: ダークモードスタイルを削除しました');
  } else {
    console.log('The Dark Mode: ダークモードスタイルが見つかりません');
  }
}