// DOM要素の取得
const darkModeToggle = document.getElementById('darkModeToggle');
const themeRadios = document.querySelectorAll('input[name="theme"]');
const container = document.querySelector('.container');

// ポップアップのスタイル設定
function setupPopupStyle() {
  // CSSで管理するため、JSでのスタイル設定は基本的に不要
  // document.body.style.backgroundColor = 'transparent';
  // document.documentElement.style.backgroundColor = 'transparent';
  // document.body.style.borderRadius = 'var(--border-radius)'; // CSSで設定
  // document.body.style.overflow = 'hidden'; // CSSで設定
  // document.body.style.border = 'none'; // CSSで設定
  // document.documentElement.style.border = 'none'; // CSSで設定
  // document.body.style.padding = '0'; // CSSで設定
  
  // コンテナのスタイルもCSSで管理
  /*
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => {
    // container.style.borderRadius = 'calc(var(--border-radius) - 2px)'; 
    // container.style.overflow = 'hidden';
    // container.style.border = 'none';
    // container.style.height = '100%';
  });
  */
}

// テーマに基づいてアクセントカラーを設定
function updateAccentColor(theme) {
  let accentColor;
  switch(theme) {
    case 'theme1':
      accentColor = '#bb86fc';
      break;
    case 'theme2':
      accentColor = '#64b5f6';
      break;
    case 'theme3':
      accentColor = '#64ffda';
      break;
    default:
      accentColor = '#bb86fc';
  }
  
  document.documentElement.style.setProperty('--primary-light', accentColor);
  
  // アクセントカラーに合わせたアニメーション効果 (ShadowはCSSで管理)
}

// 設定を読み込んで表示を初期化
document.addEventListener('DOMContentLoaded', () => {
  // setupPopupStyle(); // スタイルはCSSで設定するので不要かも
  
  // 初期アニメーションのための遅延 (フェードインはCSSで行う)
  /*
  setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.border = 'none'; 
    document.documentElement.style.border = 'none';
  }, 100);
  */
  
  // ストレージから設定を読み込む
  chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
    if (result.darkModeEnabled !== undefined) {
      darkModeToggle.checked = result.darkModeEnabled;
    }
    
    const theme = result.selectedTheme || 'theme1';
    const themeRadio = document.getElementById(theme);
    if (themeRadio) {
      themeRadio.checked = true;
      updateAccentColor(theme);
    }
  });
  
  // MutationObserverもスタイル操作が不要になったため削除可能
  /*
  const observer = new MutationObserver(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
  });
  
  observer.observe(document.body, { 
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });
  */
});

// ダークモードトグルの変更イベント
darkModeToggle.addEventListener('change', () => {
  const isEnabled = darkModeToggle.checked;
  
  // トグル切り替えアニメーション
  const slider = document.querySelector('.slider');
  slider.classList.add('active');
  setTimeout(() => slider.classList.remove('active'), 400);
  
  // 設定を保存
  chrome.storage.sync.set({ darkModeEnabled: isEnabled }, () => {
    // 現在のタブにメッセージを送信
    sendMessageToActiveTab({
      action: isEnabled ? 'enableDarkMode' : 'disableDarkMode',
      theme: getSelectedTheme()
    });
  });
});

// テーマ選択の変更イベント
themeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      const selectedTheme = radio.value;
      
      // アクセントカラーを更新
      updateAccentColor(selectedTheme);
      
      // 設定を保存
      chrome.storage.sync.set({ selectedTheme: selectedTheme }, () => {
        // ダークモードが有効な場合のみ、テーマを即時適用
        if (darkModeToggle.checked) {
          sendMessageToActiveTab({
            action: 'changeTheme',
            theme: selectedTheme
          });
        }
      });
    }
  });
});

// 現在アクティブなタブにメッセージを送信する関数
function sendMessageToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      try {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.debug('メッセージ送信エラー:', chrome.runtime.lastError);
            // エラーを無視（コンテンツスクリプトがロードされていない可能性）
          }
        });
      } catch (error) {
        console.debug('メッセージ送信エラー:', error);
      }
    }
  });
}

// 現在選択されているテーマを取得する関数
function getSelectedTheme() {
  const selectedRadio = document.querySelector('input[name="theme"]:checked');
  return selectedRadio ? selectedRadio.value : 'theme1';
} 