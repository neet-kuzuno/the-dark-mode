// インストール時やアップデート時の初期化処理
chrome.runtime.onInstalled.addListener(() => {
  console.log('The Dark Mode: 拡張機能がインストール/更新されました');
  // デフォルト設定
  chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
    // 初期状態がまだ設定されていない場合のみデフォルト値を設定
    if (result.darkModeEnabled === undefined) {
      chrome.storage.sync.set({ darkModeEnabled: false });
      console.log('The Dark Mode: darkModeEnabled の初期値を false に設定しました');
    } else {
      console.log('The Dark Mode: 既存の darkModeEnabled 値:', result.darkModeEnabled);
    }
    
    if (!result.selectedTheme) {
      chrome.storage.sync.set({ selectedTheme: 'theme1' });
      console.log('The Dark Mode: selectedTheme の初期値を theme1 に設定しました');
    } else {
      console.log('The Dark Mode: 既存の selectedTheme 値:', result.selectedTheme);
    }
  });
});

// タブの更新時にダークモードを適用する処理
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && 
      (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    
    console.log('The Dark Mode: タブが更新されました', tabId, tab.url);
    
    // ダークモードの設定を取得
    chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
      console.log('The Dark Mode: 現在の設定', result);
      
      if (result.darkModeEnabled) {
        // ダークモードが有効な場合、スタイルを適用
        const theme = result.selectedTheme || 'theme1';
        console.log('The Dark Mode: タブにダークモードを適用します', tabId, theme);
        
        // タブにメッセージを送信してダークモードを適用
        setTimeout(() => {
          try {
            chrome.tabs.sendMessage(tabId, {
              action: 'enableDarkMode',
              theme: theme
            }, (response) => {
              if (chrome.runtime.lastError) {
                // エラーが発生した場合は、content scriptがまだロードされていない可能性がある
                // そのため、エラーを無視する（content scriptがロードされれば自動的に適用される）
                console.debug('The Dark Mode: タブへのメッセージ送信エラー:', chrome.runtime.lastError);
                
                // 再試行（しばらく待ってからもう一度）
                setTimeout(() => {
                  try {
                    chrome.tabs.sendMessage(tabId, {
                      action: 'enableDarkMode',
                      theme: theme
                    });
                  } catch (error) {
                    console.debug('The Dark Mode: 再試行でのエラー:', error);
                  }
                }, 1000);
              } else {
                console.log('The Dark Mode: ダークモードが正常に適用されました', response);
              }
            });
          } catch (error) {
            console.debug('The Dark Mode: タブへのメッセージ送信エラー:', error);
          }
        }, 500); // タブが完全に読み込まれるまで少し待つ
      }
    });
  }
});

// タブがアクティブになった時に設定を再チェック
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('The Dark Mode: タブがアクティブになりました', activeInfo.tabId);
  
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
      console.log('The Dark Mode: アクティブタブのURL', tab.url);
      
      // ダークモードの設定を取得
      chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (result) => {
        console.log('The Dark Mode: 現在の設定', result);
        
        if (result.darkModeEnabled) {
          // ダークモードが有効な場合、スタイルを適用
          const theme = result.selectedTheme || 'theme1';
          console.log('The Dark Mode: アクティブタブにダークモードを適用します', activeInfo.tabId, theme);
          
          // タブにメッセージを送信してダークモードを適用
          setTimeout(() => {
            try {
              chrome.tabs.sendMessage(activeInfo.tabId, {
                action: 'enableDarkMode',
                theme: theme
              }, (response) => {
                if (chrome.runtime.lastError) {
                  // エラー処理（content scriptがロードされていない可能性があるため無視）
                  console.debug('The Dark Mode: アクティブタブへのメッセージ送信エラー:', chrome.runtime.lastError);
                  
                  // 再試行
                  setTimeout(() => {
                    try {
                      chrome.tabs.sendMessage(activeInfo.tabId, {
                        action: 'enableDarkMode',
                        theme: theme
                      });
                    } catch (error) {
                      console.debug('The Dark Mode: 再試行でのエラー:', error);
                    }
                  }, 1000);
                } else {
                  console.log('The Dark Mode: ダークモードが正常に適用されました', response);
                }
              });
            } catch (error) {
              console.debug('The Dark Mode: アクティブタブへのメッセージ送信エラー:', error);
            }
          }, 500); // 少し待ってから適用
        }
      });
    }
  });
}); 