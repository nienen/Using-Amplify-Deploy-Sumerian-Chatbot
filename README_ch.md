## 利用Amazon Lex 與 AWS Amplify 實作無服務器虛擬助理應用程式

## 前言

<center>
<img src="./images/001-Architecture diagram-01.png" alt="001-Architecture diagram-01.png">
</center>

Amazon Lex 是一個能部署在應用程式並使用語音或文字建立交談介面的服務，它提供自動語音辨識 (ASR) 的深度學習功能，將語音轉換為文字，再利用自然語言理解 (NLU) 來辨識文字的含義，讓使用者能夠體驗到逼真的交談與互動。

AWS Amplify 是一個能輕鬆建立程式專案，並迅速部署 AWS 服務於專案之中，並提供簡單的架構將後端與常見的前端整合。

Amazon Sumerian 是一個無須任何 3D 圖形的專業知識便可以輕鬆快速地打造虛擬實境 (VR)、擴增實境 (AR)、和 3D 應用程式，並可在各種常見的頭戴式裝置與行動裝置上執行。

## 情境
我們將利用 AWS Lex 語言深度學習功能建立語音機器人，並結合 Amazon Sumerian 的人物場景，再利用 AWS Amplify 迅速的輸出應用程式並部署在頭戴式裝置或行動裝置中，創造出栩栩如生的互動式語音助理。

## 事前準備

- 地區請選擇 US East (N. Virginia)
- 建議使用 [VScode](https://code.visualstudio.com/)，因為它能同時操作終端機與編輯專案。(當然你也能使用其他的)

## 步驟

### 利用 Amazon Lex 打造語音機器人

首先，我們為了簡化流程而選用 Amazon Lex 預設的 "BookTrip" 範本來打造這次語音機器人的主題。機器人會偵測設定好的關鍵語句來判斷使用者意圖，並回覆相關對話或做出對應行動，以此範本為例，機器人會不斷圍繞在 "BookTrip" 這個主題上詢問使用者，最後做出訂房或租車的動作。

- 在 __Service__ 選單中，選擇 __Amazon Lex__ 後，點選 __Create__ 來創建一個語音機器人。

- 選擇 __BookTrip__ 這個範本，輸入 __Bot name__ : `yourbotname` 後選擇 __Create__。

<center>
<img src="./images/002-Amazon Lex_create-01.jpg" alt="002-Amazon Lex_create-01.jpg">
</center>

- 點入剛剛創建的語音機器人，開啟 __Settings__ 選項並選擇 __Aliases__。
    
    - 設定如下:

        - __Alias name__ : `test`

        - __Bot version__ : `latest`
        > 每次匯出機器人都需要設定 Alias name ，以區分的不同版本。 

- 點選 __PLUS__ 新增一個新的版本。

<center>
<img src="./images/003-Amazon Lex_alias-01.jpg" alt="003-Amazon Lex_alias-01.jpg">
</center>

- 選擇 __Publish__。

    - __Choose an alias__ : `test `，並選擇 __Publish__。

<center>
<img src="./images/004-Amazon Lex_publish-01.jpg" alt="004-Amazon Lex_publish-01.jpg">
</center>

> 等待匯出結束後便可關閉網頁。

### 安裝 AWS Amplify CLI

接著我們開啟 VScode 的終端機，使用 command line 來安裝 AWS Amplify CLI。(你也可以使用 Windows 的 " CMD命令提示字元 " 或 MacOS 的 " Terminal "來下安裝指令)

- 請先確認是否安裝 [Node.js](https://nodejs.org/en/download/) 與 [npm](https://www.npmjs.com/get-npm)。

> 安裝後請先重新開機，確保電腦可以使用此套件。

- 輸入 `node -v` 與 `npm -v` 指令，來確認 Node.js 與 npm 的版本。

    - Node.js : 8.x.x (至少)。

    - npm : 5.x.x  (至少)。

<center>
<img src="./images/005-Amazon Amplify_install-01.jpg" alt="005-Amazon Amplify_install-01.jpg">
</center>

- 輸入 `npm install -g @aws-amplify/cli` 來下載 __Amplify CLI__。

- 輸入 `amplify configure` 設定 Amplify CLI。

> 如果你已經有 IAM User，可以按 Enter 跳過前兩個問題，並直接輸入你的 __accessKeyId & secretAccessKey__。


<center>
<img src="./images/006-Amazon Amplify_configure-01.jpg" alt="006-Amazon Amplify_congigure-01.jpg">
</center>

<center>
<img src="./images/007-Amazon Amplify_configure-02.jpg" alt="007-Amazon Amplify_configure-02.jpg">
</center>



- 使用 `npx create-react-app sumerian-amplify-app` 創建一個應用程式專案，在此命名為 `sumerian-amplify-app`。

> 專案預設路徑 __C:\Users\USER\sumerian-amplify-app__。

- 輸入 `cd sumerian-amplify-app` 指令，會進入專案資料夾。


- 輸入 `npm install aws-amplify aws-amplify-react --save` 來安裝 __aws-amplify__ 與 __aws-amplify-react__ 這兩個套件。


### 初始化 AWS Amplify 專案
我們已經建立好應用程式專案與安裝 AWS Amplify CLI ，在開始設計程式之前，我們必需先使用 AWS 帳號初始化 AWS Amplify 的相關設定，以便日後此專案與 AWS 其他服務整合能夠順利進行。

- 替你的應用程式在雲端上初始化，輸入 `amplify init` 指令。

> 需要選擇一些相關設定，如下圖。

<center>
<img src="./images/008-Amazon Amplify_init-01.jpg" alt="008-Amazon Amplify_init-01.jpg">
</center>


- 選擇 __NO__ 當問到 __"Do you want to use an AWS profile"__ 時，接著輸入你 AWS 帳號的 __accessKeyId__ 與 __secretAccessKey__。

<center>
<img src="./images/009-Amazon Amplify_init-02.jpg" alt="009-Amazon Amplify_init-02.jpg">
</center>

- 選擇 `us-east-1` 區域。

<center>
<img src="./images/010-Amazon Amplify_init-03.jpg" alt="010-Amazon Amplify_init-03.jpg">
</center>

> 初始化需要花費三至五分鐘，成功後會如下圖。


<center>
<img src="./images/011-Amplify Init_success-01.jpg" alt="011-Amplify Init_success-01.jpg">
</center>

- 利用 `amplify push` 指令將你的設定同步上雲端。

    > 完成初始設定後便開始應用程式的設計。

- 使用 [VScode](https://code.visualstudio.com/) 打開先前創好的 __sumerian-amplify-app__ 專案。

- 修改 __App.js__ 中的程式碼。
    
    修改第 13 行的 `your_scene_region`。
    > 範例 : us-east-1。

    修改第 15 與 28 行的 `your_scene_name`。

```
import React, { Component } from 'react';
import './App.css';
import aws_exports from './aws-exports';
import Amplify, { XR } from 'aws-amplify';
import scene_config from './sumerian-exports';
import { withAuthenticator, SumerianScene  } from 'aws-amplify-react';
import AWS from 'aws-sdk';
new AWS.Polly();


 XR.configure({ // XR category configuration
   SumerianProvider: { // Sumerian-specific configuration
     region: '<your_scene_region>', // Sumerian scene region
     scenes: {
       "<your_scene_name>": {   // Friendly scene name
           sceneConfig: scene_config // Scene JSON configuration
         },
     }
   }
 });

 Amplify.configure(aws_exports);

 class App extends Component {
    render() {
      return (
        <body> {}
          <SumerianScene sceneName='<your_scene_name>'/>
        </body>
      );
    }
  }

 export default withAuthenticator(App, { includeGreetings: true });
```
- 在 __Index.css__ 中加入以下程式碼。

```
body {
  height: 600px;
}
```

### 替應用程式建立身分驗證
我們使用 AWS Amplify 建立應用程式的身分驗證功能，這只是 AWS Amplify 內建模組中的其中一個功能，倘若你需要替應用程式新增更多功能，請參考 [AWS Amplify](https://aws-amplify.github.io/docs/)。

- 輸入 `cd sumerian-amplify-app` 指令進入 __sumerian-amplify-app__ 資料夾。

- 輸入 `amplify add auth` ，選擇 __Yes__ 使用預設的 CloudFormation stack。

<center>
<img src="./images/012-add auth_config-01.jpg" alt="012-add auth_config-01.jpg">
</center>

> AWS Amplify 會自動於 AWS Cognito 中新增 Identity pool。

- 輸入 `amplify push` 在雲端上同步剛剛的設定。

> 同步需要花三至五分鐘。


- 開啟 `sumerian-amplify-app`專案中的 __amplify__ 資料夾，展開 __backend__ 資料夾，並打開 __amplify-meta.jason__。

<center>
<img src="./images/013-open file_update-01.jpg" alt="013-open file_update-01.jpg">
</center>

- 記下 __UnauthRoleName__ 、 __AuthRoleName__ 與 __IdentityPoolName__，之後的步驟會使用到。


<center>
<img src="./images/014-copy rolename_copy-01.jpg" alt="014-copy rolename_copy-01.jpg">
</center>

<center>
<img src="./images/015-copy rolename_copy-02.jpg" alt="015-copy rolename_copy-02.jpg">
</center>


- 回到 AWS 主控台，選擇 __Services__，選擇 __IAM__。


- 選擇左側選單的 __Roles__，搜尋剛剛記下的 __UnAuthRoleName__ 並點擊進入。

- 選擇 __Add inline policy__。


<center>
<img src="./images/016-add policy_add-01.jpg" alt="016-add policy_add-01.jpg">
</center>

- 選擇使用 __JSON__，貼上以下程式碼。

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:DescribeAlarmsForMetric",
                "kms:DescribeKey",
                "kms:ListAliases",
                "lambda:GetPolicy",
                "lambda:ListFunctions",
                "lex:*",
                "polly:DescribeVoices",
                "polly:SynthesizeSpeech"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:AddPermission",
                "lambda:RemovePermission"
            ],
            "Resource": "arn:aws:lambda:*:*:function:AmazonLex*",
            "Condition": {
                "StringLike": {
                    "lambda:Principal": "lex.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:DeleteRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/lex.amazonaws.com/AWSServiceRoleForLexBots",
                "arn:aws:iam::*:role/aws-service-role/channels.lex.amazonaws.com/AWSServiceRoleForLexChannels"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/lex.amazonaws.com/AWSServiceRoleForLexBots"
            ],
            "Condition": {
                "StringLike": {
                    "iam:AWSServiceName": "lex.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:DeleteServiceLinkedRole",
                "iam:GetServiceLinkedRoleDeletionStatus"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/lex.amazonaws.com/AWSServiceRoleForLexBots"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:DetachRolePolicy"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/lex.amazonaws.com/AWSServiceRoleForLexBots"
            ],
            "Condition": {
                "StringLike": {
                    "iam:PolicyArn": "arn:aws:iam::aws:policy/aws-service-role/AmazonLexBotPolicy"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/channels.lex.amazonaws.com/AWSServiceRoleForLexChannels"
            ],
            "Condition": {
                "StringLike": {
                    "iam:AWSServiceName": "channels.lex.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:DeleteServiceLinkedRole",
                "iam:GetServiceLinkedRoleDeletionStatus"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/channels.lex.amazonaws.com/AWSServiceRoleForLexChannels"
            ]
        },{
            "Effect": "Allow",
            "Action": [
                 "sumerian:ViewRelease"
             ],
             "Resource": [
                "*"
            ]

        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:DetachRolePolicy"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/channels.lex.amazonaws.com/AWSServiceRoleForLexChannels"
            ],
            "Condition": {
                "StringLike": {
                    "iam:PolicyArn": "arn:aws:iam::aws:policy/aws-service-role/LexChannelPolicy"
                }
            }
        }
    ]
}
```
- 選擇 __Review policy__，命名後選擇 __Create policy__.

    > 這個 IAM policy 能夠授權你的 Amazon Sumerian 場景能夠使用 Amazon Lex 的資源，並讓你的應用程式能夠讀取 Amazon Sumerian 場景。

- 對 __UnauthRolename__ 進行與 __AuthRolename__ 相同的新增步驟。
    > 新增 IAM policy。

- 回到 AWS 主控台選擇 __Services__ ，選擇 __Cognito__。 

- 選擇 __Manage Identity Pools__。

- 貼上剛剛複製的 __IdentityPoolName__，然後在右上角選擇 __Edit identity pool__ 。

- 展開 __Unauthenticated identities__，勾選 __Enable access to unauthenticated identities__ 。

<center>
<img src="./images/017-identity pool_check-01.jpg" alt="017-identity pool_check-01.jpg">
</center>

- 複製 __Identity pool ID__，待會兒會用到。

<center>
<img src="./images/018-identity pool_copy-01.jpg" alt="018-identity pool_copy-01.jpg">
</center>

### 建立一個 Amazon Sumerian 場景
我們將新增一個場景，並加入用來說話的主持人(Maya)，再透過設定 __Dialogue Component__ 與先前建立好的 Amazon Lex 語音機器人做連結，賦予主持人(Maya)擁有語音對話的功能，最後再匯出一個不公開的 Amazon Sumerian 場景以便我們應用程式使用。

- 開啟 AWS 主控台選擇 __Service__，選擇 __Amazon Sumerian__ ，將會跳轉到 __Amazon Sumerian Dashboard__ 的網頁。


- 選擇 __Create new scene__，並替場景取一個 __Scene name__。

- 在左上角的 Entities 列表中點選 __yourscenename__，然後展開右邊列表的 __AWS Configuration__。

    >如果不先點選場景的話，可能不會看到右邊的列表。


<center>
<img src="./images/019-Sumerian_update-01.jpg" alt="019-Sumerian_update-01.jpg" width="40%>
</center>

- 展開 __AWS Configuration__ 列表，貼上剛剛複製的 __Cognito Identity Pool ID__。

    >此步驟是讓這個場景能夠使用剛剛在 Cognito 中所設定的權限。 

<center>
<img src="./images/020-Sumerian_ID-01.jpg" alt="020-Sumerian_ID-01.jpg">
</center>

- 選擇 __Import Assets__，點選 __Maya__ 並點選右下角 __Add__。

<center>
<img src="./images/021-Sumerian host_import-01.jpg" alt="021-Sumerian host_import-01.jpg">
</center>


- __Maya__ 會顯示在左下角 __Assets__ 的清單中。

<center>
<img src="./images/022-Sumerian host_import-02.jpg" alt="022-Sumerian host_import-02.jpg">
</center>


- 需要將 __Maya__ 拖曳進場景之中才可以看到 __Maya__。


<center>
<img src="./images/023-Sumerian host_import-03.jpg" alt="023-Sumerian host_import-03.jpg">
</center>

> 注意 : 你可能需要放大才看的到。

<center>
<img src="./images/024-Sumerian host_import-04.jpg" alt="024-Sumerian host_import-04.jpg">
</center>


- 在左上角 Entities 清單選擇 __Maya__，並於右方列表選擇 __Add component__ 並選擇 __Dialogue__。


<center>
<img src="./images/025-Sumerian config_add dialogue-01.jpg" alt="025-Sumerian config_add dialogue-01.jpg">
</center>

- 輸入先前創建的 Amazon Lex 語音機器人的 __Name__ 與 __Alias__。
    > 此步驟是賦予 Maya 擁有 Amazon Lex 語音機器人的功能。


<center>
<img src="./images/026-Sumerian config_add dialogue-02.jpg" alt="026-Sumerian config_add dialogue-02.jpg">
</center>


- 在左上角 Entities 清單選擇 __Maya__，並於右方點選 __Add component__ 選擇 __State Machine__。


<center>
<img src="./images/027-Sumerian config_add state machine-01.jpg" alt="027-Sumerian config_add state machine-01.jpg">
</center>

- 展開右方清單中的 __State Machine__，選按 __PLUS__ 按鈕來新增一個新的動作元件。


<center>
<img src="./images/028-Sumerian config_add state machine-02.jpg" alt="028-Sumerian config_add state machine-02.jpg">
</center>

- 替 __name__ 重新命名為 : `ChatBot`。

<center>
<img src="./images/029-Sumerian config_add state machine-03.jpg" alt="029-Sumerian config_add state machine-03.jpg">
</center>

> 接著我們要替這個動作元件新增不同的狀態(state)。

- 替 __State 1__ 重新命名為 : `Start`，並選擇 __Add Action__。


<center>
<img src="./images/030-Sumerian config_add state machine-04.jpg" alt="029-Sumerian config_add state machine-04.jpg">
</center>

- 搜尋 `AWS SDK Ready` 並選擇 __Add__ 來新增動作。


<center>
<img src="./images/031-Sumerian config_add state machine-05.jpg" alt="031-Sumerian config_add state machine-05.jpg">
</center>


- 點擊 __Add State__ __5__ 次。 


<center>
<img src="./images/032-state action_add-01.jpg" alt="032-state action_add-01.jpg">
</center>

-  依序替新增的動作階段命名 :

    __State 1__ : `Wait for Input`

    __State 2__ : `Start Recording`

    __State 3__ : `Stop Recording`

    __State 4__ : `Process with Lex`

    __State 5__ : `Play Response`


<center>
<img src="./images/033-state action_add-02.jpg" alt="033-state action_add-02.jpg">
</center>

- 選擇 __Wait for Input__，新增一個 __Key Down__ 的動作。

<center>
<img src="./images/034-state action_add-03.jpg" alt="034-state action_add-03.jpg">
</center>

- 更改按鍵為 : __T__。


<center>
<img src="./images/035-state action_add-04.jpg" alt="035-state action_add-04.jpg">
</center>

- 選擇 __Start Recording__，新增 __Start Microphone Recording__ 和 __Key Up__ 這兩個動作。


<center>
<img src="./images/036-state action_add-05.jpg" alt="036-state action_add-05.jpg">
</center>


- 選擇 __Stop Recording__，新增 __Stop Microphone Recording__ 這個動作。


<center>
<img src="./images/037-state action_add-06.jpg" alt="037-state action_add-06.jpg">
</center>


- 選擇 __Process with Lex__，新增 __Send Audio Input to Dialogue Bot__ 這個動作。


<center>
<img src="./images/038-state action_add-07.jpg" alt="038-state action_add-07.jpg">
</center>

> 不要勾選 Log user input 和 Log bot respons。


- 選擇 __Play Response__，新增 __Start Speech__ 並勾選 __Use Lex Response__。


<center>
<img src="./images/039-state action_add-08.jpg" alt="039-state action_add-08.jpg">
</center>


- 透過 __拖曳箭頭__ 的方式替階段新增順序。 

    > 在 "Process With Lex" 這個階段的順序，請從 "On Response Ready output" 開始拖曳。


<center>
<img src="./images/040-state action_add-09.jpg" alt="040-state action_add-09.jpg">
</center>

> 完成後如下圖。

<center>
<img src="./images/041-state action_final-10.jpg" alt="041-state action_final-10.jpg">
</center>


> 注意 : Amazon Sumerian 會定期自動存檔，但仍建議定期點選左上角選單手動存檔。

- 點選右上角 __Publish__，選擇 __Host privately__ 後，選擇 __Publish__。

<center>
<img src="./images/042-Sumerian scene_publish-01.jpg" alt="042-Sumerian scene_publish-01.jpg">
</center>

> 如果已經是匯出的狀態，請先 __Unpublish__ 然後再次 __Publish__。

<center>
<img src="./images/043-Sumerian scene_publish-02.jpg" alt="043-Sumerian scene_publish-02.jpg">
</center>

- 不公開匯出會是一個 JSON 檔，請 __Download JSON configuration__。

- 將下載的 JSON 檔複製到我們專案的 __src__ 資料夾中並改名 `sumerian-exports.js`。


<center>
<img src="./images/044-Sumerian scene_publish-03.jpg" alt="044-Sumerian scene_publish-03.jpg">
</center>

- 修改 __sumerian-export.js__ 如下圖。

<center>
<img src="./images/045-JSON file_update-01.jpg" alt="045-JSON file_update-01.jpg">
</center>

> 現在我們已經將所有的步驟完成，可先透過 command line 於地端測試專案。

- 輸入 `npm start` 指令，在本地執行應用程式。

<center>
<img src="./images/046-run app_start-01.jpg" alt="046-run app_start-01.jpg">
</center>

> 它會自動跳轉到網頁。

- __Create account__ 後 __Login__， 你就會看到正在載入的 Sumerian 場景。


<center>
<img src="./images/047-run app_start-02.jpg" alt="047-run app_start-02.jpg">
</center>

<center>
<img src="./images/048-run app_start-03.jpg" alt="048-run app_start-03.jpg">
</center>

- 按著 __T__ 便可與她對話。

    > 說出 "Book a hotel" 或 "Book a car" 這兩個關鍵字可以觸發回應。

    > 在 VScode 終端機中按下 "Ctrl+c" 可以結束測試。

### 利用頭戴式裝置測試應用程式

- 輸入 `amplify add hosting` 指令，開始進行匯出設定。

- 選擇 __DEV__。

<center>
<img src="./images/049-add hosting_set up-01.jpg" alt="049-add hosting_set up-01.jpg">
</center>

- 輸入你的 __hosting bucket name__，並選擇 :

    - index doc for the website : `index.html`

    - error doc for the website : `index.html`


<center>
<img src="./images/050-add hosting_set up-02.jpg" alt="050-add hosting_set up-02.jpg">
</center>

- 輸入 `amplify publish` 指令，匯出應用程式。

    > 匯出成一個 URL，可利用任何頭戴式裝置或行動裝置開啟。

<center>
<img src="./images/051-add hosting_publish-01.jpg" alt="051-add hosting_publish-01.jpg">
</center>

## 結論
現在你學會了如何安裝與設定 AWS Amplify CLI 以及利用 AWS Amplify 創建應用程式。也學會如何建立 Amazon Sumerian 場景，並加入主持人與 Amazon Lex 的語音機器人做連結，並透過不公開的方式將 Amazon Sumerian 場景匯出，整合於你的應用程式或其他裝置中，創造出屬於自己的虛擬語音助理。


## 參考網址
- [Using the Dialogue Component and Amazon Lex to Build a Chatbot](https://docs.sumerian.amazonaws.com/tutorials/create/beginner/dialogue-component/)

- [AWS Amplify](https://aws-amplify.github.io/docs/)

- [Amazon Lex Programming Model](https://docs.aws.amazon.com/zh_tw/lex/latest/dg/programming-model.html)