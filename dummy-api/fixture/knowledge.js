import fs from 'fs'

const KNOWLEDGE = [
  {
    "keywords": [ "몬스터", "울트라", "시트라" ],
    "response": "몬스터 에너지 울트라 시트라! 이 이름은 특이하게 생긴 프랑스 자동차나 스칸디나비아 보드카에서 온 것은 아닙니다. 고대부터 유래된 과일 시트론에서 영감을 받아 태어난 이 제품은, 레몬과 비슷하지만 더 원초적이고 투박합니다. 마치 몬스터 에너지처럼요. 이 고대의 과일과 선조들에게서 영감을 얻은 우리는 전형적인 드링크를 새롭게 해석한 울트라 시트라를 만들었습니다. 울트라 시트라는 새콤달콤한 맛이 입 안에서 잔잔하게 퍼지며 상쾌한 맛으로 마무리하죠. 저칼로리에 무설탕이지만 몬스터 에너지만의 블렌드는 변함없이 가득 담겨있답니다."
  }, {
    "keywords": [ "몬스터", "파이프라인", "펀치" ],
    "response": "전세계적으로 유명한 파도인 하와이 오아후 섬 노스쇼어 비치 '반자이 파이프라인'은 매년 겨울 짧은 기간 동안 최고의 파도를 만들어내죠. 그 자연의 위대함에 경의를 표하며, 우리는 몬스터 에너지 파이프라인 펀치를 창조했습니다. 하와이를 대표하는 과일들인 패션프루트, 오렌지, 구아바에 우리의 대표적인 에너지 블렌드를 더해 \"몬스터화\"해냈습니다. 그리고 이름을 딴 파도에 어울리게 전설이 될 운명이죠!"
  }, {
    "keywords": [ "몬스터", "울트라" ],
    "response": "어떤 경우에도 만족하지 못하는 사람들이 있습니다. 사람들은 늘 새로운 것, 더 좋은 것을 원하죠. Monster 팀과 Girl 들도 마찬가지라서, 남들과 다른 제품, 이전에 없던 제품에 대한 힌트를 던져주고는 합니다. 그래서 에너지 드링크의 설탕을 빼고 칼로리를 확 줄였습니다. 하지만 몬스터 에너지 블렌드만의 폭발적인 기운은 그대로 담았죠! 몬스터의 새로운 트렌드는 화이트입니다. 몬스터 에너지 울트라로 칼로리 부담 없이 내 안의 야성을 깨워보세요!"
  }, {
    "keywords": [ "무슨" ],
    "response": "아직 임시 구현으로, 몇 가지 정해진 단어에만 반응하게 만들어진 상태입니다. 대화 내용은 무시해주세요."
  }, {
    "keywords": [ "헌법", "제1조", "1조" ],
    "response": "1. 대한민국은 민주공화국이다.\n2. 대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다."
  }, {
    "keywords": [ "헌법", "제2조", "2조" ],
    "response": "1. 대한민국의 국민이 되는 요건은 법률로 정한다.\n2. 국가는 법률이 정하는 바에 의하여 재외국민을 보호할 의무를 진다."
  }, {
    "keywords": [ "헌법", "제3조", "3조" ],
    "response": "대한민국의 영토는 한반도와 그 부속도서로 한다."
  }, {
    "keywords": [ "헌법", "제4조", "4조" ],
    "response": "대한민국은 통일을 지향하며, 자유민주적 기본질서에 입각한 평화적 통일정책을 수립하고 이를 추진한다."
  }, {
    "keywords": [ "헌법", "제5조", "5조" ],
    "response": "1. 대한민국은 국제평화의 유지에 노력하고 침략적 전쟁을 부인한다.\n2. 국군은 국가의 안전보장과 국토방위의 신성한 의무를 수행함을 사명으로 하며, 그 정치적 중립성은 준수된다."
  }, {
    "keywords": [ "헌법", "제6조", "6조" ],
    "response": "1. 헌법에 의하여 체결ㆍ공포된 조약과 일반적으로 승인된 국제법규는 국내법과 같은 효력을 가진다.\n2. 외국인은 국제법과 조약이 정하는 바에 의하여 그 지위가 보장된다."
  }, {
    "keywords": [ "헌법", "제7조", "7조" ],
    "response": "1. 공무원은 국민전체에 대한 봉사자이며, 국민에 대하여 책임을 진다.\n2. 공무원의 신분과 정치적 중립성은 법률이 정하는 바에 의하여 보장된다."
  }, {
    "keywords": [ "헌법", "제8조", "8조" ],
    "response": "1. 정당의 설립은 자유이며, 복수정당제는 보장된다.\n2. 정당은 그 목적ㆍ조직과 활동이 민주적이어야 하며, 국민의 정치적 의사형성에 참여하는데 필요한 조직을 가져야 한다.\n3. 정당은 법률이 정하는 바에 의하여 국가의 보호를 받으며, 국가는 법률이 정하는 바에 의하여 정당운영에 필요한 자금을 보조할 수 있다.\n4. 정당의 목적이나 활동이 민주적 기본질서에 위배될 때에는 정부는 헌법재판소에 그 해산을 제소할 수 있고, 정당은 헌법재판소의 심판에 의하여 해산된다."
  }, {
    "keywords": [ "헌법", "제9조", "9조" ],
    "response": "국가는 전통문화의 계승ㆍ발전과 민족문화의 창달에 노력하여야 한다."
  }, {
    "keywords": [ "헌법", "제10조", "10조" ],
    "response": "모든 국민은 인간으로서의 존엄과 가치를 가지며, 행복을 추구할 권리를 가진다. 국가는 개인이 가지는 불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다."
  }, {
    "keywords": [ "헌법", "제11조", "11조" ],
    "response": "1. 모든 국민은 법 앞에 평등하다. 누구든지 성별ㆍ종교 또는 사회적 신분에 의하여 정치적ㆍ경제적ㆍ사회적ㆍ문화적 생활의 모든 영역에 있어서 차별을 받지 아니한다.\n2. 사회적 특수계급의 제도는 인정되지 아니하며, 어떠한 형태로도 이를 창설할 수 없다.\n3. 훈장등의 영전은 이를 받은 자에게만 효력이 있고, 어떠한 특권도 이에 따르지 아니한다."
  }, {
    "keywords": [ "헌법", "제12조", "12조" ],
    "response": "1. 모든 국민은 신체의 자유를 가진다. 누구든지 법률에 의하지 아니하고는 체포ㆍ구속ㆍ압수ㆍ수색 또는 심문을 받지 아니하며, 법률과 적법한 절차에 의하지 아니하고는 처벌ㆍ보안처분 또는 강제노역을 받지 아니한다.\n2. 모든 국민은 고문을 받지 아니하며, 형사상 자기에게 불리한 진술을 강요당하지 아니한다.\n3. 체포ㆍ구속ㆍ압수 또는 수색을 할 때에는 적법한 절차에 따라 검사의 신청에 의하여 법관이 발부한 영장을 제시하여야 한다. 다만, 현행범인인 경우와 장기 3년 이상의 형에 해당하는 죄를 범하고 도피 또는 증거인멸의 염려가 있을 때에는 사후에 영장을 청구할 수 있다.\n4. 누구든지 체포 또는 구속을 당한 때에는 즉시 변호인의 조력을 받을 권리를 가진다. 다만, 형사피고인이 스스로 변호인을 구할 수 없을 때에는 법률이 정하는 바에 의하여 국가가 변호인을 붙인다.\n5. 누구든지 체포 또는 구속의 이유와 변호인의 조력을 받을 권리가 있음을 고지받지 아니하고는 체포 또는 구속을 당하지 아니한다. 체포 또는 구속을 당한 자의 가족등 법률이 정하는 자에게는 그 이유와 일시ㆍ장소가 지체없이 통지되어야 한다.\n6. 누구든지 체포 또는 구속을 당한 때에는 적부의 심사를 법원에 청구할 권리를 가진다.\n7. 피고인의 자백이 고문ㆍ폭행ㆍ협박ㆍ구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다."
  }, {
    "keywords": [ "헌법", "제13조", "13조" ],
    "response": "1. 모든 국민은 행위시의 법률에 의하여 범죄를 구성하지 아니하는 행위로 소추되지 아니하며, 동일한 범죄에 대하여 거듭 처벌받지 아니한다.\n2. 모든 국민은 소급입법에 의하여 참정권의 제한을 받거나 재산권을 박탈당하지 아니한다.\n3. 모든 국민은 자기의 행위가 아닌 친족의 행위로 인하여 불이익한 처우를 받지 아니한다."
  }, {
    "keywords": [ "헌법", "제14조", "14조" ],
    "response": "모든 국민은 거주ㆍ이전의 자유를 가진다."
  }, {
    "keywords": [ "헌법", "제15조", "15조" ],
    "response": "모든 국민은 직업선택의 자유를 가진다."
  }, {
    "keywords": [ "헌법", "제16조", "16조" ],
    "response": "모든 국민은 주거의 자유를 침해받지 아니한다. 주거에 대한 압수나 수색을 할 때에는 검사의 신청에 의하여 법관이 발부한 영장을 제시하여야 한다."
  }, {
    "keywords": [ "헌법", "제17조", "17조" ],
    "response": "모든 국민은 사생활의 비밀과 자유를 침해받지 아니한다."
  }, {
    "keywords": [ "헌법", "제18조", "18조" ],
    "response": "모든 국민은 통신의 비밀을 침해받지 아니한다."
  }, {
    "keywords": [ "헌법", "제19조", "19조" ],
    "response": "모든 국민은 양심의 자유를 가진다."
  }, {
    "keywords": [ "헌법", "제20조", "20조" ],
    "response": "1. 모든 국민은 종교의 자유를 가진다.\n2. 국교는 인정되지 아니하며, 종교와 정치는 분리된다.\n \n# 제21조\n1. 모든 국민은 언론ㆍ출판의 자유와 집회ㆍ결사의 자유를 가진다.\n2. 언론ㆍ출판에 대한 허가나 검열과 집회ㆍ결사에 대한 허가는 인정되지 아니한다.\n3. 통신ㆍ방송의 시설기준과 신문의 기능을 보장하기 위하여 필요한 사항은 법률로 정한다.\n4. 언론ㆍ출판은 타인의 명예나 권리 또는 공중도덕이나 사회윤리를 침해하여서는 아니된다. 언론ㆍ출판이 타인의 명예나 권리를 침해한 때에는 피해자는 이에 대한 피해의 배상을 청구할 수 있다."
  }, {
    "keywords": [ "헌법", "제22조", "22조" ],
    "response": "1. 모든 국민은 학문과 예술의 자유를 가진다.\n2. 저작자ㆍ발명가ㆍ과학기술자와 예술가의 권리는 법률로써 보호한다."
  }, {
    "keywords": [ "헌법", "제23조", "23조" ],
    "response": "1. 모든 국민의 재산권은 보장된다. 그 내용과 한계는 법률로 정한다.\n2. 재산권의 행사는 공공복리에 적합하도록 하여야 한다.\n3. 공공필요에 의한 재산권의 수용ㆍ사용 또는 제한 및 그에 대한 보상은 법률로써 하되, 정당한 보상을 지급하여야 한다."
  }, {
    "keywords": [ "헌법", "제24조", "24조" ],
    "response": "모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다."
  }, {
    "keywords": [ "헌법", "제25조", "25조" ],
    "response": "모든 국민은 법률이 정하는 바에 의하여 공무담임권을 가진다."
  }, {
    "keywords": [ "헌법", "제26조", "26조" ],
    "response": "1. 모든 국민은 법률이 정하는 바에 의하여 국가기관에 문서로 청원할 권리를 가진다.\n2. 국가는 청원에 대하여 심사할 의무를 진다."
  }, {
    "keywords": [ "헌법", "제27조", "27조" ],
    "response": "1. 모든 국민은 헌법과 법률이 정한 법관에 의하여 법률에 의한 재판을 받을 권리를 가진다.\n2. 군인 또는 군무원이 아닌 국민은 대한민국의 영역 안에서는 중대한 군사상 기밀ㆍ초병ㆍ초소ㆍ유독음식물공급ㆍ포로ㆍ군용물에 관한 죄중 법률이 정한 경우와 비상계엄이 선포된 경우를 제외하고는 군사법원의 재판을 받지 아니한다.\n3. 모든 국민은 신속한 재판을 받을 권리를 가진다. 형사피고인은 상당한 이유가 없는 한 지체없이 공개재판을 받을 권리를 가진다.\n4. 형사피고인은 유죄의 판결이 확정될 때까지는 무죄로 추정된다.\n5. 형사피해자는 법률이 정하는 바에 의하여 당해 사건의 재판절차에서 진술할 수 있다."
  }, {
    "keywords": [ "헌법", "제28조", "28조" ],
    "response": "형사피의자 또는 형사피고인으로서 구금되었던 자가 법률이 정하는 불기소처분을 받거나 무죄판결을 받은 때에는 법률이 정하는 바에 의하여 국가에 정당한 보상을 청구할 수 있다."
  }, {
    "keywords": [ "헌법", "제29조", "29조" ],
    "response": "1. 공무원의 직무상 불법행위로 손해를 받은 국민은 법률이 정하는 바에 의하여 국가 또는 공공단체에 정당한 배상을 청구할 수 있다. 이 경우 공무원 자신의 책임은 면제되지 아니한다.\n2. 군인ㆍ군무원ㆍ경찰공무원 기타 법률이 정하는 자가 전투ㆍ훈련등 직무집행과 관련하여 받은 손해에 대하여는 법률이 정하는 보상 외에 국가 또는 공공단체에 공무원의 직무상 불법행위로 인한 배상은 청구할 수 없다."
  }, {
    "keywords": [ "헌법", "제30조", "30조" ],
    "response": "타인의 범죄행위로 인하여 생명ㆍ신체에 대한 피해를 받은 국민은 법률이 정하는 바에 의하여 국가로부터 구조를 받을 수 있다."
  }, {
    "keywords": [ "헌법", "제31조", "31조" ],
    "response": "1. 모든 국민은 능력에 따라 균등하게 교육을 받을 권리를 가진다.\n2. 모든 국민은 그 보호하는 자녀에게 적어도 초등교육과 법률이 정하는 교육을 받게 할 의무를 진다.\n3. 의무교육은 무상으로 한다.\n4. 교육의 자주성ㆍ전문성ㆍ정치적 중립성 및 대학의 자율성은 법률이 정하는 바에 의하여 보장된다.\n5. 국가는 평생교육을 진흥하여야 한다.\n6. 학교교육 및 평생교육을 포함한 교육제도와 그 운영, 교육재정 및 교원의 지위에 관한 기본적인 사항은 법률로 정한다."
  }, {
    "keywords": [ "헌법", "제32조", "32조" ],
    "response": "1. 모든 국민은 근로의 권리를 가진다. 국가는 사회적ㆍ경제적 방법으로 근로자의 고용의 증진과 적정임금의 보장에 노력하여야 하며, 법률이 정하는 바에 의하여 최저임금제를 시행하여야 한다.\n2. 모든 국민은 근로의 의무를 진다. 국가는 근로의 의무의 내용과 조건을 민주주의원칙에 따라 법률로 정한다.\n3. 근로조건의 기준은 인간의 존엄성을 보장하도록 법률로 정한다.\n4. 여자의 근로는 특별한 보호를 받으며, 고용ㆍ임금 및 근로조건에 있어서 부당한 차별을 받지 아니한다.\n5. 연소자의 근로는 특별한 보호를 받는다.\n6. 국가유공자ㆍ상이군경 및 전몰군경의 유가족은 법률이 정하는 바에 의하여 우선적으로 근로의 기회를 부여받는다."
  }, {
    "keywords": [ "헌법", "제33조", "33조" ],
    "response": "1. 근로자는 근로조건의 향상을 위하여 자주적인 단결권ㆍ단체교섭권 및 단체행동권을 가진다.\n2. 공무원인 근로자는 법률이 정하는 자에 한하여 단결권ㆍ단체교섭권 및 단체행동권을 가진다.\n3. 법률이 정하는 주요방위산업체에 종사하는 근로자의 단체행동권은 법률이 정하는 바에 의하여 이를 제한하거나 인정하지 아니할 수 있다."
  }, {
    "keywords": [ "헌법", "제34조", "34조" ],
    "response": "1. 모든 국민은 인간다운 생활을 할 권리를 가진다.\n2. 국가는 사회보장ㆍ사회복지의 증진에 노력할 의무를 진다.\n3. 국가는 여자의 복지와 권익의 향상을 위하여 노력하여야 한다.\n4. 국가는 노인과 청소년의 복지향상을 위한 정책을 실시할 의무를 진다.\n5. 신체장애자 및 질병ㆍ노령 기타의 사유로 생활능력이 없는 국민은 법률이 정하는 바에 의하여 국가의 보호를 받는다.\n6. 국가는 재해를 예방하고 그 위험으로부터 국민을 보호하기 위하여 노력하여야 한다."
  }, {
    "keywords": [ "헌법", "제35조", "35조" ],
    "response": "1. 모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가와 국민은 환경보전을 위하여 노력하여야 한다.\n2. 환경권의 내용과 행사에 관하여는 법률로 정한다.\n3. 국가는 주택개발정책등을 통하여 모든 국민이 쾌적한 주거생활을 할 수 있도록 노력하여야 한다."
  }, {
    "keywords": [ "헌법", "제36조", "36조" ],
    "response": "1. 혼인과 가족생활은 개인의 존엄과 양성의 평등을 기초로 성립되고 유지되어야 하며, 국가는 이를 보장한다.\n2. 국가는 모성의 보호를 위하여 노력하여야 한다.\n3. 모든 국민은 보건에 관하여 국가의 보호를 받는다."
  }, {
    "keywords": [ "헌법", "제37조", "37조" ],
    "response": "1. 국민의 자유와 권리는 헌법에 열거되지 아니한 이유로 경시되지 아니한다.\n2. 국민의 모든 자유와 권리는 국가안전보장ㆍ질서유지 또는 공공복리를 위하여 필요한 경우에 한하여 법률로써 제한할 수 있으며, 제한하는 경우에도 자유와 권리의 본질적인 내용을 침해할 수 없다."
  }, {
    "keywords": [ "헌법", "제38조", "38조" ],
    "response": "모든 국민은 법률이 정하는 바에 의하여 납세의 의무를 진다."
  }, {
    "keywords": [ "헌법", "제39조", "39조" ],
    "response": "1. 모든 국민은 법률이 정하는 바에 의하여 국방의 의무를 진다.\n2. 누구든지 병역의무의 이행으로 인하여 불이익한 처우를 받지 아니한다."
  }, {
    "keywords": [ "" ],
    "response": "무슨 말인지 잘 모르겠네요!"
  }
]

export default function searchKnowledge(question) {
  const tokens = question.split(' ')
  const matches = KNOWLEDGE.map(_ => ({
    weight: tokens.reduce((p, c) => p + _.keywords.includes(c), 0),
    ..._
  }))
  return matches.reduce((p, c) => p.weight > c.weight? p : c)
}