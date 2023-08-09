# floating-chat dummy API

이 서버는 fixture 안에 있는 내용으로만 응답합니다.  
테스트 이외에 사용하지 마시오.

## 개념

* Chat: 대화.  
  사실 `conversation`이라고 부르던데 너무 길어서 효율상 축약하여 부름
* Context: 대화의 맥락. Object.  
  `courseId` 같은 게 여기로.
* Message: 질문-대답의 쌍. `{ question, answer[, feedback] }`.  
  API에 보니까 parentId도 있고 하던데 이게 어떤건지에 따라서 바뀔 가능성이…

## History

### GET `/history`

* Params (key-value pair as URL param)
  * any key/value: Context
* Return (application/json)
  * `chatid`: ChatID
  * `title`: String
  * `context`: 해당 대화의 Context

주어진 Context로 대화 목록을 찾아옵니다.  
chatid 제외, Context의 키가 겹치는 것 중 내용 불일치가 없는 것을 찾아서 목록을 반환합니다.

### PUT `/history`

* Params (application/json as HTTP body)
  * `context`: Context
* Return (application/json)
  * `chatid`: ChatID

주어진 Context로 새 대화를 만듭니다.

### GET `/history/:chatid`

* Params (URL)
  * `chatid`: ChatID
* Return (application/json)
  * `title`: String (TODO)
  * `history`: Message[]

요청한 대화의 히스토리'만' 가져옵니다.

### DELETE `/history/:id`

* Params (URL)
  * `chatid`: ChatID
* Return (HTTP)
  * 204

요청한 대화를 삭제합니다. 응답은 확인하지 않습니다.

## Messages

### POST `/`

* Params (application/json as HTTP body)
  * `chatid`: ChatID
  * `question`: String
* Return (text/event-stream)
  * Event `message` (default)
    * `data`: String; 응답의 일부분  
      현재는 날아오는 데이터 조각마다 공백으로 이어붙여서 보여주고 있는데, Upstage API는 이걸 한 글자씩 보내주고 있어서 고민입니다…
  * Event `close`
    * `data`: MessageID  
      아마도 이 ID를 피드백 보내는 데 사용하지 않을지…

이미 존재하는 대화에 질문을 추가합니다.  
질문 답변은 fixture/ 아래에 써있는대로 제멋대로 생성됩니다. 절대로 반드시 테스트로만 사용하십시오.

### PUT `/:messageId`

* Params (URL)
  * `messageId`: MessageID
* Params (application/json as HTTP body)
  * `feedback`: String  
    Upstage API가 그냥 좋아요 싫어요를 `'like'` `'dislike'` 식으로 보내게 되어있길래 간단간단하게 대충
* Return (HTTP)
  * 200

이미 존재하는 대화에 피드백을 남깁니다.
