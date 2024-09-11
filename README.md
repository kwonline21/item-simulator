# item-simulator
## 질문과 답변

i. 암호화 방식
  * 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
  => 단방향 암호화 방식입니다.
  * 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
  => 암호화된 비밀번호만 가지고 있기 때문에 데이터베이스가 악의적인 의도에 의해 탈취되더라도 개인정보를 보호할 수 있습니다.

ii. 인증 방식
  * JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
  => 서버에서도 Access Token을 제어할 수 없기 때문에 토큰이 만료될 때까지 데이터가 무방비로 노출됩니다.
  * 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
  => Access Token의 만료 시간을 짧게 설정하고 Access Token을 재발급 받기 위한 Refresh Token을 최초 로그인 시 Access Token과 함께 발급하여 보완할 수 있습니다.

iii. 인증과 인가
  * 인증과 인가가 무엇인지 각각 설명해 주세요.
  => 인증 : 서비스를 이용하려는 사용자가 인증된 신분을 가진 사람이 맞는지 검증하는 작업입니다. 최초에 로그인을 할 때 해당합니다.
  => 인가 : 이미 인증된 사용자가 특정 작업을 수행할 수 있는 권한이 있는지를 검증하는 작업입니다. 로그인 후에 개인정보 접근 등 특정한 권한이 필요할 때 해당합니다.

iv. Http Status Code
